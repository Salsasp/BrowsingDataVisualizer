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
        urlNodes.array.forEach(element => {
            console.log("URL: " + element.url + " Title: " + element.title)
            element.prevUrls.forEach(url => {
                console.log("Previous URL: " + url)
            });
        });
    }
});

var isNewUrl = false;
var currentUrl, currentTitle, previousUrls = [], prevUrlNode;
while(switchState){
    if(isNewUrl){
        if(document.referrer){ 
            previousUrls.push(document.referrer);
        }
        urlNodes.push(new urlNode(currentUrl, currentTitle, previousUrls));
        isNewUrl = false;
        previousUrls = [];
    }
    currentUrl = window.location.href;
    currentTitle = window.name;
}

window.onhashchange = function() {
    isNewUrl = true;                                  //detect when url changes
};                                                    //or when new tab is opened
chrome.tabs.onCreated.addListener(function(tab) {
    isNewUrl = true;
});



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