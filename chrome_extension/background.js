console.log("background.js loaded");
//globals
var sessionBegin, sessionEnd, sessionTotal;
var sessionComplete = false, switchState = false;
var sessionHistoryItems, sessionVisitItems = [];
let visitToHistoryMap = new Map();

//switch listener from popup.js
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
                // For each history item, get details on all visits
                sessionHistoryItems = historyItems;
                for (var i = 0; i < historyItems.length; ++i) {
                    var url = historyItems[i].url;
                    console.log(url);
                    generateNodes(historyItems);
                }
            }
        );
        class urlNode {
            constructor(url, visitTime, title, previousUrls) {
                this.url = url;
                this.visitTime = visitTime;
                this.title = title;
                this.previousUrl = previousUrls;
            }
        }


        const generateNodes = function (historyItems) {
            console.log("generateNodes called")
            let urlNodes = new Array();
            historyItems.forEach(item => {
                console.log("in history items loop")
                chrome.history.getVisits({url: item.url}, function(visits){     
                    console.log("visits size: " + visits.length)  
                    visits.forEach(visit => {
                        console.log("in visits loop")
                        visitToHistoryMap.set(visit, item); //for quick access between historyItem properties and visit properties
                        sessionVisitItems.push(visit); //pushes all visits into sessionVisitItems
                        let tempNode = new urlNode(item.url, visit.visitTime, item.title, getPreviousUrl(visit));
                        urlNodes.push(tempNode);
                    });
                });
            urlNodes.forEach(element => { //debugging
                console.log(element.title);
            });
        });
    }

        function getPreviousUrl(visit) {
            console.log("getPreviousUrl called")
            console.log("transition: " + visit.transition)
            console.log("referringVisitId: " + visit.referringVisitId)
            if(visit.transition != 'link' || visit.referringVisitId == null){
                return [];
            }
            correspondingHistoryItem = visitToHistoryMap.get(visit);
            let tempVisit;
            sessionVisitItems.forEach(visitItem => { //loop to find matching visit of referringVisitId
                if(visitItem.id == visit.referringVisitId){
                    tempVisit = visitItem;
                }
            });
            if(tempVisit == null){
                return [];
            }
            let tempHistoryItem = visitToHistoryMap.get(tempVisit);
            console.log("MATCH! - " + tempHistoryItem.url)
            return tempHistoryItem.url;
        }
    }
});

//CURRENT ISSUE: visits retrieved from chrome.history.getVisits() are from the ENTIRE history, and not within the session time
//this can likely be solved by checking for a valid time of each visit retrieved. There is likely a lot a redundancy in this code
//so it can be optimized later.