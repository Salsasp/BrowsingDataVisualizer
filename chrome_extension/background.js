console.log("background.js loaded");
var sessionBegin, sessionEnd, sessionTotal;
var sessionComplete = false, switchState = false;
var urlNodes = [];
var processedNodes = [];

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

        let processedNodeCounter = -1; //index for processedNodes
        for(i = 0; i < urlNodes.length; i++) {
            if(!hasUrl(urlNodes[i].url)) {
                processedNodes.push(urlNodes[i]);
                processedNodeCounter++;
            }
            for(j = i+1; j < urlNodes.length; j++) {
                if(processedNodes[processedNodeCounter].url == urlNodes[j].url) {
                    processedNodes[processedNodeCounter].addNextUrl(urlNodes[j].nextUrls[0]); //merge nextUrls that have same referrer
                }
            }
        }
        let visitCounter = 0;
        for(i = 0; i < processedNodes.length; i++) {
            visitCounter = 0;
            for(j = 0; j < urlNodes.length; j++) {
                if(processedNodes[i].url == urlNodes[j].url) {
                    visitCounter++;
                }
            }
            processedNodes[i].setNumVisits(visitCounter);
        }

        processedNodes.forEach(function(node) {
            const jsonString = JSON.stringify(node);
            console.log(jsonString);
        });

        urlNodes.length = 0; //clear urlNodes
        processedNodes.length = 0; //clear processedNodes
    }
});

var currentUrl, currentTitle, nextUrl;

//helper function to remove duplicates
function hasUrl(url) {
    var found = false;
    processedNodes.forEach(function(node) {
        if(node.url == url) {
            found = true;
        }
    });
    return found;
}

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    if (details.frameId === 0 && switchState) {
        nextUrl = details.url;
        //console.log("Next URL: " + nextUrl);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentUrl = tabs[0].url;
        //console.log("Current URL: " + currentUrl);
        var currentTitle = tabs[0].title;
        //console.log("Current Title: " + currentTitle);
        let tempNode = new urlNode(currentUrl, currentTitle, nextUrl);
        urlNodes.push(tempNode);
      });
    }
  });


class urlNode {
    constructor(url, title, nextUrl) {
        this.url = url;
        this.title = title;
        this.nextUrls = [];
        this.nextUrls.push(nextUrl);
        this.numVisits = 1;
    }
    addNextUrl(nextUrl) {
        this.nextUrls.push(nextUrl);
    }
    setNumVisits(numVisits) {
        this.numVisits = numVisits;
    }

    toJSON() {
        return {
            url: this.url,
            title: this.title,
            nextUrls: this.nextUrls,
            numVisits: this.numVisits
        }
    }
}