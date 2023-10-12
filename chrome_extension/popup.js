var switchEnabled = false;
var sessionBegin, sessionEnd;

document.getElementById("switch").addEventListener("click", function(){
    if(this.checked){
        switchEnabled = true;
        console.log("switch enabled");
        sessionBegin = Date.now();
    }else{
        switchEnabled = false;
        console.log("switch disabled");
        sessionEnd = Date.now();
        console.log("session duration: " + (sessionEnd - sessionBegin));
    }
});


let microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
// Track the number of callbacks from chrome.history.getVisits()
// that we expect to get.  When it reaches zero, we have all results.
let numRequestsOutstanding = 0;

chrome.history.search(
    {
        text: '',                   // Return every history item
        startTime: sessionBegin,    // that was accessed in between sessionBegin   
        endTime: sessionEnd         // and sessionEnd
    },
    function(historyItems) {
        // For each history item, get details on all visits.
        for (var i = 0; i < historyItems.length; ++i) {
            var url = historyItems[i].url;
            var processVisitsWithUrl = function(url) {
                // We need the url of the visited item to process the visit.
                // Use a closure to bind the  url into the callback's args.
                return function(visitItems) {
                    generateNodes(visitItems);
                };
            };
            chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
            numRequestsOutstanding++;
        }
        if (!numRequestsOutstanding) {
            onAllVisitsProcessed();
        }
    }
);
class urlNode {
    constructor(url, title, visitTime) {
        this.url = url;
        this.title = title;
        this.visitTime = visitTime;
        this.previousUrl = null;
        this.nextUrls = new Array();
    }
    setPreviousUrl(url) {
        this.previousUrl = url;
    }
    appendNextUrl(url) {
        this.nextUrls.append(url);
    }
    setTitle(title) {
        this.title = title;
    }
    setVisitTime(time) {
        this.visitTime = time;
    }
}


const generateNodes = function (visitItems) {
    let urlNodes = new Array();
    for (let i = 0; i < visitItems.length; ++i) {
        if (visitItems[i].transition != 'link') {
            newNode = urlNode(visitItems[i].url, visitItems[i].title, visitItems[i].visitTime); 
            urlNodes.append(newNode);
        }
        else{
            newNode = urlNode(visitItems[i].url, visitItems[i].title, visitItems[i].visitTime); 
            
            prevVisitId = visitItems[i].referringVisitId;
            chrome.history.getVisitItems({visitId: prevVisitId}, function(visitItems) {
                if (visitItems.length > 0) {
                    newNode.setPreviousUrl(visitItems[0].url);
                }
            });
        }  
    }

    // If this is the final outstanding call to processVisits(),
    // then we have the final results.  Use them to build the list
    // of URLs to show in the popup.
    if (!--numRequestsOutstanding) {
        onAllVisitsProcessed();
    }
};



//TODO: use sessionBegin and sessionEnd as boundaries for the data to be collected from the chrome.history API which conveniently has all the methods and data we need
//package this collected data into a JSON object and send it to the server