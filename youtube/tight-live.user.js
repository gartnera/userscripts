// ==UserScript==
// @name         Tight layout for youtube live
// @namespace    http://agartner.com
// @version      0.1
// @author       Alex Gartner
// @match        https://www.youtube.com/watch*
// @grant        unsafeWindow
// ==/UserScript==

const mainWidth = 80;

function deleteElement(el) {
    el.parentElement.removeChild(el);
}

function fp(str) {
    return `${str}%`;
}

function doLayout() {
    'use strict';

    deleteElement(document.getElementById('meta'));
    deleteElement(document.getElementById('info'));
    deleteElement(document.getElementById('masthead-container'));
    deleteElement(document.getElementById('related'));

    const mainWidthPercentage = fp(mainWidth);
    const chatPercentage = fp(100 - mainWidth);

    const player = document.querySelector('#top > #player');
    player.style.position = 'fixed';
    player.style.left = '0';
    player.style.top = '0';
    player.style.height = '100%';
    player.style.width = mainWidthPercentage;

    const container = document.querySelector('.html5-video-container');
    container.style.height = '100%';
    container.style.width = '100%';

    const video = document.querySelector('video');
    video.style.height = '';
    video.style.width = '';

    const chat = document.querySelector('iframe');

    chat.style.position = 'fixed';
    chat.style.right = '0';
    chat.style.top = '0';
    chat.style.width = chatPercentage;
    chat.style.height = '100%';

    const bar = document.querySelector('.ytp-chrome-bottom');

    bar.style.width = '100%';
    bar.style.left = '';
}

function conditional() {
    if (document.getElementById('chat')) {
        //doLayout();
    }
}

unsafeWindow.tightLayout = doLayout;
window.addEventListener("load", conditional);
