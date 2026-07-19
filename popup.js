console.log("TabBuddy Popup geladen");


// ======================================================
// STATE
// ======================================================

let allTabs = [];

let currentView = "home";

let activeCategory = null;

let showAllCategories = false;


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

const toggleCategoriesButton =
    document.getElementById("toggleCategories");

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
    Work: "▣",
    Education: "◈",
    Research: "⌕",
    Design: "✦",
    Social: "◎",
    Entertainment: "▷",
    Shopping: "◇",
    News: "≡",
    Uncategorized: "□"
};


// ======================================================
// AUTOMATISCHE KATEGORISIERUNG
// ======================================================

function getCategory(domain) {

    const normalizedDomain =
        (domain || "").toLowerCase();


    // ==================================================
    // DEVELOPMENT
    // ==================================================

    if (
        normalizedDomain.includes("github.com") ||
        normalizedDomain.includes("gitlab.com") ||
        normalizedDomain.includes("bitbucket.org") ||
        normalizedDomain.includes("stackoverflow.com") ||
        normalizedDomain.includes("developer.mozilla.org") ||
        normalizedDomain.includes("npmjs.com") ||
        normalizedDomain.includes("codepen.io") ||
        normalizedDomain.includes("codesandbox.io") ||
        normalizedDomain.includes("vercel.com") ||
        normalizedDomain.includes("netlify.com")
    ) {
        return "Development";
    }


    // ==================================================
    // WORK
    // ==================================================

    if (
        normalizedDomain.includes("slack.com") ||
        normalizedDomain.includes("notion.so") ||
        normalizedDomain.includes("notion.site") ||
        normalizedDomain.includes("jira.com") ||
        normalizedDomain.includes("atlassian.net") ||
        normalizedDomain.includes("asana.com") ||
        normalizedDomain.includes("monday.com") ||
        normalizedDomain.includes("trello.com") ||
        normalizedDomain.includes("office.com") ||
        normalizedDomain.includes("microsoft365.com") ||
        normalizedDomain.includes("teams.microsoft.com") ||
        normalizedDomain.includes("docs.google.com") ||
        normalizedDomain.includes("drive.google.com") ||
        normalizedDomain.includes("sheets.google.com") ||
        normalizedDomain.includes("calendar.google.com")
    ) {
        return "Work";
    }


    // ==================================================
    // EDUCATION
    // ==================================================

    if (
        normalizedDomain.includes("moodle") ||
        normalizedDomain.includes("coursera.org") ||
        normalizedDomain.includes("udemy.com") ||
        normalizedDomain.includes("edx.org") ||
        normalizedDomain.includes("khanacademy.org") ||
        normalizedDomain.includes("codecademy.com") ||
        normalizedDomain.includes("duolingo.com") ||
        normalizedDomain.includes("skillshare.com")
    ) {
        return "Education";
    }


    // ==================================================
    // RESEARCH
    // ==================================================

    if (
        normalizedDomain.includes("scholar.google.") ||
        normalizedDomain.includes("arxiv.org") ||
        normalizedDomain.includes("researchgate.net") ||
        normalizedDomain.includes("pubmed.ncbi.nlm.nih.gov") ||
        normalizedDomain.includes("ncbi.nlm.nih.gov") ||
        normalizedDomain.includes("jstor.org") ||
        normalizedDomain.includes("sciencedirect.com") ||
        normalizedDomain.includes("springer.com") ||
        normalizedDomain.includes("nature.com") ||
        normalizedDomain.includes("wikipedia.org")
    ) {
        return "Research";
    }


    // ==================================================
    // DESIGN
    // ==================================================

    if (
        normalizedDomain.includes("figma.com") ||
        normalizedDomain.includes("canva.com") ||
        normalizedDomain.includes("behance.net") ||
        normalizedDomain.includes("dribbble.com") ||
        normalizedDomain.includes("adobe.com") ||
        normalizedDomain.includes("framer.com") ||
        normalizedDomain.includes("webflow.com")
    ) {
        return "Design";
    }


    // ==================================================
    // SOCIAL
    // ==================================================

    if (
        normalizedDomain.includes("linkedin.com") ||
        normalizedDomain.includes("reddit.com") ||
        normalizedDomain.includes("twitter.com") ||
        normalizedDomain.includes("x.com") ||
        normalizedDomain.includes("instagram.com") ||
        normalizedDomain.includes("facebook.com") ||
        normalizedDomain.includes("discord.com") ||
        normalizedDomain.includes("threads.net")
    ) {
        return "Social";
    }


    // ==================================================
    // ENTERTAINMENT
    // ==================================================

    if (
        normalizedDomain.includes("youtube.com") ||
        normalizedDomain.includes("netflix.com") ||
        normalizedDomain.includes("spotify.com") ||
        normalizedDomain.includes("twitch.tv") ||
        normalizedDomain.includes("disneyplus.com") ||
        normalizedDomain.includes("primevideo.com") ||
        normalizedDomain.includes("soundcloud.com")
    ) {
        return "Entertainment";
    }


    // ==================================================
    // SHOPPING
    // ==================================================

    if (
        normalizedDomain.includes("amazon.") ||
        normalizedDomain.includes("ebay.") ||
        normalizedDomain.includes("zalando.") ||
        normalizedDomain.includes("etsy.com") ||
        normalizedDomain.includes("otto.de") ||
        normalizedDomain.includes("mediamarkt.") ||
        normalizedDomain.includes("saturn.")
    ) {
        return "Shopping";
    }


    // ==================================================
    // NEWS
    // ==================================================

    if (
        normalizedDomain.includes("bbc.") ||
        normalizedDomain.includes("cnn.com") ||
        normalizedDomain.includes("nytimes.com") ||
        normalizedDomain.includes("theguardian.com") ||
        normalizedDomain.includes("reuters.com") ||
        normalizedDomain.includes("spiegel.de") ||
        normalizedDomain.includes("zeit.de") ||
        normalizedDomain.includes("tagesschau.de") ||
        normalizedDomain.includes("faz.net") ||
        normalizedDomain.includes("sueddeutsche.de")
    ) {
        return "News";
    }


    // ==================================================
    // FALLBACK
    // ==================================================

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


            if (retentionDaysInput) {

                retentionDaysInput.value =
                    result.retentionDays || 3;

            }


            renderEverything();

        }
    );

}


// ======================================================
// TABS MANUELL SPEICHERN / AKTUALISIEREN
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


                    // Alle bisher gespeicherten Tabs behalten.

                    const existingTabs =
                        result.savedTabs || [];


                    const updatedTabs =
                        [...existingTabs];


                    const now =
                        new Date().toISOString();


                    let newTabsCount =
                        0;


                    let updatedTabsCount =
                        0;


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


                            // Prüfen, ob dieser Tab
                            // bereits gespeichert ist.

                            const existingIndex =
                                updatedTabs.findIndex(
                                    savedTab =>
                                        savedTab.url ===
                                        tab.url
                                );


                            // ==================================================
                            // BESTEHENDEN TAB AKTUALISIEREN
                            // ==================================================

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

                                    // Alle bisherigen Werte behalten

                                    ...existingTab,


                                    // Titel aktualisieren

                                    title:

                                        tab.title ||

                                        existingTab.title ||

                                        "Untitled Tab",


                                    // Domain aktualisieren

                                    domain:
                                        domain,


                                    // Favicon aktualisieren

                                    favicon:

                                        tab.favIconUrl ||

                                        existingTab.favicon ||

                                        null,


                                    // Kategorie neu prüfen

                                    category:

                                        getCategory(
                                            domain
                                        ),


                                    // WICHTIG:
                                    // Star-Status bleibt erhalten

                                    starred:

                                        existingTab.starred ===
                                        true,


                                    // WICHTIG:
                                    // ursprüngliches Speicherdatum bleibt erhalten

                                    createdAt:

                                        existingTab.createdAt ||

                                        now,


                                    // Zeitpunkt des letzten Speicherns

                                    lastOpened:
                                        now,


                                    // Anzahl erhöhen

                                    openCount:

                                        (
                                            existingTab.openCount ||
                                            0
                                        ) + 1

                                };


                                updatedTabsCount++;


                                return;

                            }


                            // ==================================================
                            // NEUEN TAB HINZUFÜGEN
                            // ==================================================

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


                            newTabsCount++;

                        }
                    );


                    // ==================================================
                    // SORTIEREN
                    // ==================================================
                    // Zuletzt aktualisierte Tabs zuerst

                    updatedTabs.sort(
                        (a, b) =>

                            new Date(
                                b.lastOpened ||
                                b.createdAt
                            )

                            -

                            new Date(
                                a.lastOpened ||
                                a.createdAt
                            )
                    );


                    // ==================================================
                    // UI SOFORT AKTUALISIEREN
                    // ==================================================

                    allTabs =
                        updatedTabs;


                    renderEverything();


                    // ==================================================
                    // STORAGE AKTUALISIEREN
                    // ==================================================

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

                                console.error(
                                    chrome.runtime.lastError
                                );


                                statusElement.textContent =
                                    "Could not save tabs.";


                                return;

                            }


                            // ==================================================
                            // STATUS MELDUNG
                            // ==================================================

                            if (
                                newTabsCount === 0 &&
                                updatedTabsCount === 0
                            ) {

                                statusElement.textContent =
                                    "No tabs to save.";

                            }

                            else if (
                                newTabsCount === 0
                            ) {

                                statusElement.textContent =
                                    `${updatedTabsCount} saved tabs updated.`;

                            }

                            else if (
                                updatedTabsCount === 0
                            ) {

                                statusElement.textContent =

                                    newTabsCount === 1

                                        ? "1 new tab saved."

                                        : `${newTabsCount} new tabs saved.`;

                            }

                            else {

                                statusElement.textContent =
                                    `${newTabsCount} new, ${updatedTabsCount} updated.`;

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
                tab.lastOpened ||
                tab.createdAt
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


    // Nach Anzahl sortieren:
    // größte Kategorie zuerst

    const entries =
        Object.entries(
            categories
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    // ==================================================
    // KEINE KATEGORIEN
    // ==================================================

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


        // Show more Button verstecken

        toggleCategoriesButton.classList.add(
            "hidden"
        );


        return;

    }


    // ==================================================
    // SHOW MORE BUTTON
    // ==================================================

    if (
        entries.length > 4
    ) {

        toggleCategoriesButton.classList.remove(
            "hidden"
        );


        toggleCategoriesButton.textContent =
            showAllCategories
                ? "Show less"
                : `Show more (${entries.length - 4})`;

    } else {

        toggleCategoriesButton.classList.add(
            "hidden"
        );

    }


    // ==================================================
    // KATEGORIEN AUSWÄHLEN
    // ==================================================

    const visibleCategories =
        showAllCategories

            ? entries

            : entries.slice(
                0,
                4
            );


    // ==================================================
    // KATEGORIEN RENDERN
    // ==================================================

    visibleCategories.forEach(
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


            // Klick auf Kategorie

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
                        b.lastOpened ||
                        b.createdAt
                    )

                    -

                    new Date(
                        a.lastOpened ||
                        a.createdAt
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


if (saveRetentionSettingsButton) {

    saveRetentionSettingsButton.addEventListener(
        "click",
        saveRetentionSettings
    );

}


searchInput.addEventListener(
    "input",

    () => {

        renderEverything();

    }
);

toggleCategoriesButton.addEventListener(
    "click",

    () => {

        showAllCategories =
            !showAllCategories;


        renderCategories();

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