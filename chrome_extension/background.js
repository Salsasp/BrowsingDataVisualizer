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

//strategy for tracking browsing data with live tracking:
//instead of using the history api to get the browsing history, we can use the webNavigation api to get the url of the current tab
//store each url and page title in array of objects, as well as previous url and page title for graph connections

class urlGraph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }
}

class urlNode {
    constructor(url, title) {
        this.url = url;
        this.title = title;
    }
}