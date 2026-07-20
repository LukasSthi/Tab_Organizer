# Chat Link
https://chatgpt.com/share/6a5d5941-5cbc-83eb-8b9a-b2d0b19ed958
# Project Title
Ariad – Intelligent Tab Manager

Ariad is a Chrome extension that helps users organize, categorize, and retrieve browser tabs efficiently.

# Features

Ariad provides an intuitive and efficient way to manage browser tabs. The extension allows users to save open tabs with a single click, automatically organize them into meaningful categories, quickly search through saved content, and mark important tabs as favorites. Additional features such as Recent Tabs, persistent local storage, and automatic cleanup help users keep their browsing sessions organized and easily accessible over time.

# Installation

Prerequisites

Before installing the extension, ensure that the following requirements are met:
- Google Chrome is installed on your computer.
- Git is installed and available via the command line.
- testAn active internet connection is available to clone the repository.

Installation Steps

1. Open the GitHub Repository
   Open the GitHub repository using the provided link in your web browser.

2. Clone the Repository
   Download the project to your local machine by cloning the repository with Git.
   git clone <repository-url>
   Alternatively, you can download the project as a ZIP file from GitHub and extract it to a folder of your choice.

3. Open Google Chrome
   Launch the Google Chrome browser.

4. Open the Extensions Page
   Type the following address into Chrome's address bar and press Enter:
   chrome://extensions
   This opens Chrome's Extension Management page.

5. Enable Developer Mode
   In the top-right corner of the Extensions page, enable Developer mode using the toggle switch.
   Enabling Developer Mode allows Chrome to load extensions directly from a local project folder.

6. Load the Extension
   Click the Load unpacked button that appears after enabling Developer Mode.

7. Select the Project Folder
   Navigate to the folder containing the cloned (or extracted) project and select the project's root directory.
   Chrome will load the extension automatically.

8. Verify the Installation
   After loading the project, Ariad should appear in the list of installed extensions without any error messages.
   If the extension is displayed successfully, the installation has been completed.

9. Pin the Extension (Recommended)
   For quicker access:
   Click the Extensions icon (puzzle piece) in the Chrome toolbar.
   Find Ariad in the list of installed extensions.
   Click the Pin icon to permanently display the Ariad icon in the toolbar.

   This allows the extension to be accessed with a single click.

Installation Complete

The Ariad Chrome Extension is now successfully installed and ready to use.

You can launch the extension at any time by clicking the Ariad icon in the Chrome toolbar.


# Usage


Once the extension has been installed, Ariad can be used to efficiently organize and manage browser tabs.

1. Save Your Tabs

    Open the tabs you would like to keep and click the Ariad extension icon in the Chrome toolbar.
    Press Save Tabs to store all currently open tabs with a single click. This prevents important websites from getting lost and allows them to be reopened at any time.

2. Browse Saved Tabs

    After saving, Ariad automatically categorizes your tabs based on their content.
    To keep the interface clean and easy to navigate, only the available categories are displayed initially. Selecting a category reveals all tabs belonging to that category.

3. Access Recent Tabs

    The Recent Tabs section displays the most recently saved or reopened tabs together with their timestamps.
    From this page, users can also navigate to the complete collection of saved tabs.

4. Mark Important Tabs

    Frequently used or important tabs can be marked as Starred.
    Starred tabs are displayed on the homepage under Important and are also available on the dedicated Starred page. Removing the star automatically removes the tab from both locations.

5. Search Your Tabs

    Ariad provides multiple search options to quickly locate saved websites.
    Users can search:
    within a specific category,
    within the Important tabs,
    or across all saved tabs.
    Searches support different criteria, including page titles and domain names (e.g., .com).

6. Automatic Cleanup

    To prevent an ever-growing collection of saved tabs, Ariad includes an automatic cleanup feature.
    Users can define after how many days saved tabs should be deleted automatically. Tabs can also be removed manually at any time.

7. Persistent Storage

    All saved tabs remain available even after closing and restarting Google Chrome.
    Whenever a new tab is saved, it is automatically added to the existing collection, assigned a timestamp, and can immediately be searched, starred, or reopened like any other saved tab.


# Project Structure

Ariad/
├── icons/
├── storages/
|── background.js
|── manifest.json
├── popup.css
├── popup.html
├── popup.js
└── README.md

# Contributors
Ben Hoppe, Marcel Kaun und Lukas Seitle 