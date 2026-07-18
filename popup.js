document
.getElementById("saveTabs")
.addEventListener("click", () => {

chrome.runtime.sendMessage({

action: "saveTabs"

});

});