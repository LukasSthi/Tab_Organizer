console.log("Popup geladen");


document.getElementById("saveTabs")
.addEventListener("click", () => {


    chrome.runtime.sendMessage({
        action: "saveTabs"
    });


    document.getElementById("status").innerHTML =
    "Tabs werden gespeichert...";


});