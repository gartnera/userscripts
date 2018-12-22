// ==UserScript==
// @name         vcloud director html5 hacks
// @version      0.1
// @author       You
// @match        https://vcloud.ialab.dsu.edu/tenant/*
// ==/UserScript==

var realOpen = unsafeWindow.open;
unsafeWindow.open = (url) => realOpen(url);

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fireKey(el,key)
{
    var code = key.charCodeAt(0);
    console.log("original: " + code);
    var eventObj;

    eventObj = document.createEvent("Events");
    eventObj.initEvent("keydown", true, true);
    if (code >= 65 && code <= 90) {
        eventObj.shiftKey = true;
    } else if (code >= 97 && code <= 122) {
        code -= 32;
    }
    const topRow = ")!@#$%^&*("
    let index = topRow.indexOf(key);
    if (index > -1 ) {
        code = 48 + index;
        eventObj.shiftKey = true;
    }
    const other1 = ";,=./"
    index = other1.indexOf(key);
    if (index > -1 ) {
        code = 59 + index;
    }

    const other2 = ":<+>?"
    index = other2.indexOf(key);
    if (index > -1 ) {
        code = 59 + index;
        eventObj.shiftKey= true;
    }

    const other3 = "-`";
    index = other3.indexOf(key);
    if (index > -1 ) {
        code = 95 + index;
    }
    const other4 = "_~";
    index = other4.indexOf(key);
    if (index > -1 ) {
        code = 95 + index;
        eventObj.shiftKey= true;
    }

    if (key === '\n') {
        code = 13;
    }

    console.log("new: " + code);
    eventObj.key = key;
    eventObj.keyCode = code;
    eventObj.which = code;

    el.dispatchEvent(eventObj);
}

function handleWmks() {
    const canvas = document.getElementById("mainCanvas");
    document.body.addEventListener("paste", async (ev) => {
        const data = ev.clipboardData.getData('Text');
        for (const char of data.split('')) {
            fireKey(canvas, char);
            await timeout(200);
        }
        fireKey(canvas, '\n');
        canvas.focus();
    });
}

if (unsafeWindow.location.href.includes("wmks-console")) {
    unsafeWindow.addEventListener('load', handleWmks, false);
}
