let articles = require('./articles');
let newArticles = [];
let thPayload;

let modify = {
    'sortField': sort,
    'page': paginate,
    'includeDeps': includeComments
};

function sort(value) {
    if(thPayload.sortOrder ==='asc'){
        compareValue(value, 1);
    }else{
        compareValue(value, -1);
    }
}

function compareValue(value, order){
    newArticles.sort((a, b)=>{return (b[value] - a[value])*order;});
}

function includeComments(value){
    if (value === "false") {
        newArticles = newArticles.map((element) => {
            delete element.comments;
            return Object.assign({}, element);
        });
    }
}

function paginate(){
    let correctlimit = getCorrectLimit();
    newArticles = newArticles.splice((getCorrectPage(thPayload) - 1) * correctlimit, correctlimit);
}


function modifyResult(){
    return {"count": articles.length,"pages":  Math.ceil(articles.length/getCorrectLimit()),
        "page": getCorrectPage(),"limit": getCorrectLimit(), "items": newArticles};
}

function getCorrectPage(){
    return thPayload.page || 1;
}

function getCorrectLimit(){
    return thPayload.limit || 10;
}

module.exports = function readAll(req, res, payload, cb) {
    newArticles = articles.slice();
    thPayload = payload;
    for(let key in payload){
        if(modify[key]!=undefined){
            modify[key](payload[key]);
        }
    }
    cb(null, modifyResult());
};