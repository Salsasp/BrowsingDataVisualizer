console.log("background.js loaded");
var sessionBegin, sessionEnd, sessionTotal;
var sessionComplete = false, switchState = false;

chrome.runtime.onMessage.addListener(function(message){
    if(message.switchEnabled){
        sessionBegin = Date.now();
        switchState = true;
        console.log(true) //remove this later
    }
    else if (!message.switchEnabled) {
        sessionEnd = Date.now();
        switchState = false;
        sessionTotal = sessionEnd - sessionBegin;
        sessionComplete = true;
        console.log(false)
        console.log("session complete");
    }
});

chrome.webNavigation.onCommitted.addListener(function(data){
    if (data.frameId !== 0 || sessionComplete) return;

    var currentUrl;
    var tabIdToUrl = {};
    tabIdToUrl[data.tabId.toString()] = data.url;
    chrome.storage.local.set(tabIdToUrl);
});
