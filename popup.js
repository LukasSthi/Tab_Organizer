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

const searchRow =
    document.getElementById("searchRow");

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

const retentionDaysInput =
    document.getElementById("retentionDays");

const saveRetentionSettingsButton =
    document.getElementById("saveRetentionSettings");

const settingsStatus =
    document.getElementById("settingsStatus");


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
// AUTOMATISCHE KATEGORISIERUNG
// ======================================================

function getCategory(domain) {

    const normalizedDomain =
        (domain || "").toLowerCase();


    if (
        normalizedDomain.includes("github.com") ||
        normalizedDomain.includes("stackoverflow.com") ||
        normalizedDomain.includes("developer.mozilla.org") ||
        normalizedDomain.includes("npmjs.com")
    ) {
        return "Development";
    }


    if (
        normalizedDomain.includes("moodle") ||
        normalizedDomain.includes("wikipedia.org") ||
        normalizedDomain.includes("coursera.org") ||
        normalizedDomain.includes("udemy.com") ||
        normalizedDomain.includes("edx.org")
    ) {
        return "Education";
    }


    if (
        normalizedDomain.includes("youtube.com") ||
        normalizedDomain.includes("netflix.com") ||
        normalizedDomain.includes("spotify.com") ||
        normalizedDomain.includes("twitch.tv")
    ) {
        return "Entertainment";
    }


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
// DOMAIN
// ======================================================

function getDomain(url) {

    try {

        return new URL(url).hostname;

    } catch {

        return "";

    }

}


// ======================================================
// URL PRÜFEN
// ======================================================

function isValidTabUrl(url) {

    if (!url) {
        return false;
    }


    return !(
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:")
    );

}


// ======================================================
// TABS LADEN
// ======================================================

function loadTabs() {

    chrome.storage.local.get(
        [
            "savedTabs",
            "retentionDays"
        ],

        (result) => {

            allTabs =
                result.savedTabs || [];


            retentionDaysInput.value =
                result.retentionDays || 3;


            renderEverything();

        }
    );

}


// ======================================================
// TABS MANUELL SPEICHERN
// ======================================================

function saveCurrentTabs() {

    statusElement.textContent =
        "Saving tabs...";


    saveButton.disabled =
        true;


    if (saveSettingsButton) {

        saveSettingsButton.disabled =
            true;

    }


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


            chrome.storage.local.get(
                ["savedTabs"],

                (result) => {


                    // Bereits gespeicherte Tabs
                    // bleiben vollständig erhalten.

                    const existingTabs =
                        result.savedTabs || [];


                    const updatedTabs =
                        [...existingTabs];


                    // Alle bereits gespeicherten URLs

                    const existingUrls =
                        new Set(
                            existingTabs.map(
                                tab => tab.url
                            )
                        );


                    const now =
                        new Date().toISOString();


                    let newTabsCount = 0;


                    openTabs.forEach(
                        (tab) => {


                            if (
                                !isValidTabUrl(
                                    tab.url
                                )
                            ) {
                                return;
                            }


                            // Bereits gespeicherte URL:
                            // nichts tun.

                            const existingIndex =
    updatedTabs.findIndex(
        savedTab =>
            savedTab.url === tab.url
    );


const domain =
    getDomain(
        tab.url
    );


// Bereits gespeicherter Tab:
// Daten aktualisieren,
// aber createdAt und starred behalten.

if (
    existingIndex !== -1
) {

    const existingTab =
        updatedTabs[
            existingIndex
        ];


    updatedTabs[
        existingIndex
    ] = {

        ...existingTab,

        title:
            tab.title ||
            existingTab.title,

        domain:
            domain,

        favicon:
            tab.favIconUrl ||
            existingTab.favicon,

        category:
            getCategory(
                domain
            ),

        starred:
            existingTab.starred === true,

        createdAt:
            existingTab.createdAt,

        lastOpened:
            now,

        openCount:
            (
                existingTab.openCount ||
                0
            ) + 1

    };


    return;

}

                            const newTab = {

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

};


updatedTabs.push(
    newTab
);


existingUrls.add(
    tab.url
);


newTabsCount++;

                        }
                    );


                    // Neueste zuerst

                    updatedTabs.sort(
                        (a, b) =>

                            new Date(
                                b.createdAt
                            )

                            -

                            new Date(
                                a.createdAt
                            )
                    );


                    // UI sofort aktualisieren

                    allTabs =
                        updatedTabs;


                    renderEverything();


                    // In Storage speichern

                    chrome.storage.local.set(
                        {
                            savedTabs:
                                updatedTabs
                        },

                        () => {


                            enableSaveButtons();


                            if (
                                chrome.runtime.lastError
                            ) {

                                statusElement.textContent =
                                    "Could not save tabs.";

                                return;

                            }


                            if (
                                newTabsCount === 0
                            ) {

                                statusElement.textContent =
                                    "All open tabs are already saved.";

                            }

                            else if (
                                newTabsCount === 1
                            ) {

                                statusElement.textContent =
                                    "1 new tab saved.";

                            }

                            else {

                                statusElement.textContent =
                                    `${newTabsCount} new tabs saved.`;

                            }


                            setTimeout(
                                () => {

                                    statusElement.textContent =
                                        "";

                                },

                                1500
                            );

                        }
                    );

                }
            );

        }
    );

}


// ======================================================
// SAVE BUTTONS
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
// RETENTION SETTINGS
// ======================================================

function saveRetentionSettings() {

    let days =
        Number(
            retentionDaysInput.value
        );


    if (
        !Number.isFinite(days) ||
        days < 1
    ) {

        days = 1;

    }


    days =
        Math.floor(days);


    retentionDaysInput.value =
        days;


    chrome.storage.local.set(
        {
            retentionDays:
                days
        },

        () => {


            if (
                chrome.runtime.lastError
            ) {

                settingsStatus.textContent =
                    "Settings could not be saved.";

                return;

            }


            settingsStatus.textContent =
                `Tabs will be deleted after ${days} days.`;


            // Direkt prüfen,
            // ob bereits alte Tabs entfernt werden müssen.

            chrome.runtime.sendMessage(
                {
                    action:
                        "cleanupOldTabs"
                },

                () => {

                    loadTabs();

                }
            );


            setTimeout(
                () => {

                    settingsStatus.textContent =
                        "";

                },

                2000
            );

        }
    );

}


// ======================================================
// STAR / IMPORTANT
// ======================================================

function toggleStar(tabId) {

    const tab =
        allTabs.find(
            item =>
                item.id ===
                tabId
        );


    if (!tab) {
        return;
    }


    tab.starred =
        !tab.starred;


    saveTabsToStorage();

}


// ======================================================
// TAB LÖSCHEN
// ======================================================

function deleteSavedTab(tabId) {

    allTabs =
        allTabs.filter(
            tab =>
                tab.id !==
                tabId
        );


    saveTabsToStorage();

}


// ======================================================
// TABS IN STORAGE SPEICHERN
// ======================================================

function saveTabsToStorage() {

    // UI sofort aktualisieren

    renderEverything();


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
                    chrome.runtime.lastError
                );

            }

        }
    );

}


// ======================================================
// VIEW WECHSELN
// ======================================================

function switchView(view) {

    currentView =
        view;


    // Kategorie-Filter löschen,
    // wenn All Tabs verlassen wird.

    if (
        view !== "all"
    ) {

        activeCategory =
            null;

    }


    // ==================================================
    // SEARCH SICHTBARKEIT
    // ==================================================

    if (
        view === "all" ||
        view === "starred"
    ) {

        searchRow.classList.remove(
            "hidden"
        );

    } else {

        searchRow.classList.add(
            "hidden"
        );


        // Suche zurücksetzen,
        // wenn Home oder Settings geöffnet wird.

        searchInput.value =
            "";

    }


    // ==================================================
    // VIEW ANZEIGEN
    // ==================================================

    document
        .querySelectorAll(
            ".view"
        )
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


    // ==================================================
    // NAVIGATION
    // ==================================================

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
// RELATIVE TIME
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


    if (
        minutes < 1
    ) {

        return "now";

    }


    if (
        minutes < 60
    ) {

        return `${minutes}m ago`;

    }


    const hours =
        Math.floor(
            minutes /
            60
        );


    if (
        hours < 24
    ) {

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


    // ==================================================
    // FAVICON
    // ==================================================

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


    // ==================================================
    // TAB INFO
    // ==================================================

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


    // ==================================================
    // ACTIONS
    // ==================================================

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
                tab.createdAt ||
                tab.lastOpened
            );


        actions.appendChild(
            time
        );

    }


    // ==================================================
    // STAR
    // ==================================================

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

            event.preventDefault();

            event.stopPropagation();


            toggleStar(
                tab.id
            );

        }
    );


    // ==================================================
    // DELETE
    // ==================================================

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


    // ==================================================
    // TAB ÖFFNEN
    // ==================================================

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


    // ==================================================
    // CARD ZUSAMMENSETZEN
    // ==================================================

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


            categories[category] =
                (
                    categories[category] ||
                    0
                ) + 1;

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
                    ] ||
                    "□";


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
// RENDER
// ======================================================

function renderEverything() {

    const filteredTabs =
        getFilteredTabs();


    // Categories

    renderCategories();


    // ==================================================
    // RECENT
    // ==================================================

    const recent =
        [...allTabs]
            .sort(
                (a, b) =>

                    new Date(
                        b.createdAt ||
                        b.lastOpened
                    )

                    -

                    new Date(
                        a.createdAt ||
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


    // ==================================================
    // IMPORTANT
    // ==================================================

    const important =
        allTabs
            .filter(
                tab =>
                    tab.starred ===
                    true
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


    // ==================================================
    // ALL TABS
    // ==================================================

    renderTabList(
        allTabsContainer,
        filteredTabs,
        false,
        "No tabs found."
    );


    allCount.textContent =
        filteredTabs.length;


    // ==================================================
    // STARRED
    // ==================================================

    const starred =
        filteredTabs.filter(
            tab =>
                tab.starred ===
                true
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

saveButton.addEventListener(
    "click",
    saveCurrentTabs
);


if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        saveCurrentTabs
    );

}


saveRetentionSettingsButton.addEventListener(
    "click",
    saveRetentionSettings
);


searchInput.addEventListener(
    "input",

    () => {

        renderEverything();

    }
);


// ======================================================
// NAVIGATION
// ======================================================

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


// ======================================================
// SEE ALL
// ======================================================

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

chrome.runtime.sendMessage(
    {
        action:
            "cleanupOldTabs"
    },

    () => {

        loadTabs();

    }
);