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

//TODO: use sessionBegin and sessionEnd as boundaries for the data to be collected from the chrome.history API which conveniently has all the methods and data we need
