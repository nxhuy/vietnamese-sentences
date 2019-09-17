const axios = require("axios");
const cheerio = require("cheerio");
const vntk = require("vntk");
// "https://vnexpress.net/goc-nhin",
const categories = [
  "https://vnexpress.net/thoi-su", // DONE
  "https://vnexpress.net/the-gioi", // DONE
  "https://vnexpress.net/kinh-doanh", //DOING
  "https://vnexpress.net/giai-tri",
  "https://vnexpress.net/the-thao",
  "https://vnexpress.net/phap-luat",
  "https://vnexpress.net/suc-khoe",
  "https://vnexpress.net/doi-song",
  "https://vnexpress.net/du-lich",
  "https://vnexpress.net/khoa-hoc",
  "https://vnexpress.net/so-hoa",
  "https://vnexpress.net/oto-xe-may",
  "https://vnexpress.net/y-kien",
  "https://vnexpress.net/tam-su",
];
const mongojs = require("mongojs");
const db = mongojs(`mongodb://127.0.0.1:27017/vietnamese`);
const baseUrl = "https://vnexpress.net";
let dem = 0;
const crawlCategory = categoryUrl =>
  axios(categoryUrl)
    .then(res => res.data)
    .then(async data => {
      const $ = cheerio.load(data);
      const articles = $(".sidebar_1 article");
      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        const href = $(article)
          .find(".title_news a")
          .attr("href");
        dem++;
        await saveData(href);
        console.log(dem, "Done", href);
      }
      const nextHref = $(".pagination .next").attr("href");
      if (nextHref) {
        console.log("Next....", nextHref);
        crawlCategory(baseUrl + nextHref);
      }
    });
crawlCategory(categories[14]);

const getArticleId = href =>
  href
    .split("-")
    .slice(-1)[0]
    .slice(0, -5);

const saveData = articleHref => {
  const articleId = getArticleId(articleHref);
  const data = {
    _id: articleId,
    articleHref
  };
  return new Promise((resolve, reject) => {
    db.articleHrefs.findAndModify(
      {
        query: { _id: articleId },
        update: { $set: data },
        upsert: true
      },
      (err, docs) => {
        if (err) reject(err);
        resolve(data.length);
      }
    );
  });
};
