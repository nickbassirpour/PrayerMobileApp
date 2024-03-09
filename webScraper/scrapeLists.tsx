const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const saintsOfTheDay = "https://traditioninaction.org/SOD/saintsofday.htm";

async function getListHTML() {
  const { data: html } = await axios.get(saintsOfTheDay);
  return html;
}

getListHTML().then((res) => {
  const $ = cheerio.load(res);
  const thirdTable = $("table").eq(2);
  const urls = thirdTable.find("a");
  let sodList = [];
  urls.each((index, element) => {
    const individualATag = $(element); // Select the specific <a> tag within the iteration
    let hrefAttribute = individualATag.attr("href"); // Get the value of the 'href' attribute
    let textContent = individualATag.text(); // Get the text content inside the <a> tag
    let hrefLink;
    if (hrefAttribute && !hrefAttribute.includes("html")) {
      hrefLink = "../../../../../data/articles/SOD/" + hrefAttribute + "l";
    } else if (hrefAttribute && hrefAttribute.includes("html")) {
      hrefLink = "../../../../../data/articles/SOD/" + hrefAttribute;
    }
    if (hrefAttribute) {
      const sodObject = {
        month: textContent.split(" ")[0],
        date: (
          textContent.split(" ")[0] +
          " " +
          textContent.split(" ")[1]
        ).replace(",", ""),
        title: textContent.split(", ")[1],
        href: hrefLink,
        link: "https://traditioninaction.org/SOD/" + hrefAttribute,
      };
      sodList.push(sodObject);
    }
  });
  console.log(sodList);
  const filePath = "data/lists/SODList.tsx";
  const jsonSODList = JSON.stringify(sodList, null, 2);
  fs.writeFileSync(filePath, jsonSODList, "utf-8");

  const fileData = fs.readFileSync("data/lists/SODList.tsx", "utf-8");
  const parsedArray = JSON.parse(fileData);

  console.log(parsedArray);
});
