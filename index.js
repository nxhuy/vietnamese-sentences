const axios = require("axios");
const cheerio = require("cheerio");
const vntk = require("vntk");
const { flatten } = require("lodash");

const util = vntk.util();
const removeSpecialCharacter = item =>
  item
    .split("(")
    .join("")
    .split(")")
    .join("")
    .split(`"`)
    .join("");
const notContainNumberAtLast = item =>
  !/\d/.test(
    item
      .split(" ")
      .slice(-3)
      .join()
  );
const trimIt = item => item.trim();
const articleUrl =
  "https://vnexpress.net/suc-khoe/loi-ba-mu-lam-moc-them-vu-phu-3981157.html";

axios(articleUrl)
  .then(res => res.data)
  .then(data => {
    const $ = cheerio.load(data);
    const content_detail = $(".content_detail").text();
    const clean = util.clean_html(content_detail);
    const sentences = clean.split(".").map(item => item.trim().split(","));
    const result = flatten(sentences)
      .map(trimIt)
      .map(removeSpecialCharacter)
      .filter(notContainNumberAtLast)
    console.log(result);
  });
