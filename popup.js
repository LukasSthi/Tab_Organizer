console.log("Popup geladen");



const saveButton = document.getElementById("saveTabs");

const tabList = document.getElementById("tabList");

const searchInput = document.getElementById("search");
let allTabs = [];


// Tabs speichern

saveButton.addEventListener("click", () => {


    chrome.runtime.sendMessage({

        action: "saveTabs"

    });


    document.getElementById("status").innerHTML =
    "Tabs gespeichert";


    loadTabs();

});



// Tabs laden

function loadTabs(){


    chrome.storage.local.get(
        ["savedTabs"],

        (result)=>{


            const tabs = result.savedTabs || [];


allTabs = tabs;


displayTabs(tabs);


        }

    );


}



// Tabs anzeigen

function displayTabs(tabs){


    tabList.innerHTML = "";


    tabs.forEach(tab => {


        const card = document.createElement("div");


        card.className = "tab-card";


        card.innerHTML = `

    <strong>▶ ${tab.title}</strong>

    <br>

    <small>${tab.domain}</small>

`;


        card.addEventListener("click", () => {

    chrome.tabs.create({

        url: tab.url

    });

});


tabList.appendChild(card);


    });


}

searchInput.addEventListener("input", () => {


    const searchTerm = searchInput.value.toLowerCase();



    const filteredTabs = allTabs.filter(tab => {


        return (

            tab.title.toLowerCase().includes(searchTerm)

            ||

            tab.url.toLowerCase().includes(searchTerm)

            ||

            tab.domain.toLowerCase().includes(searchTerm)

            ||

            tab.category.toLowerCase().includes(searchTerm)

        );


    });



    displayTabs(filteredTabs);


});


// Beim Öffnen laden

loadTabs();