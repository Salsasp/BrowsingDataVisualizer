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
                    console.log(url);
                    var processVisitsWithUrl = function(url) {
                        // We need the url of the visited item to process the visit.
                        // Use a closure to bind the  url into the callback's args.
                        return function(visitItems) {
                            generateNodes(visitItems);
                        };
                    };
                    chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
                }
            }
        );
        class urlNode {
            constructor(url, visitTime) {
                this.url = url;
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
            setVisitTime(time) {
                this.visitTime = time;
            }
        }


        const generateNodes = function (visitItems) {
            let urlNodes = new Array();
            for (let i = 0; i < visitItems.length; ++i) {
                if (visitItems[i].transition != 'link') {
                    let newNode = new urlNode(visitItems[i].url, visitItems[i].title, visitItems[i].visitTime); 
                    console.log(visitItems[i].url, visitItems[i].title, visitItems[i].visitTime);
                    urlNodes.push(newNode);
                }
                else{
                    let newNode = new urlNode(visitItems[i].url, visitItems[i].title, visitItems[i].visitTime); 
                    
                    let prevVisitId = visitItems[i].referringVisitId;
                }  
            }

            // If this is the final outstanding call to processVisits(),
            // then we have the final results.  Use them to build the list
            // of URLs to show in the popup.
            urlNodes.forEach(element => {
                console.log(element.title);
            });
        };
    }
});
