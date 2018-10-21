let articles = require('./articles');
const fs = require('fs');
const helper = {};
let logFile = require('./log');

helper.random_id = function(){
    return Math.ceil(Math.random()*100);
};

helper.updateJsonFile=function(file, information){
    fs.writeFileSync(file, JSON.stringify(information));
};

helper.logger =(url, post_body)=>{
    let info = {
        date: helper.dateFormater(),
        url: url,
        data: post_body
    };
    logFile.push(info);
    helper.updateJsonFile('log.json', logFile);
};

helper.dateFormater = function(){
    const date = new Date();
    return `Date: ${date.getFullYear()}.${date.getMonth()}.${date.getDay()}  ` +
        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
module.exports = helper;