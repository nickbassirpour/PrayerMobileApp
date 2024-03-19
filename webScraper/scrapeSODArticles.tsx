const SODList2 = require("../data/lists/SODList.js");
const axios2 = require("axios");
const cheerio2 = require("cheerio");
const fs2 = require("fs");
const path = require("path");

const homeURL = "https://traditioninaction.org";
const SODArticle = "https://traditioninaction.org/SOD/j247sd_OLSnow_08_05.html";

const findForwardSlashes = (stringURL) => {
  let count = 0;
  let slashes = {
    firstSlash: 0,
    secondSlash: 0,
  };
  for (let i = 0; i < stringURL.length; i++) {
    if (stringURL[i] === "/") {
      count++;
    }
    if (count === 2) {
      slashes.firstSlash = i + 2;
    }
    if (count === 3) {
      slashes.secondSlash = i + 1;
    }
  }
  return slashes;
};

const findCategory = (stringURL) => {
  const slashes = findForwardSlashes(stringURL);
  return stringURL.substring(slashes.firstSlash, slashes.secondSlash);
};

let category = findCategory(SODArticle);

async function downloadImages(imagesArray) {
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

async function getArticleHTML() {
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

  $("font:not([size])").each((index, element) => {
    return $(element).attr("size", 2);
  });

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

  return $.html();
}

async function adjustArticleHTML() {
  const modifiedHTML = await getArticleHTML();

  const $ = cheerio2.load(modifiedHTML);

  const textArray = $.text().split(" ");
  const selectionIndex = textArray.indexOf("selection:");
  const slicedText = textArray.slice(selectionIndex + 1).join(" ");
  const periodIndex = slicedText.split("").indexOf(".");
  const firstSentence = slicedText
    .split("")
    .slice(0, periodIndex + 1)
    .join("");

  let scrapedArticle = $("tbody").eq(1);
  const pattern = /<tr>[\s\S]*?<\/center><br>/;

  // Use replace to remove the matched content
  scrapedArticle = scrapedArticle.toString().replace(pattern, "");
  const startIndex = scrapedArticle.indexOf("<!-- AddToAny BEGIN -->");

  // Check if the starting string is found
  if (startIndex !== -1) {
    // Use substring to remove everything after and including the starting string
    scrapedArticle = scrapedArticle.substring(0, startIndex);
  }

  scrapedArticle = scrapedArticle.replace("–", "&ndash;");
  scrapedArticle = scrapedArticle.replace("-", "&ndash;");
  scrapedArticle = scrapedArticle.replace("ê", "&ecirc;");
  scrapedArticle = scrapedArticle.replace("“", "&ldquo;");
  scrapedArticle = scrapedArticle.replace("”", "&rdquo;");
  scrapedArticle =
    `<html>
  <meta name='viewport' content='width=device-width' charset='UTF-8'>` +
    scrapedArticle;

  const cleanedArticle = cheerio2.load(scrapedArticle);
  const images = cleanedArticle("img[src]");
  const imagesArray = images.map((index, element) => {
    return cleanedArticle(element).attr("src");
  });

  downloadImages(imagesArray);

  const filePath = `data/articles/SOD/${"test"}.html`;
  fs2.writeFileSync(filePath, scrapedArticle, "utf-8");

  return scrapedArticle;
}

adjustArticleHTML();
