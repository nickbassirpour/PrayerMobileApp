const SODList2 = require("../data/lists/SODList.js");
const axios2 = require("axios");
const cheerio2 = require("cheerio");
const fs2 = require("fs");

console.log(SODList2);

const SODArticle =
  "https://traditioninaction.org/SOD/j197sd_FrancisAssisr_10-04.html";

async function getArticleHTML() {
  const { data: html } = await axios2.get(SODArticle);
  return html;
}

getArticleHTML().then((res) => {
  const $ = cheerio2.load(res);
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

  $("[width]").each((index, element) => {
    const widthValue = $(element).attr("width");

    if (!isNaN(widthValue)) {
      const newWidth = parseFloat(widthValue) * 0.6;

      $(element).attr("width", newWidth);
    }
  });

  $("[size]").each((index, element) => {
    const sizeValue = $(element).attr("size");

    if (!isNaN(sizeValue)) {
      const newSize = sizeValue - 1;

      $(element).attr("size", newSize);
    }
  });

  $("font:not([size])").each((index, element) => {
    $(element).attr("size", 2);
  });

  scrapedArticle = scrapedArticle.replace("–", "&ndash;");
  scrapedArticle = scrapedArticle.replace("ê", "&ecirc;");
  scrapedArticle = scrapedArticle.replace("“", "&ldquo;");
  scrapedArticle = scrapedArticle.replace("”", "&rdquo;");
  scrapedArticle =
    `<html>
  <meta name="viewport" content='width=device-width'>
  
  <head>
      <style>
          body {
              margin: auto;
              padding-top: 50;
              padding-right: 15;
              padding-left: 15;
              padding-bottom: 50;
              width: 550;
          }
      </style>
  </head>` + scrapedArticle;

  const filePath = `data/articles/SOD/${"test"}.html`;
  fs2.writeFileSync(filePath, scrapedArticle, "utf-8");
});
