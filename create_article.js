let articles = require('./articles');
const helper = require('./helper');

module.exports = function createArticles(req, res, payload, cb) {
    let new_article = {"id": helper.random_id()};
    articles.push(new_article);
    const result = {new_article: new_article};

    cb(null, result);
};
