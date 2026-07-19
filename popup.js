console.log("TabBuddy Popup geladen");


// ==============================
// STATE
// ==============================


let allTabs = [];

let currentView = "home";

let activeCategory = null;



// ==============================
// ELEMENTS
// ==============================


const saveButton =
    document.getElementById("saveTabs");


const saveSettingsButton =
    document.getElementById(
        "saveTabsSettings"
    );


const searchInput =
    document.getElementById(
        "search"
    );


const statusElement =
    document.getElementById(
        "status"
    );


const categoryGrid =
    document.getElementById(
        "categoryGrid"
    );


const recentTabs =
    document.getElementById(
        "recentTabs"
    );


const importantTabs =
    document.getElementById(
        "importantTabs"
    );


const allTabsContainer =
    document.getElementById(
        "allTabs"
    );


const starredTabs =
    document.getElementById(
        "starredTabs"
    );


const allCount =
    document.getElementById(
        "allCount"
    );


const starredCount =
    document.getElementById(
        "starredCount"
    );



// ==============================
// CATEGORY ICONS
// ==============================


const categoryIcons = {

    Development: "⌘",

    Education: "◈",

    Entertainment: "▷",

    Shopping: "◇",

    Uncategorized: "□"

};



// ==============================
// TABS LADEN
// ==============================


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



// ==============================
// MANUELL SPEICHERN
// ==============================


function saveCurrentTabs() {


    statusElement.textContent =
        "Saving tabs...";


    chrome.runtime.sendMessage(
        {
            action:
                "saveTabs"
        },

        (response) => {


            if (
                chrome.runtime.lastError
            ) {

                statusElement.textContent =
                    "Could not save tabs.";

                return;

            }


            statusElement.textContent =
                "Tabs saved successfully.";


            loadTabs();


            setTimeout(
                () => {

                    statusElement.textContent =
                        "";

                },

                2000
            );


        }
    );


}



// ==============================
// VIEW WECHSELN
// ==============================


function switchView(view) {


    currentView =
        view;


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



// ==============================
// FILTER
// ==============================


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



// ==============================
// ZEIT FORMATIEREN
// ==============================


function getRelativeTime(
    dateString
) {


    if (!dateString) {

        return "";

    }


    const now =
        new Date();


    const date =
        new Date(
            dateString
        );


    const difference =
        now - date;


    const minutes =
        Math.floor(
            difference /
            60000
        );


    if (minutes < 1) {

        return "now";

    }


    if (minutes < 60) {

        return (
            minutes +
            "m ago"
        );

    }


    const hours =
        Math.floor(
            minutes /
            60
        );


    if (hours < 24) {

        return (
            hours +
            "h ago"
        );

    }


    const days =
        Math.floor(
            hours /
            24
        );


    return (
        days +
        "d ago"
    );


}



// ==============================
// TAB CARD ERSTELLEN
// ==============================


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



    // --------------------------
    // Favicon
    // --------------------------


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


        favicon.appendChild(
            image
        );


    } else {


        favicon.textContent =
            "□";


    }



    // --------------------------
    // Tab Info
    // --------------------------


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
        tab.category;


    info.appendChild(
        title
    );


    info.appendChild(
        domain
    );



    // --------------------------
    // Actions
    // --------------------------


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "tab-actions";



    // Zeit anzeigen


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



    // Star Button


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
        "Mark as important";


    starButton.addEventListener(
        "click",

        (event) => {


            event.stopPropagation();


            chrome.runtime.sendMessage(
                {

                    action:
                        "toggleStar",

                    id:
                        tab.id

                },

                () => {

                    loadTabs();

                }
            );


        }
    );



    // Delete Button


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


            event.stopPropagation();


            chrome.runtime.sendMessage(
                {

                    action:
                        "deleteTab",

                    id:
                        tab.id

                },

                () => {

                    loadTabs();

                }
            );


        }
    );


    actions.appendChild(
        starButton
    );


    actions.appendChild(
        deleteButton
    );



    // --------------------------
    // Tab öffnen
    // --------------------------


    card.addEventListener(
        "click",

        () => {


            chrome.tabs.create(
                {
                    url:
                        tab.url
                }
            );


        }
    );



    // --------------------------
    // Card zusammensetzen
    // --------------------------


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



// ==============================
// TAB LIST RENDERN
// ==============================


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



// ==============================
// KATEGORIEN RENDERN
// ==============================


function renderCategories() {


    categoryGrid.innerHTML =
        "";


    const categories =
        {};


    allTabs.forEach(
        (tab) => {


            if (
                !categories[
                    tab.category
                ]
            ) {

                categories[
                    tab.category
                ] = 0;

            }


            categories[
                tab.category
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


        categoryGrid.innerHTML = `

            <div class="empty-state">

                Save some tabs to see
                categories.

            </div>

        `;


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


                card.innerHTML = `

                    <span class="category-left">

                        <span>

                            ${
                                categoryIcons[
                                    category
                                ] || "□"
                            }

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


                        activeCategory =
                            category;


                        renderEverything();


                    }
                );


                categoryGrid.appendChild(
                    card
                );


            }
        );


}



// ==============================
// ALLES RENDERN
// ==============================


function renderEverything() {


    const filteredTabs =
        getFilteredTabs();



    // Kategorien


    renderCategories();



    // Recent Tabs


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



    // Important Tabs


    const important =
        allTabs
            .filter(
                tab =>
                    tab.starred
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



    // All Tabs


    renderTabList(

        allTabsContainer,

        filteredTabs,

        false,

        "No tabs found."

    );


    allCount.textContent =
        filteredTabs.length;



    // Starred Tabs


    const starred =
        filteredTabs.filter(
            tab =>
                tab.starred
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



// ==============================
// EVENTS
// ==============================


// Tabs speichern


saveButton.addEventListener(
    "click",
    saveCurrentTabs
);


saveSettingsButton.addEventListener(
    "click",
    saveCurrentTabs
);



// Suche


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


                    switchView(
                        button.dataset.view
                    );


                }
            );


        }
    );



// See All Buttons


document
    .querySelectorAll(
        ".see-all"
    )
    .forEach(
        (button) => {


            button.addEventListener(
                "click",

                () => {


                    switchView(
                        button.dataset
                            .viewTarget
                    );


                }
            );


        }
    );



// ==============================
// START
// ==============================


loadTabs();