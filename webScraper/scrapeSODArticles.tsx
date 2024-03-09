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

  scrapedArticle = scrapedArticle.replace("607", "550");
  scrapedArticle = scrapedArticle.replace("arial,helvetica", "");
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
