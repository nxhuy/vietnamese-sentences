const axios = require("axios");
const cheerio = require("cheerio");
const vntk = require("vntk");
const { flatten } = require("lodash");
const mongojs = require("mongojs");

const db = mongojs(`mongodb://127.0.0.1:27017/vietnamese`);

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
      .slice(-4)
      .join()
  );
const trimIt = item => item.trim();
const toLowerCase = item => item.toLowerCase()
const greaterThan4Words = sentence => sentence.split(" ").length >= 4;
const articleUrl =
  "https://vnexpress.net/phap-luat/giam-doc-cong-an-tinh-dong-nai-bi-cach-chuc-3981378.html";

const createObj = sentence => ({
  _id: sentence,
  sentence
});
const crawlArticle = articleUrl =>
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
        // .filter(greaterThan4Words)
        .map(toLowerCase)
        .map(createObj)
      console.log('result', result)
      // return saveData(result);
    });
// crawlArticle(articleUrl)
generateTokenForWord('hàng')
function generateToken(sentence){
  const last4Words = sentence.split(" ").slice(-4);
  const results = last4Words.map(generateTokenForWord)
  console.log('results :', results);
}


function generateTokenForWord(word){
  return word
}

function saveData(data) {
  return new Promise((resolve, reject) => {
    db.sentences.insert(data, (err, docs) => {
      if (err) reject(err);
      resolve(data.length);
    });
  });
}
