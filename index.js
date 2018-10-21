const http = require('http');

const readAll = require('./read_all');
const readLog = require('./read_logger');
const readArticle = require('./read_article');
const createArticle = require('./create_article');
const updateArticle = require('./update_article');
const deleteArticle = require('./delete_article');
const createComment = require('./create_comment');
const deleteComment = require('./delete_comment');
const helper = require('./helper');
const sum = require('./sum');


const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/sum': sum,
    '/api/articles/readAll': readAll,
    '/api/articles/read': readArticle,
    '/api/articles/createArticle': createArticle,
    '/api/articles/updateArticle': updateArticle,
    '/api/articles/deleteArticle': deleteArticle,
    '/api/comments/createComment': createComment,
    '/api/comments/deleteComment': deleteComment,
    '/api/logs': readLog
};

const server = http.createServer((req, res) => {
    parseBodyJson(req, (err, payload) => {
        const handler = getHandler(req.url);

        handler(req, res, payload, (err, result) => {
            if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json');
                res.end( JSON.stringify(err) );
            }
            //helper.updateArticles();
            helper.logger(req.url,payload);
            res.statusCode = 200;
            res.end( JSON.stringify(result) );
        });
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
    return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
    cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
    let body = [];
    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        let params = JSON.parse(body);
        cb(null, params);
    });
}