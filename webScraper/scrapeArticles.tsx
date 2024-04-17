const SODList2 = require("../data/lists/SOD.js");
const axios2 = require("axios");
const cheerio2 = require("cheerio");
const fs2 = require("fs");
const path = require("path");

// @types/cheerio
// https://www.npmjs.com/package/@types/cheerio
// npm install --save @types/cheerio
// npm i @types/node

// How to run:
// node scrapeArticles.tsx

let articleList = [
  {
    month: "January",
    date: "January 1",
    title: "Circumcision of Our Lord",
    href: "../../../../../data/articles/SOD/j161sd_Circumcision_1-1.html",
    // link: "https://traditioninaction.org/SOD/j161sd_Circumcision_1-1.html",
    link: "https://traditioninaction.org/SOD/j065sdStJoseph3-19.htm",
  },
  // {
  //   month: "January",
  //   date: "January 2",
  //   title: "St. Basil the Great",
  //   href: "../../../../../data/articles/SOD/j293sd_Basili_1-2.html",
  //   link: "https://traditioninaction.org/SOD/j293sd_Basili_1-2.htm",
  // },
  // {
  //   month: "January",
  //   date: "January 2",
  //   title: "St. Macarius of Alexandria",
  //   href: "../../../../../data/articles/SOD/j162sd_St.Marcarius_1-02.html",
  //   link: "https://traditioninaction.org/SOD/j162sd_St.Marcarius_1-02.html",
  // },
];

function main() {
  scrapeAll(articleList);
}

main();
// const SODArticle =
// "https://traditioninaction.org/SOD/j197sd_FrancisAssisr_10-04.html";

const findCategory = (stringURL) => {
  let category = stringURL.split("/")[3];
  return category;
};

const findLink = (stringURL) => {
  let link = stringURL.split("/")[4];
  link = link.split(".htm")[0];
  return link;
};

function extractFolderName(imageUrl) {
  const folders = imageUrl.split("/");
  return folders[0];
}

function extractFileName(imageUrl) {
  const folders = imageUrl.split("/");
  return folders[1];
}

function getImageURLs($articleNode) {
  const images = $articleNode("img[src]");
  return images.map((index, element) => {
    return $articleNode(element).attr("src");
  });
}

async function downloadAndWriteImage(image, category, cwd, filePath) {
  if (!fs2.existsSync(path.dirname(filePath))) {
    fs2.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  try {
    const imageURL = `https://traditioninaction.org/${category}/${image}`;
    const response = await axios2.get(imageURL, {
      responseType: "arraybuffer",
    });
    fs2.writeFileSync(filePath, response.data);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

function makePathForImage(cwd, directoryName, fileName) {
  return path.join(cwd, "assets", directoryName, fileName);
}

/**
 * I process this one separately because so and so.
 */
async function processFirstImage(image, cwd, category) {
  const directoryName = extractFolderName(image);
  const fileName = extractFileName(image);
  const filePath = makePathForImage(cwd, directoryName, fileName);
  await downloadAndWriteImage(image, category, cwd, filePath);

  const filePathAsset = path.join(
    cwd,
    "assets",
    "firstImages",
    category,
    "Assets.tsx"
  );

  let imageAssetFile = fs2.readFileSync(filePathAsset, "utf-8");

  // Find next number for image variable
  const regexImage = /const Image\d+/g;
  const imageMatches = [];
  let imageMatch;
  while ((imageMatch = regexImage.exec(imageAssetFile)) !== null) {
    imageMatches.push(imageMatch);
  }
  const lastMatch = imageMatches[imageMatches.length - 1];
  const nextNumber = parseInt(lastMatch[0].match(/\d+/)[0]) + 1;

  // Find position for next image variable
  const endOfAssetsIndex = imageAssetFile.indexOf("const SODImageLinks");
  if (endOfAssetsIndex !== -1) {
    imageAssetFile =
      imageAssetFile.slice(0, endOfAssetsIndex) +
      `const Image${nextNumber} = Asset.fromModule(
            require("../../assets/${directoryName}/${fileName}")
          );` +
      imageAssetFile.slice(endOfAssetsIndex);
  }

  // Find position for image object in array
  const endingSquareBracket = imageAssetFile.indexOf("];");
  if (endingSquareBracket !== -1) {
    imageAssetFile =
      imageAssetFile.slice(0, endingSquareBracket) +
      `{ image: "${directoryName}/${fileName}", asset: Image${nextNumber}},` +
      imageAssetFile.slice(endingSquareBracket);
  }

  image = `${directoryName}/${fileName}`;

  fs2.writeFileSync(filePathAsset, imageAssetFile, "utf-8");
}

async function downloadImages(finishedHTML, category) {
  const $cleanedArticle = cheerio2.load(finishedHTML);
  const images = getImageURLs($cleanedArticle);
  const cwd = process.cwd();

  const firstImage = images[0];
  await processFirstImage(firstImage, cwd, category);

  const restImages = images.slice(1);
  for (let i = 0; i < restImages.length; i++) {
    const image = images[i];
    const directoryName = extractFolderName(image);
    const fileName = extractFileName(image);
    await downloadAndWriteImage(
      image,
      category,
      cwd,
      makePathForImage(cwd, directoryName, fileName)
    );
  }

  return firstImage;
}

function processWidth($, element) {
  let widthValue = $(element).attr("width");
  if (widthValue == "607" || widthValue == 607) {
    return $(element).removeAttr("width");
  }
  if (!isNaN(widthValue)) {
    const newWidth = Math.floor(parseFloat(widthValue) * 0.6);
    return $(element).attr("width", newWidth.toString());
  }
}

function processHeight($, element) {
  let heightValue = $(element).attr("height");
  if (heightValue == "607" || heightValue == 607) {
    return $(element).removeAttr("height");
  }
  if (!isNaN(heightValue)) {
    const newHeight = Math.floor(parseFloat(heightValue) * 0.6);
    return $(element).attr("height", newHeight.toString());
  }
}

function processSize($, element) {
  const sizeValue = $(element).attr("size");
  if (!isNaN(sizeValue)) {
    const newSize = sizeValue - 1;
    return $(element).attr("size", newSize);
  }
}

function cleanImageUrl($element, category, url) {
  {
    if (url.includes("../")) {
      url = url.replace("../", "/");
    } else if (url.includes("./")) {
      url = url.replace("./", "/");
    }
    if (url.includes("shtml")) {
      url = url.replace("shtml", "html");
    } else if (url.includes("shtm")) {
      url = url.replace("shtm", "htm");
    }
    if (!url.includes("/") && !url.includes("http")) {
      url = "https://traditioninaction.org" + "/" + category + "/" + url;
    } else if (!url.includes("http")) {
      url = "https://traditioninaction.org" + url;
    }
  }
  return $element.attr("href", url);
}

async function adjustSizesAndFixURL(SODArticle) {
  const { data: html } = await axios2.get(SODArticle);
  const $ = cheerio2.load(html);

  $("[width]").each((index, element) => {
    return processWidth($, element);
  });

  $("[height]").each((index, element) => {
    return processHeight($, element);
  });

  $("[size]").each((index, element) => {
    return processSize($, element);
  });

  $("font:not([size])").each((index, element) => {
    return $(element).attr("size", 2);
  });

  let category = findCategory(SODArticle);

  $("[href]").each((index, element) => {
    const $element = $(element);
    let newHref = $element.attr("href");
    if (newHref) {
      return cleanImageUrl($element, category, newHref);
    }
  });

  return $.html();
}

function createStyleElement($) {
  let regex = /([0-9.]+)px/g;
  let scrapedStyleElements = "";

  $("style").each((index, element) => {
    const $styleHTML = $(element).html();

    // Function to multiply numerical values by 0.6
    function multiplyValues(match, p1) {
      return parseFloat(p1) * 0.6 + "px";
    }

    // Replace numerical values in the CSS object
    let adjustedCSS = $styleHTML.replace(regex, multiplyValues);

    $(element).html(adjustedCSS);

    scrapedStyleElements = scrapedStyleElements + "\n" + $(element);
  });

  scrapedStyleElements =
    scrapedStyleElements +
    "\n" +
    `<style type="text/css">
    h1 {
      text-align: center;
      color: #800000;
      font-size: 21px
    }
    .author {
      font-family: "Times New Roman", Times, serif;
      color: #000000;
      font-size: medium;
      text-align: center;
    }
  
    #bodytext {
      font-family: Arial, Helvetica, sans-serif;
      color: 0;
      text-align: left;
      margin: 10px 0px 0px 00px;
    }
  
    .subtitle {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      color: #800080;
      font-weight: bolder;
    }
  </style>`;

  return scrapedStyleElements;
}

async function getRelatedArticles(adjustedHTML) {
  const $ = cheerio2.load(adjustedHTML);

  let relatedTopics = [];
  let relatedTopicsIndex = $.html().indexOf("Related Topics of Interest");
  if (relatedTopicsIndex) {
    let relatedTopicsSection = $.html().substring(relatedTopicsIndex);
    let $relatedtopicsSection = cheerio2.load(relatedTopicsSection);
    $relatedtopicsSection("a").each((index, element) => {
      if (!$(element).text()) {
        return;
      }
      if (
        $(element).text().includes("Home") ||
        $(element).text().includes("Books") ||
        $(element).text().includes("CDs") ||
        $(element).text().includes("Search") ||
        $(element).text().includes("Contact Us") ||
        $(element).text().includes("Donate")
      ) {
        return;
      }
      relatedTopics.push({
        text: $(element).text().replace(` \n`, ""),
        href: $(element)
          .attr("href")
          .replace(
            "https://traditioninaction.org",
            "../../../../../data/articles"
          ),
      });
    });
    relatedTopics.pop();
  }

  return relatedTopics;
}

function cutArticleHTML(modifiedHTML) {
  const htmlArray = modifiedHTML.split(`alt="contact">`);
  const cleanedCode = htmlArray[1];
  const $ = cheerio2.load(cleanedCode);
  const startIndex = $.html().indexOf("<!-- AddToAny BEGIN -->");
  let cutHTML = $.html();
  if (startIndex !== -1) {
    cutHTML = cutHTML.substring(0, startIndex);
  }
  return cutHTML;
}

function updateArticleList(
  articleLink,
  articleHREF,
  firstImage,
  relatedArticles
) {
  const category = findCategory(articleLink);
  const filePath = `data/lists/${category}.js`;
  let listFile = fs2.readFileSync(filePath, "utf-8");
  const articleObjLink = listFile.indexOf(`link: "${articleLink}",`);

  if (articleObjLink !== -1) {
    listFile =
      listFile.slice(0, articleObjLink) +
      `localLink: require("${articleHREF}"),` +
      `image: require("../../assets/${firstImage}"),` +
      //conditional
      `relatedArticles: ${JSON.stringify(relatedArticles)},` +
      listFile.slice(articleObjLink);
  }
  fs2.writeFileSync(filePath, listFile, "utf-8");
}

async function scrapeArticle(articleLink, articleHREF) {
  const modifiedHTML = await adjustSizesAndFixURL(articleLink);
  const styleElements = await createStyleElement(cheerio2.load(modifiedHTML));
  const relatedArticles = await getRelatedArticles(modifiedHTML);
  let cutHTML = await cutArticleHTML(modifiedHTML);
  cutHTML =
    `<html>
  <meta name='viewport' content='width=device-width' charset='UTF-8'>` +
    styleElements +
    cutHTML;

  const category = findCategory(articleLink);
  const link = findLink(articleLink);

  const filePath = `data/articles/${category}/test.html`;
  fs2.writeFileSync(filePath, cutHTML, "utf-8");

  const firstImage = await downloadImages(cutHTML, category);
  updateArticleList(articleLink, articleHREF, firstImage, relatedArticles);

  // const pathToArticleComponent = `app/(tabs)/home/[category]/[url]/index.tsx`;
  // let articleComponent = fs2.readFileSync(pathToArticleComponent, "utf-8");

  // const elseIndex = articleComponent.indexOf("else {");
  // if (elseIndex !== -1) {
  //   const closingBraceIndex = articleComponent.indexOf("}", elseIndex);
  //   if (closingBraceIndex !== -1) {
  //     articleComponent =
  //       articleComponent.slice(0, elseIndex) +
  //       `else if (category === "${category}" && url === "${link}")
  //       { article = require(\`${articleHREF}\`);
  //     }` +
  //       articleComponent.slice(elseIndex);
  //   }
  // }

  // fs2.writeFileSync(pathToArticleComponent, articleComponent, "utf-8");
}

async function scrapeAll(articleListToScrape) {
  for (let i = 0; i < articleListToScrape.length; i++) {
    const articleLink = articleListToScrape[i].link;
    const articleHREF = articleListToScrape[i].href;
    await scrapeArticle(articleLink, articleHREF);
    // updateArticleList(articleLink);
  }
}
