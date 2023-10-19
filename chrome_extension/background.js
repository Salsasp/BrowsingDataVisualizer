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

var isNewUrl = false;
var currentUrl, currentTitle, previousUrls = [], prevUrlNode;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentUrl = changeInfo.url;
    currentTitle = tab.title;
    urlNodes.push(new urlNode(currentUrl, currentTitle, previousUrls));
    isNewUrl = false;
    previousUrls = [];
});
chrome.tabs.onCreated.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        currentUrl = tabs[0].url;
        currentTitle = tabs[0].title;
      });
    urlNodes.push(new urlNode(currentUrl, currentTitle, previousUrls));
    isNewUrl = false;
    previousUrls = [];
});
chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    chrome.webNavigation.getFrame({tabId: details.tabId, frameId: 0}, function(frameDetails) {
        if(frameDetails.parentFrameId === -1){
            console.log('Referrer URL: ' + frameDetails.url);
            previousUrls.push(frameDetails.url);
        }
    });
}, {url: [{urlMatches : '<all_urls>'}]});



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
    setPrevUrls(prevUrls) {
        this.prevUrls = prevUrls;
    }
}