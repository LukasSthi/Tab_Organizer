chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "saveTabs") {

        chrome.tabs.query({}, (tabs) => {

            console.log(tabs);

        });

    }

});