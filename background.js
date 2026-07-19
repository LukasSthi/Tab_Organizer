console.log("TabBuddy Service Worker gestartet");


// --------------------------------------
// Kategorie anhand der Domain bestimmen
// --------------------------------------

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


// --------------------------------------
// Domain sicher aus URL auslesen
// --------------------------------------

function getDomain(url) {

    try {

        return new URL(url).hostname;

    } catch (error) {

        return "";

    }

}


// --------------------------------------
// Nachrichten vom Popup empfangen
// --------------------------------------

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {


        // --------------------------------------
        // Tabs manuell speichern
        // --------------------------------------

        if (message.action === "saveTabs") {


            // Nur Tabs des aktuellen Fensters speichern

            chrome.tabs.query(
                {
                    currentWindow: true
                },

                (tabs) => {


                    chrome.storage.local.get(
                        ["savedTabs"],

                        (result) => {


                            const existingTabs =
                                result.savedTabs || [];


                            let savedTabs =
                                [...existingTabs];


                            tabs.forEach((tab) => {


                                // Interne Chrome-Seiten ignorieren

                                if (
                                    !tab.url ||
                                    tab.url.startsWith("chrome://") ||
                                    tab.url.startsWith("chrome-extension://")
                                ) {
                                    return;
                                }


                                const domain =
                                    getDomain(tab.url);


                                // Prüfen, ob URL bereits gespeichert ist

                                const existingIndex =
                                    savedTabs.findIndex(
                                        savedTab =>
                                            savedTab.url === tab.url
                                    );


                                // --------------------------------------
                                // Tab existiert bereits
                                // --------------------------------------

                                if (existingIndex !== -1) {


                                    savedTabs[existingIndex] = {

                                        ...savedTabs[existingIndex],

                                        title:
                                            tab.title ||
                                            savedTabs[existingIndex].title,

                                        favicon:
                                            tab.favIconUrl ||
                                            savedTabs[existingIndex].favicon,

                                        domain: domain,

                                        category:
                                            getCategory(domain),

                                        lastOpened:
                                            new Date().toISOString()

                                    };


                                }


                                // --------------------------------------
                                // Neuer Tab
                                // --------------------------------------

                                else {


                                    savedTabs.push({


                                        id:
                                            crypto.randomUUID(),


                                        title:
                                            tab.title ||
                                            "Untitled Tab",


                                        url:
                                            tab.url,


                                        domain:
                                            domain,


                                        favicon:
                                            tab.favIconUrl ||
                                            null,


                                        category:
                                            getCategory(domain),


                                        tags:
                                            [],


                                        workspace:
                                            null,


                                        starred:
                                            false,


                                        createdAt:
                                            new Date().toISOString(),


                                        lastOpened:
                                            new Date().toISOString(),


                                        openCount:
                                            1,


                                        keywords:
                                            []


                                    });


                                }


                            });


                            // Neueste Tabs zuerst

                            savedTabs.sort(
                                (a, b) =>
                                    new Date(b.lastOpened) -
                                    new Date(a.lastOpened)
                            );


                            chrome.storage.local.set(
                                {
                                    savedTabs: savedTabs
                                },

                                () => {


                                    console.log(
                                        "Tabs wurden manuell gespeichert"
                                    );


                                    sendResponse({

                                        success: true,

                                        count: tabs.length

                                    });


                                }
                            );


                        }
                    );


                }
            );


            // Nachricht bleibt asynchron offen

            return true;

        }



        // --------------------------------------
        // Star setzen / entfernen
        // --------------------------------------

        if (message.action === "toggleStar") {


            chrome.storage.local.get(
                ["savedTabs"],

                (result) => {


                    const tabs =
                        result.savedTabs || [];


                    const updatedTabs =
                        tabs.map((tab) => {


                            if (tab.id === message.id) {

                                return {

                                    ...tab,

                                    starred:
                                        !tab.starred

                                };

                            }


                            return tab;

                        });


                    chrome.storage.local.set(
                        {
                            savedTabs:
                                updatedTabs
                        },

                        () => {

                            sendResponse({

                                success: true

                            });

                        }
                    );


                }
            );


            return true;

        }



        // --------------------------------------
        // Einzelnen gespeicherten Tab löschen
        // --------------------------------------

        if (message.action === "deleteTab") {


            chrome.storage.local.get(
                ["savedTabs"],

                (result) => {


                    const tabs =
                        result.savedTabs || [];


                    const updatedTabs =
                        tabs.filter(
                            tab =>
                                tab.id !== message.id
                        );


                    chrome.storage.local.set(
                        {
                            savedTabs:
                                updatedTabs
                        },

                        () => {

                            sendResponse({

                                success: true

                            });

                        }
                    );


                }
            );


            return true;

        }


    }
);