const SODList2 = require("../data/lists/SODList.js");
const axios2 = require("axios");
const cheerio2 = require("cheerio");
const fs2 = require("fs");
const path = require("path");

const homeURL = "https://traditioninaction.org";
const SODArticle = "https://traditioninaction.org/SOD/j065sdStJoseph3-19.htm";
// const SODArticle =
//   "https://traditioninaction.org/OrganicSociety/A_104_Family_1.html";

const findCategory = (stringURL) => {
  let category = stringURL.split("/")[3];
  return category;
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

async function adjustSizesAndFixURL() {
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

  // let relatedTopics = [];
  // let relatedTopicsElement = $('center:contains("Related Topics of Interest")');
  // let $relatedTopicsElement = cheerio2.load(relatedTopicsElement.html());
  // $relatedTopicsElement("a").each((index, element) => {
  //   const relatedTopicsObject = {
  //     href: "",
  //     title: "",
  //   };
  //   const $element = $(element);
  //   const uneditedHREF = $element.attr("href");
  //   relatedTopicsObject.title = $element.text();
  //   if (uneditedHREF.includes("/")) {
  //     relatedTopicsObject.href =
  //       "../../../../../data/articles/" + uneditedHREF.replace("../", "");
  //   } else {
  //     relatedTopicsObject.href =
  //       "../../../../../data/articles/" + category + "/" + uneditedHREF;
  //   }
  //   relatedTopics.push(relatedTopicsObject);
  // });

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

async function getRelatedArticles() {
  const adjustedHTML = await adjustSizesAndFixURL();

  const $ = cheerio2.load(adjustedHTML);

  let relatedTopics = [];
  let relatedTopicsObject = {
    href: "",
    title: "",
  };
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
    console.log(relatedTopics);
  }

  return;
  if (relatedTopicsElement.length > 0) {
    relatedTopicsElement.nextAll().each((index, sibling) => {
      console.log(sibling);
      if ($(sibling).is("div") || $(sibling).is("center")) {
        return false;
      }

      if ($(sibling).is("a")) {
        relatedTopics.push({
          text: $(sibling).text(),
          href: $(sibling).attr("href"),
        });
      }
    });
    console.log(relatedTopics);
  } else {
    console.log("Related Topics of Interest not found");
  }
  return;
  if (relatedTopicsElement) {
    let $relatedTopicsElement = cheerio2.load(relatedTopicsElement.html());
    $relatedTopicsElement("a").each((index, element) => {
      const $element = $(element);
      const uneditedHREF = $element.attr("href");
      const localHREF = uneditedHREF.replace(
        "https://traditioninaction.org",
        "../../../../../data/articles"
      );
      relatedTopicsObject.title = $element.text();
      relatedTopicsObject.href = localHREF;
      relatedTopics.push(relatedTopicsObject);
    });
  } else if (!relatedTopicsElement) {
    $("li a").each((index, element) => {
      console.log("I am here");
    });
  }

  return relatedTopics;
}

let firstSentence;

async function cutArticleHTML() {
  const modifiedHTML = await adjustSizesAndFixURL();

  const htmlArray = modifiedHTML.split(
    "https://traditioninaction.org/contact.htm"
  );

  const cleanedCode = htmlArray[1].split("<br>");

  const bestCode = cleanedCode.splice(1).join("");

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

  finishedHTML = finishedHTML.replace("–", "&ndash;");
  finishedHTML = finishedHTML.replace("-", "&ndash;");
  finishedHTML = finishedHTML.replace("ê", "&ecirc;");
  finishedHTML = finishedHTML.replace("“", "&ldquo;");
  finishedHTML = finishedHTML.replace("”", "&rdquo;");
  finishedHTML =
    `<html>
  <meta name='viewport' content='width=device-width' charset='UTF-8'>` +
    finishedHTML;

  const cleanedArticle = cheerio2.load(finishedHTML);
  const images = cleanedArticle("img[src]");
  const imagesArray = images.map((index, element) => {
    return cleanedArticle(element).attr("src");
  });

  downloadImages(imagesArray);

  // console.log(finishedHTML);

  const filePath = `data/articles/SOD/${"test"}.html`;
  fs2.writeFileSync(filePath, finishedHTML, "utf-8");

  return finishedHTML;
}

getRelatedArticles();

cutArticleHTML();
