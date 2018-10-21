let sortValue, sortOrder;
let current_page = 1;

window.onload = function () {
    load_articles(JSON.stringify({
        "page": 1,
        "limit": 5,
        "sortField":"id",
        "sortOrder": "asc"}
    ));
    sortValue = document.getElementById("sortValue");
    sortValue.addEventListener("change", onChange, false);
    sortOrder = document.getElementById("sortOrder");
    sortOrder.addEventListener("change", onChange, false);
    $('#show_paginator').on('page', (event, num) =>{
        current_page = num;
        load_articles(JSON.stringify({
            "page": num,
            "limit": 5,
            "sortField": sortValue.options[sortValue.selectedIndex].value,
            "sortOrder": sortOrder.options[sortOrder.selectedIndex].value}
        ));
    });
};

function onChange(){
    $("#articles").html = "";
    current_page = 1;
    load_articles(JSON.stringify({
        "page": 1,
        "limit": 5,
        "sortField": sortValue.options[sortValue.selectedIndex].value.toString(),
        "sortOrder": sortOrder.options[sortOrder.selectedIndex].value.toString()}
    ));
}

function load_articles(myData){
    $.ajax({
        type: "POST",
        url: "../api/articles/readAll",
        data: myData,
        success: function (response) {
            $("#articles").html(render_articles(response.items));
            $('#show_paginator').bootpag({
                total: response.pages,
                page: current_page,
                maxVisible: response.pages
            })
        },
        error: function (error) {
            alert("Eror = " + error.toString());
        }
    });
}

function render_articles(items){
    let result = '';
    items.forEach(function(item){
        result += `<div class="card">`+
            `<div class="card-header">`+
            `${item.title|| ""} - ${item.id}`+
            `</div>`+
            `<div class="card-body">`+
            `<blockquote class="blockquote mb-0">`+
            `<div>${item.text}</div>`+
            `<footer class="blockquote-footer">Author: <cite title="Source Title">${item.author}  ${item.date}</cite></footer>`+
            `</blockquote>`+
            `${render_comments(item)}</div></div>`;
    });
    return result;
}

function render_comments(item) {
    let comments = `${item.comments}`;
    if(item.comments!==undefined){
        comments = '<h6><b>Comments: </b></h6>\n' +
            '<ul class="list-group list-group-flush">';
        item.comments.forEach(function(comment){
            comments +=`<li class="list-group-item"><div>${comment.text||""}</div><label>By: ${comment.author|| "unknown"} | Date: ${comment.date || "unknown"}</label></li>`;
        });
        comments += '</ul>';
    }
    return comments;
}