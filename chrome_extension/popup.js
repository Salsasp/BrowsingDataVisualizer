var switchEnabled = false;

chrome.storage.local.get(['switchEnabled'], function(result) {
    switchEnabled = result.switchEnabled;
    console.log('Value currently is ' + switchEnabled);
    if(switchEnabled){
        document.getElementById("switch").checked = true;
    }
    else{
        document.getElementById("switch").checked = false;
    }
});

document.getElementById("switch").addEventListener("click", function(){
    if(this.checked){
        switchEnabled = true;
        console.log("switch enabled");
    }else{
        switchEnabled = false;
        console.log("switch disabled");
    }
    chrome.storage.local.set({switchEnabled: switchEnabled}, function() {
        console.log('Value is set to ' + switchEnabled);
    });
    chrome.runtime.sendMessage({switchEnabled: switchEnabled});
    //communicate with background.js to start/stop the timer
});
