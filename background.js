console.log("Service Worker gestartet");
function getCategory(domain) {

    domain = domain.toLowerCase();

    // Development
    if (
        domain.includes("github.com") ||
        domain.includes("stackoverflow.com") ||
        domain.includes("developer.mozilla.org") ||
        domain.includes("npmjs.com")
    ) {
        return "Development";
    }

    // Education
    if (
        domain.includes("moodle") ||
        domain.includes("wikipedia.org") ||
        domain.includes("coursera.org") ||
        domain.includes("udemy.com") ||
        domain.includes("edx.org")
    ) {
        return "Education";
    }

    // Entertainment
    if (
        domain.includes("youtube.com") ||
        domain.includes("netflix.com") ||
        domain.includes("spotify.com") ||
        domain.includes("twitch.tv")
    ) {
        return "Entertainment";
    }

    // Shopping
    if (
        domain.includes("amazon.") ||
        domain.includes("ebay.") ||
        domain.includes("zalando.")
    ) {
        return "Shopping";
    }

    return "Uncategorized";
}

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
                    category: getCategory(
    tab.url
        ? new URL(tab.url).hostname
        : ""
),

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