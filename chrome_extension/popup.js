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
    }else{
        switchEnabled = false;
    }
    chrome.storage.local.set({switchEnabled: switchEnabled});
    chrome.runtime.sendMessage({switchEnabled: switchEnabled});
    //communicate with background.js to start/stop the timer
});
