console.log("TabBuddy Popup geladen");


// ======================================================
// STATE
// ======================================================

let allTabs = [];

let currentView = "home";

let activeCategory = null;


// ======================================================
// ELEMENTS
// ======================================================

const saveButton =
    document.getElementById("saveTabs");

const saveSettingsButton =
    document.getElementById("saveTabsSettings");

const searchInput =
    document.getElementById("search");

const statusElement =
    document.getElementById("status");

const categoryGrid =
    document.getElementById("categoryGrid");

const recentTabs =
    document.getElementById("recentTabs");

const importantTabs =
    document.getElementById("importantTabs");

const allTabsContainer =
    document.getElementById("allTabs");

const starredTabs =
    document.getElementById("starredTabs");

const allCount =
    document.getElementById("allCount");

const starredCount =
    document.getElementById("starredCount");


// ======================================================
// CATEGORY ICONS
// ======================================================

const categoryIcons = {

    Development: "⌘",

    Education: "◈",

    Entertainment: "▷",

    Shopping: "◇",

    Uncategorized: "□"

};


// ======================================================
// CATEGORY LOGIC
// ======================================================

function getCategory(domain) {

    const normalizedDomain =
        (domain || "").toLowerCase();


    // Development

    if (
        normalizedDomain.includes("github.com") ||
        normalizedDomain.includes("stackoverflow.com") ||
        normalizedDomain.includes("developer.mozilla.org") ||
        normalizedDomain.includes("npmjs.com")
    ) {

        return "Development";

    }


    // Education

    if (
        normalizedDomain.includes("moodle") ||
        normalizedDomain.includes("wikipedia.org") ||
        normalizedDomain.includes("coursera.org") ||
        normalizedDomain.includes("udemy.com") ||
        normalizedDomain.includes("edx.org")
    ) {

        return "Education";

    }


    // Entertainment

    if (
        normalizedDomain.includes("youtube.com") ||
        normalizedDomain.includes("netflix.com") ||
        normalizedDomain.includes("spotify.com") ||
        normalizedDomain.includes("twitch.tv")
    ) {

        return "Entertainment";

    }


    // Shopping

    if (
        normalizedDomain.includes("amazon.") ||
        normalizedDomain.includes("ebay.") ||
        normalizedDomain.includes("zalando.")
    ) {

        return "Shopping";

    }


    return "Uncategorized";

}


// ======================================================
// DOMAIN AUS URL
// ======================================================

function getDomain(url) {

    try {

        return new URL(url).hostname;

    } catch (error) {

        return "";

    }

}


// ======================================================
// PRÜFEN, OB TAB GESPEICHERT WERDEN DARF
// ======================================================

function isValidTabUrl(url) {

    if (!url) {

        return false;

    }


    if (
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:")
    ) {

        return false;

    }


    return true;

}


// ======================================================
// TABS AUS STORAGE LADEN
// ======================================================

function loadTabs() {

    chrome.storage.local.get(
        ["savedTabs"],

        (result) => {

            allTabs =
                result.savedTabs || [];


            renderEverything();

        }
    );

}


// ======================================================
// TABS MANUELL SPEICHERN
// ======================================================

function saveCurrentTabs() {

    // Sofortiges visuelles Feedback

    statusElement.textContent =
        "Saving tabs...";


    // Button während des Speicherns deaktivieren

    saveButton.disabled =
        true;


    if (saveSettingsButton) {

        saveSettingsButton.disabled =
            true;

    }


    // Tabs des aktuellen Fensters holen

    chrome.tabs.query(
        {
            currentWindow: true
        },

        (openTabs) => {


            if (chrome.runtime.lastError) {

                console.error(
                    chrome.runtime.lastError
                );


                statusElement.textContent =
                    "Could not save tabs.";


                enableSaveButtons();


                return;

            }


            // Bereits gespeicherte Tabs laden

            chrome.storage.local.get(
                ["savedTabs"],

                (result) => {


                    const existingTabs =
                        result.savedTabs || [];


                    const now =
                        new Date().toISOString();


                    // Map verwenden:
                    // URL = eindeutiger Schlüssel

                    const tabsByUrl =
                        new Map();


                    existingTabs.forEach(
                        (tab) => {

                            tabsByUrl.set(
                                tab.url,
                                tab
                            );

                        }
                    );


                    // Offene Tabs verarbeiten

                    openTabs.forEach(
                        (tab) => {


                            if (
                                !isValidTabUrl(
                                    tab.url
                                )
                            ) {

                                return;

                            }


                            const domain =
                                getDomain(
                                    tab.url
                                );


                            const existingTab =
                                tabsByUrl.get(
                                    tab.url
                                );


                            // --------------------------------
                            // Bereits gespeicherter Tab
                            // --------------------------------

                            if (existingTab) {


                                tabsByUrl.set(
                                    tab.url,

                                    {

                                        ...existingTab,


                                        title:

                                            tab.title ||

                                            existingTab.title ||

                                            "Untitled Tab",


                                        domain:
                                            domain,


                                        favicon:

                                            tab.favIconUrl ||

                                            existingTab.favicon ||

                                            null,


                                        category:

                                            getCategory(
                                                domain
                                            ),


                                        // Wichtig:
                                        // Starred bleibt erhalten

                                        starred:

                                            existingTab.starred === true,


                                        lastOpened:

                                            now,


                                        openCount:

                                            (
                                                existingTab.openCount ||
                                                0
                                            ) + 1

                                    }
                                );


                            }


                            // --------------------------------
                            // Neuer Tab
                            // --------------------------------

                            else {


                                tabsByUrl.set(
                                    tab.url,

                                    {

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

                                            getCategory(
                                                domain
                                            ),


                                        tags:
                                            [],


                                        workspace:
                                            null,


                                        // Wichtig für Important Tabs

                                        starred:
                                            false,


                                        createdAt:
                                            now,


                                        lastOpened:
                                            now,


                                        openCount:
                                            1,


                                        keywords:
                                            []

                                    }
                                );


                            }


                        }
                    );


                    // Map wieder in Array umwandeln

                    const updatedTabs =
                        Array.from(
                            tabsByUrl.values()
                        );


                    // Neueste zuerst

                    updatedTabs.sort(
                        (a, b) =>

                            new Date(
                                b.lastOpened
                            )

                            -

                            new Date(
                                a.lastOpened
                            )
                    );


                    // --------------------------------
                    // UI SOFORT AKTUALISIEREN
                    // --------------------------------

                    allTabs =
                        updatedTabs;


                    renderEverything();


                    // --------------------------------
                    // STORAGE
                    // --------------------------------

                    chrome.storage.local.set(
                        {
                            savedTabs:
                                updatedTabs
                        },

                        () => {


                            if (
                                chrome.runtime.lastError
                            ) {


                                console.error(
                                    chrome.runtime.lastError
                                );


                                statusElement.textContent =
                                    "Could not save tabs.";


                                enableSaveButtons();


                                return;

                            }


                            statusElement.textContent =
                                openTabs.length === 1

                                    ? "1 tab saved."

                                    : `${openTabs.length} tabs saved.`;


                            enableSaveButtons();


                            // Meldung wieder entfernen

                            setTimeout(
                                () => {

                                    statusElement.textContent =
                                        "";

                                },

                                1200
                            );


                        }
                    );


                }
            );


        }
    );

}


// ======================================================
// SAVE BUTTONS WIEDER AKTIVIEREN
// ======================================================

function enableSaveButtons() {

    saveButton.disabled =
        false;


    if (saveSettingsButton) {

        saveSettingsButton.disabled =
            false;

    }

}


// ======================================================
// STAR TOGGLE
// ======================================================

function toggleStar(tabId) {

    // Tab direkt im lokalen State finden

    const tab =
        allTabs.find(
            item =>
                item.id === tabId
        );


    if (!tab) {

        return;

    }


    // Sofort umschalten

    tab.starred =
        !tab.starred;


    // UI sofort aktualisieren

    renderEverything();


    // Danach speichern

    chrome.storage.local.set(
        {
            savedTabs:
                allTabs
        },

        () => {


            if (
                chrome.runtime.lastError
            ) {

                console.error(
                    "Star konnte nicht gespeichert werden:",
                    chrome.runtime.lastError
                );

            }

        }
    );

}


// ======================================================
// TAB LÖSCHEN
// ======================================================

function deleteSavedTab(tabId) {

    allTabs =
        allTabs.filter(
            tab =>
                tab.id !== tabId
        );


    // UI sofort aktualisieren

    renderEverything();


    // Storage aktualisieren

    chrome.storage.local.set(
        {
            savedTabs:
                allTabs
        }
    );

}


// ======================================================
// VIEW WECHSELN
// ======================================================

function switchView(view) {

    currentView =
        view;


    // Kategorie nur entfernen,
    // wenn wir die All-Tabs-Ansicht verlassen

    if (
        view !== "all"
    ) {

        activeCategory =
            null;

    }


    document
        .querySelectorAll(".view")
        .forEach(
            element => {

                element.classList.remove(
                    "active"
                );

            }
        );


    const targetView =
        document.getElementById(
            view + "View"
        );


    if (targetView) {

        targetView.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            button => {


                button.classList.toggle(

                    "active",

                    button.dataset.view ===
                        view

                );


            }
        );


    renderEverything();

}


// ======================================================
// FILTER
// ======================================================

function getFilteredTabs() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    return allTabs.filter(
        (tab) => {


            const matchesCategory =

                !activeCategory ||

                tab.category ===
                    activeCategory;


            const matchesSearch =

                !searchTerm ||

                (tab.title || "")
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )

                ||

                (tab.url || "")
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )

                ||

                (tab.domain || "")
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )

                ||

                (tab.category || "")
                    .toLowerCase()
                    .includes(
                        searchTerm
                    );


            return (

                matchesCategory &&

                matchesSearch

            );


        }
    );

}


// ======================================================
// RELATIVE ZEIT
// ======================================================

function getRelativeTime(
    dateString
) {

    if (!dateString) {

        return "";

    }


    const difference =

        Date.now()

        -

        new Date(
            dateString
        ).getTime();


    const minutes =
        Math.max(

            0,

            Math.floor(
                difference /
                60000
            )

        );


    if (minutes < 1) {

        return "now";

    }


    if (minutes < 60) {

        return `${minutes}m ago`;

    }


    const hours =
        Math.floor(
            minutes /
            60
        );


    if (hours < 24) {

        return `${hours}h ago`;

    }


    const days =
        Math.floor(
            hours /
            24
        );


    return `${days}d ago`;

}


// ======================================================
// TAB CARD
// ======================================================

function createTabCard(
    tab,
    showTime = false
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "tab-card";


    // --------------------------------
    // FAVICON
    // --------------------------------

    const favicon =
        document.createElement(
            "div"
        );


    favicon.className =
        "favicon";


    if (tab.favicon) {


        const image =
            document.createElement(
                "img"
            );


        image.src =
            tab.favicon;


        image.alt =
            "";


        favicon.appendChild(
            image
        );


    } else {


        favicon.textContent =
            "□";


    }


    // --------------------------------
    // INFO
    // --------------------------------

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "tab-info";


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "tab-title";


    title.textContent =
        tab.title ||
        "Untitled Tab";


    const domain =
        document.createElement(
            "div"
        );


    domain.className =
        "tab-domain";


    domain.textContent =
        tab.domain ||
        tab.category ||
        "";


    info.appendChild(
        title
    );


    info.appendChild(
        domain
    );


    // --------------------------------
    // ACTIONS
    // --------------------------------

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "tab-actions";


    // Zeit

    if (showTime) {


        const time =
            document.createElement(
                "span"
            );


        time.className =
            "tab-time";


        time.textContent =
            getRelativeTime(
                tab.lastOpened
            );


        actions.appendChild(
            time
        );


    }


    // --------------------------------
    // STAR
    // --------------------------------

    const starButton =
        document.createElement(
            "button"
        );


    starButton.className =
        "star-button";


    starButton.textContent =
        tab.starred
            ? "★"
            : "☆";


    starButton.title =
        tab.starred

            ? "Remove from important"

            : "Mark as important";


    starButton.addEventListener(
        "click",

        (event) => {


            // Verhindert,
            // dass gleichzeitig der Tab geöffnet wird

            event.preventDefault();

            event.stopPropagation();


            toggleStar(
                tab.id
            );


        }
    );


    // --------------------------------
    // DELETE
    // --------------------------------

    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.className =
        "delete-button";


    deleteButton.textContent =
        "×";


    deleteButton.title =
        "Remove saved tab";


    deleteButton.addEventListener(
        "click",

        (event) => {


            event.preventDefault();

            event.stopPropagation();


            deleteSavedTab(
                tab.id
            );


        }
    );


    actions.appendChild(
        starButton
    );


    actions.appendChild(
        deleteButton
    );


    // --------------------------------
    // TAB ÖFFNEN
    // --------------------------------

    card.addEventListener(
        "click",

        () => {


            if (!tab.url) {

                return;

            }


            chrome.tabs.create(
                {
                    url:
                        tab.url
                }
            );


        }
    );


    // --------------------------------
    // CARD ZUSAMMENSETZEN
    // --------------------------------

    card.appendChild(
        favicon
    );


    card.appendChild(
        info
    );


    card.appendChild(
        actions
    );


    return card;

}


// ======================================================
// TAB LIST
// ======================================================

function renderTabList(
    container,
    tabs,
    showTime = false,
    emptyText = "No tabs found."
) {

    container.innerHTML =
        "";


    if (
        tabs.length === 0
    ) {


        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.textContent =
            emptyText;


        container.appendChild(
            empty
        );


        return;

    }


    tabs.forEach(
        (tab) => {


            container.appendChild(

                createTabCard(
                    tab,
                    showTime
                )

            );


        }
    );

}


// ======================================================
// CATEGORIES
// ======================================================

function renderCategories() {

    categoryGrid.innerHTML =
        "";


    const categories =
        {};


    allTabs.forEach(
        (tab) => {


            const category =
                tab.category ||
                "Uncategorized";


            if (
                !categories[
                    category
                ]
            ) {

                categories[
                    category
                ] = 0;

            }


            categories[
                category
            ]++;

        }
    );


    const entries =
        Object.entries(
            categories
        );


    if (
        entries.length === 0
    ) {


        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "empty-state";


        empty.textContent =
            "Save some tabs to see categories.";


        categoryGrid.appendChild(
            empty
        );


        return;

    }


    entries
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(
            0,
            4
        )
        .forEach(
            ([category, count]) => {


                const card =
                    document.createElement(
                        "button"
                    );


                card.className =
                    "category-card";


                const icon =
                    categoryIcons[
                        category
                    ] || "□";


                card.innerHTML = `

                    <span class="category-left">

                        <span>
                            ${icon}
                        </span>

                        <span class="category-name">
                            ${category}
                        </span>

                    </span>

                    <span class="category-count">
                        ${count}
                    </span>

                `;


                card.addEventListener(
                    "click",

                    () => {


                        activeCategory =
                            category;


                        switchView(
                            "all"
                        );


                    }
                );


                categoryGrid.appendChild(
                    card
                );


            }
        );

}


// ======================================================
// RENDER EVERYTHING
// ======================================================

function renderEverything() {

    const filteredTabs =
        getFilteredTabs();


    // --------------------------------
    // CATEGORIES
    // --------------------------------

    renderCategories();


    // --------------------------------
    // RECENT
    // --------------------------------

    const recent =
        [...allTabs]
            .sort(
                (a, b) =>

                    new Date(
                        b.lastOpened
                    )

                    -

                    new Date(
                        a.lastOpened
                    )
            )
            .slice(
                0,
                3
            );


    renderTabList(

        recentTabs,

        recent,

        true,

        "No saved tabs yet."

    );


    // --------------------------------
    // IMPORTANT
    // --------------------------------

    const important =
        allTabs
            .filter(
                tab =>
                    tab.starred === true
            )
            .slice(
                0,
                3
            );


    renderTabList(

        importantTabs,

        important,

        false,

        "Star tabs to mark them as important."

    );


    // --------------------------------
    // ALL TABS
    // --------------------------------

    renderTabList(

        allTabsContainer,

        filteredTabs,

        false,

        "No tabs found."

    );


    allCount.textContent =
        filteredTabs.length;


    // --------------------------------
    // STARRED
    // --------------------------------

    const starred =
        filteredTabs.filter(
            tab =>
                tab.starred === true
        );


    renderTabList(

        starredTabs,

        starred,

        false,

        "No starred tabs yet."

    );


    starredCount.textContent =
        starred.length;

}


// ======================================================
// EVENTS
// ======================================================


// Save Header Button

saveButton.addEventListener(
    "click",
    saveCurrentTabs
);


// Save Settings Button

if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        saveCurrentTabs
    );

}


// Search

searchInput.addEventListener(
    "input",

    () => {

        renderEverything();

    }
);


// Bottom Navigation

document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(
        (button) => {


            button.addEventListener(
                "click",

                () => {


                    activeCategory =
                        null;


                    switchView(
                        button.dataset.view
                    );


                }
            );


        }
    );


// See All

document
    .querySelectorAll(
        ".see-all"
    )
    .forEach(
        (button) => {


            button.addEventListener(
                "click",

                () => {


                    activeCategory =
                        null;


                    switchView(
                        button.dataset
                            .viewTarget
                    );


                }
            );


        }
    );


// ======================================================
// START
// ======================================================

loadTabs();