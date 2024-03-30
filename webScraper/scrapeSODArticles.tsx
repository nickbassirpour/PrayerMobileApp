const SODList2 = require("../data/lists/SODList.js");
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
    link: "https://traditioninaction.org/SOD/j161sd_Circumcision_1-1.html",
  },
  {
    month: "January",
    date: "January 2",
    title: "St. Basil the Great",
    href: "../../../../../data/articles/SOD/j293sd_Basili_1-2.html",
    link: "https://traditioninaction.org/SOD/j293sd_Basili_1-2.htm",
  },
  {
    month: "January",
    date: "January 2",
    title: "St. Macarius of Alexandria",
    href: "../../../../../data/articles/SOD/j162sd_St.Marcarius_1-02.html",
    link: "https://traditioninaction.org/SOD/j162sd_St.Marcarius_1-02.html",
  },
];

const homeURL = "https://traditioninaction.org";
// const SODArticle =
// "https://traditioninaction.org/SOD/j197sd_FrancisAssisr_10-04.html";

const findCategory = (stringURL) => {
  let category = stringURL.split("/")[3];
  return category;
};

// let category = findCategory(SODArticle);

async function downloadImages(imagesArray, SODArticle) {
  const category = findCategory(SODArticle);
  const currentWorkingDirectory = process.cwd();
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
  }
}

function extractFolderName(imageUrl) {
  const folders = imageUrl.split("/");
  return folders[0];
}

function extractFileName(imageUrl) {
  const folders = imageUrl.split("/");
  return folders[1];
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

  // Make condition if it has a styl attribute
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

let firstSentence = "";

let firstImageHREF = "";

async function cutArticleHTML(SODArticle) {
  const modifiedHTML = await adjustSizesAndFixURL(SODArticle);

  getRelatedArticles(modifiedHTML);

  const htmlArray = modifiedHTML.split(`alt="contact">`);

  const cleanedCode = htmlArray[1];

  const bestCode = cleanedCode;

  const $ = cheerio2.load(bestCode);

  const fontIdR = $("#R");

  const periodIndex = fontIdR.text().split("").indexOf(".");
  firstSentence = fontIdR
    .text()
    .split("")
    .slice(0, periodIndex + 1)
    .join("")
    .trim();
  if (firstSentence.includes(":")) {
    const sentenceArray = firstSentence.split(":");
    firstSentence = sentenceArray[1].trim();
  }

  console.log(firstSentence);

  // const textArray = $.text().split(" ");
  // const selectionIndex = textArray.indexOf("selection:");
  // const slicedText = textArray.slice(selectionIndex + 1).join(" ");
  // // const periodIndex = slicedText.split("").indexOf(".");
  // firstSentence = slicedText
  //   .split("")
  //   .slice(0, periodIndex + 1)
  //   .join("");

  // let scrapedArticle = $("tbody").eq(1);
  // const pattern = /<tr>[\s\S]*?<\/center><br>/;

  // Use replace to remove the matched content
  // scrapedArticle = scrapedArticle.toString().replace(pattern, "");
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

  const cleanedArticle = cheerio2.load(finishedHTML);
  const images = cleanedArticle("img[src]");
  const imagesArray = images.map((index, element) => {
    return cleanedArticle(element).attr("src");
  });

  firstImageHREF = imagesArray[1];

  console.log(firstImageHREF);
  downloadImages(imagesArray, SODArticle);

  // console.log(finishedHTML);

  const filePath = `data/articles/SOD/${"test"}.html`;
  fs2.writeFileSync(filePath, finishedHTML, "utf-8");

  return finishedHTML;
}

async function scrapeAll(articleListToScrape) {
  let newArticleList = [];
  for (let i = 0; i < articleListToScrape.length; i++) {
    const articleLink = articleListToScrape[i].link;
    await cutArticleHTML(articleLink);
    let newArticleObject = articleListToScrape[i];
    newArticleObject["firstSentence"] = firstSentence;
    newArticleObject["firstImage"] = firstImageHREF;
    newArticleList[i] = newArticleObject;
  }
  console.log(newArticleList);
}

scrapeAll(articleList);

// getRelatedArticles();

// cutArticleHTML();
