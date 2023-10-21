console.log("background.js loaded");
var sessionBegin, sessionEnd, sessionTotal;
var sessionComplete = false, switchState = false;
var urlNodes = [];

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
        console.log("Collected Data: ")
        urlNodes.forEach(element => {
            if(!element.url){
                urlNodes.pop(element);
                return;
            }
            console.log("URL: " + element.url + " Title: " + element.title);
            if(element.prevUrls)
            {
                element.prevUrls.forEach(url => {
                    console.log("Previous URL: " + url)
                });
            }
        });

    }
});

var currentUrl, currentTitle, previousUrls = [], prevUrlNode;


chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    if (details.frameId === 0) {
      var referringUrl = details.url;
      previousUrls.push(referringUrl);
    }
  });
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(tab.tabStatus != "complete"){
        setTimeout(function() {
            // do something after 1000 milliseconds
          }, 500);
    }
    currentUrl = changeInfo.url;
    currentTitle = tab.title;
    if(currentUrl in previousUrls)
    {
        urlNodes.push(new urlNode(currentUrl, currentTitle, []));
    }
    else
    {
        urlNodes.push(new urlNode(currentUrl, currentTitle, previousUrls));
        previousUrls = [];
    }
});
/*
chrome.tabs.onCreated.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        currentUrl = tabs[0].url;
        currentTitle = tabs[0].title;
      });
    if(currentUrl in previousUrls)
    {
        urlNodes.push(new urlNode(currentUrl, currentTitle, []));
    }
    else
    {
        urlNodes.push(new urlNode(currentUrl, currentTitle, previousUrls));
        previousUrls = [];
    }
});
*/

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
    constructor(url, title, prevUrls) {
        this.url = url;
        this.title = title;
        this.prevUrls = prevUrls;
    }
    setPrevUrls(prevUrls) {
        this.prevUrls = prevUrls;
    }
}