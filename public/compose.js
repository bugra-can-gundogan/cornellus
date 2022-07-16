var addKeywordFunction = function () {
    var newkwinput = document.getElementById("new-keyword");
    var kwstr = newkwinput.value;
    var container = document.getElementById("kw-container");
    var fontsizee = "16px";

    if (kwstr.length >= 13 && kwstr.length < 18) {
        fontsizee = "12px";
    } else if (kwstr.length >= 18) {
        fontsizee = "10px";
    } else if (kwstr.length <= 10) {
        fontsizee = "24px";
    }

    var newdiv = document.createElement('div');
    newdiv.className = "keyword-sample";
    var newh4 = document.createElement('h4');
    newh4.style.fontSize = fontsizee;
    newh4.innerText = kwstr;
    newh4.className = "h4-of-kw";

    newdiv.append(newh4);
    container.append(newdiv);
}

function savenote() {
    targetKWs = document.getElementById("invisible-kws");
    targetNotePlace = document.getElementById("invisible-noteplace");
    targetTitle = document.getElementById("invisible-title");
    targetSummary = document.getElementById("invisible-summary");

    var title = document.getElementById("post-title").value;
    var postbod = document.getElementById("editor").children[0].innerHTML;

    var kws = document.getElementsByClassName("h4-of-kw");
    var kwstr = "";
    for (var i = 0; i < kws.length; i++) {
        kwstr += kws[i].innerText + "*";
    }
    targetKWs.value = kwstr.slice(0,-1);

    
    targetNotePlace.value = postbod;
    targetTitle.value = title;
    targetSummary.value = document.getElementById("summary-text-ar").value;
    $("#lastsubmit").trigger('click');
}

function formSubmit(form) {
    setTimeout(function() {
        form.submit();
    }, 3000);  // 3 seconds
    return false;
}

function wikiSearch() {
    var mainpage = document.getElementById("main-page");
    var wikipage = document.getElementById("wiki-page");

    wikipage.style.display = "flex";
    mainpage.style.display = "none";

}

function backtocompose() {
    var mainpage = document.getElementById("main-page");
    var convpage = document.getElementById("conversion-page");
    var wikipage = document.getElementById("wiki-page");

    wikipage.style.display = "none";
    convpage.style.display = "none";
    mainpage.style.display = "flex";
}

function conversion() {
    var mainpage = document.getElementById("main-page");
    var convpage = document.getElementById("conversion-page");

    convpage.style.display = "flex";
    mainpage.style.display = "none";
}