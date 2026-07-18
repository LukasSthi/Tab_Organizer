console.log("Service Worker gestartet");


chrome.runtime.onMessage.addListener((message) => {


    if(message.action === "saveTabs"){


        chrome.tabs.query({}, (tabs)=>{


            console.log(
                "Tabs gefunden:",
                tabs.length
            );


            tabs.forEach(tab=>{


                console.log({
                    title: tab.title,
                    url: tab.url
                });


            });


        });


    }


});