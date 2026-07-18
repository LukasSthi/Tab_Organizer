console.log("Service Worker gestartet");


chrome.runtime.onMessage.addListener((message) => {


    if (message.action === "saveTabs") {


        chrome.tabs.query({}, (tabs) => {


            console.log("Tabs gefunden:", tabs.length);


            const savedTabs = tabs.map(tab => {


                return {


                    // Eindeutige ID für jeden gespeicherten Tab
                    id: crypto.randomUUID(),


                    // Basisinformationen
                    title: tab.title,

                    url: tab.url,

                    domain: tab.url 
                        ? new URL(tab.url).hostname 
                        : "",

                    favicon: tab.favIconUrl || null,


                    // Organisation
                    category: "Uncategorized",

                    tags: [],

                    workspace: null,


                    // Zeitinformationen
                    createdAt: new Date().toISOString(),

                    lastOpened: new Date().toISOString(),

                    openCount: 1,


                    // Suchinformationen
                    keywords: []


                };


            });


            console.log("Speichere Tabs:", savedTabs);



            chrome.storage.local.set({

                savedTabs: savedTabs

            }, () => {


                console.log("Tabs erfolgreich gespeichert");


            });


        });


    }


});