const SODList2 = require("../data/lists/SOD.js");
const axios2 = require("axios");
const cheerio2 = require("cheerio");
const fs2 = require("fs");
const path = require("path");

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

const homeURL = "https://traditioninaction.org";
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

async function downloadImages(finishedHTML, category, articleLink) {
  const $cleanedArticle = cheerio2.load(finishedHTML);

  const images = $cleanedArticle("img[src]");
  const imagesArray = images.map((index, element) => {
    return $cleanedArticle(element).attr("src");
  });

  const currentWorkingDirectory = process.cwd();

  let firstImage;

  for (let i = 0; i < imagesArray.length; i++) {
    let imageURL = homeURL + "/" + category + "/" + imagesArray[i];
    const directoryName = extractFolderName(imagesArray[i]);
    const fileName = extractFileName(imagesArray[i]);
    const filePath = path.join(
      currentWorkingDirectory,
      "assets",
      directoryName,
      fileName
    );

    if (!fs2.existsSync(path.dirname(filePath))) {
      fs2.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    try {
      const response = await axios2.get(imageURL, {
        responseType: "arraybuffer",
      });
      fs2.writeFileSync(filePath, response.data);
    } catch (error) {
      console.error("Error downloading image:", error);
    }

    // Only add first image to asset list
    if (i === 0) {
      const filePathAsset = path.join(
        currentWorkingDirectory,
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

      firstImage = `${directoryName}/${fileName}`;

      fs2.writeFileSync(filePathAsset, imageAssetFile, "utf-8");
    }
  }

  return firstImage;
  // return firstImage and pass it to updateArticleList
  // along with the relatedArticles
}

let styleElements = "";

async function adjustSizesAndFixURL(SODArticle) {
  const { data: html } = await axios2.get(SODArticle);
  const $ = cheerio2.load(html);

  $("[width]").each((index, element) => {
    let widthValue = $(element).attr("width");
    if (widthValue == "607" || widthValue == 607) {
      return $(element).removeAttr("width");
    }
    if (!isNaN(widthValue)) {
      const newWidth = Math.floor(parseFloat(widthValue) * 0.6);
      return $(element).attr("width", newWidth.toString());
    }
  });

  $("[height]").each((index, element) => {
    let heightValue = $(element).attr("height");
    if (heightValue == "607" || heightValue == 607) {
      return $(element).removeAttr("height");
    }
    if (!isNaN(heightValue)) {
      const newHeight = Math.floor(parseFloat(heightValue) * 0.6);
      return $(element).attr("height", newHeight.toString());
    }
  });

  $("[size]").each((index, element) => {
    const sizeValue = $(element).attr("size");

    if (!isNaN(sizeValue)) {
      const newSize = sizeValue - 1;

      return $(element).attr("size", newSize);
    }
  });

  // Make condition if it has a style attribute
  $("font:not([size])").each((index, element) => {
    return $(element).attr("size", 2);
  });

  let category = findCategory(SODArticle);

  $("[href]").each((index, element) => {
    const $element = $(element);
    let newHref = $element.attr("href");

    if (newHref) {
      if (newHref.includes("../")) {
        newHref = newHref.replace("../", "/");
      } else if (newHref.includes("./")) {
        newHref = newHref.replace("./", "/");
      }
      if (newHref.includes("shtml")) {
        newHref = newHref.replace("shtml", "html");
      } else if (newHref.includes("shtm")) {
        newHref = newHref.replace("shtm", "htm");
      }
      if (!newHref.includes("/") && !newHref.includes("http")) {
        newHref =
          "https://traditioninaction.org" + "/" + category + "/" + newHref;
      } else if (!newHref.includes("http")) {
        newHref = "https://traditioninaction.org" + newHref;
      }
    }
    return $element.attr("href", newHref);
  });

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

  styleElements =
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

  return $.html();
}

async function getRelatedArticles(adjustedHTML) {
  // const adjustedHTML = await adjustSizesAndFixURL();

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

// let firstImageHREF = "";
// let relatedArticles;

async function cutArticleHTML(articleLink, articleHREF) {
  const modifiedHTML = await adjustSizesAndFixURL(articleLink);

  const relatedArticles = await getRelatedArticles(modifiedHTML);

  const htmlArray = modifiedHTML.split(`alt="contact">`);

  const cleanedCode = htmlArray[1];

  const $ = cheerio2.load(cleanedCode);

  const startIndex = $.html().indexOf("<!-- AddToAny BEGIN -->");

  let finishedHTML = $.html();

  // Check if the starting string is found
  if (startIndex !== -1) {
    // Use substring to remove everything after and including the starting string
    finishedHTML = finishedHTML.substring(0, startIndex);
  }

  // finishedHTML = finishedHTML.replace("–", "&ndash;");
  // finishedHTML = finishedHTML.replace("-", "&ndash;");
  // finishedHTML = finishedHTML.replace("ê", "&ecirc;");
  // finishedHTML = finishedHTML.replace("“", "&ldquo;");
  // finishedHTML = finishedHTML.replace("”", "&rdquo;");
  finishedHTML =
    `<html>
  <meta name='viewport' content='width=device-width' charset='UTF-8'>` +
    styleElements +
    finishedHTML;

  const category = findCategory(articleLink);
  const link = findLink(articleLink);

  const filePath = `data/articles/${category}/test.html`;
  fs2.writeFileSync(filePath, finishedHTML, "utf-8");

  const firstImage = await downloadImages(finishedHTML, category, articleLink);
  console.log(firstImage);
  console.log(relatedArticles);
  updateArticleList(articleLink, firstImage, relatedArticles);

  const pathToArticleComponent = `app/(tabs)/home/[category]/[url]/index.tsx`;

  let articleComponent = fs2.readFileSync(pathToArticleComponent, "utf-8");

  const elseIndex = articleComponent.indexOf("else {");
  if (elseIndex !== -1) {
    const closingBraceIndex = articleComponent.indexOf("}", elseIndex);
    if (closingBraceIndex !== -1) {
      articleComponent =
        articleComponent.slice(0, elseIndex) +
        `else if (category === "${category}" && url === "${link}") 
        { article = require(\`${articleHREF}\`);
      }` +
        articleComponent.slice(elseIndex);
    }
  }

  fs2.writeFileSync(pathToArticleComponent, articleComponent, "utf-8");

  return finishedHTML;
}

const updateArticleList = (articleLink, firstImage, relatedArticles) => {
  const category = findCategory(articleLink);
  const filePath = `data/lists/${category}.js`;
  let listFile = fs2.readFileSync(filePath, "utf-8");
  const articleObjLink = listFile.indexOf(`link: "${articleLink}",`);

  if (articleObjLink !== -1) {
    listFile =
      listFile.slice(0, articleObjLink) +
      `image: "${firstImage}",` +
      `relatedArticles: ${JSON.stringify(relatedArticles)},` +
      listFile.slice(articleObjLink);
  }
  fs2.writeFileSync(filePath, listFile, "utf-8");
};

async function scrapeAll(articleListToScrape) {
  for (let i = 0; i < articleListToScrape.length; i++) {
    const articleLink = articleListToScrape[i].link;
    const articleHREF = articleListToScrape[i].href;
    await cutArticleHTML(articleLink, articleHREF);
    // updateArticleList(articleLink);
  }
}

scrapeAll(articleList);
