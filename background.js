console.log("Ariad Service Worker gestartet");


// ======================================================
// KONSTANTEN
// ======================================================

const DEFAULT_RETENTION_DAYS = 3;

const CLEANUP_ALARM_NAME = "Ariad-cleanup";


// ======================================================
// ALTE TABS LÖSCHEN
// ======================================================

function cleanupOldTabs() {

    chrome.storage.local.get(
        [
            "savedTabs",
            "retentionDays"
        ],

        (result) => {

            const savedTabs =
                result.savedTabs || [];


            // Standardmäßig 3 Tage

            const retentionDays =
                Number(result.retentionDays) ||
                DEFAULT_RETENTION_DAYS;


            // Millisekunden pro Tag

            const retentionTime =
                retentionDays *
                24 *
                60 *
                60 *
                1000;


            const now =
                Date.now();


            const filteredTabs =
                savedTabs.filter(
                    (tab) => {


                        // Falls ein alter gespeicherter Tab
                        // kein createdAt besitzt,
                        // behalten wir ihn vorsichtshalber.

                        if (!tab.createdAt) {

                            return true;

                        }


                        const createdAt =
                            new Date(
                                tab.createdAt
                            ).getTime();


                        // Ungültiges Datum:
                        // Tab behalten

                        if (
                            Number.isNaN(
                                createdAt
                            )
                        ) {

                            return true;

                        }


                        const age =
                            now -
                            createdAt;


                        return (
                            age <
                            retentionTime
                        );

                    }
                );


            // Nur schreiben,
            // wenn tatsächlich Tabs entfernt wurden

            if (
                filteredTabs.length !==
                savedTabs.length
            ) {

                chrome.storage.local.set(
                    {
                        savedTabs:
                            filteredTabs
                    },

                    () => {

                        console.log(
                            savedTabs.length -
                            filteredTabs.length,
                            "alte Tabs wurden gelöscht."
                        );

                    }
                );

            }

        }
    );

}


// ======================================================
// CLEANUP ALARM EINRICHTEN
// ======================================================

function createCleanupAlarm() {

    chrome.alarms.create(
        CLEANUP_ALARM_NAME,

        {

            // Erster Check nach einer Minute

            delayInMinutes: 1,


            // Danach einmal täglich

            periodInMinutes:
                24 * 60

        }
    );

}


// ======================================================
// EXTENSION INSTALLIERT / AKTUALISIERT
// ======================================================

chrome.runtime.onInstalled.addListener(
    () => {


        // Standardwert setzen,
        // aber nur wenn noch keiner existiert

        chrome.storage.local.get(
            ["retentionDays"],

            (result) => {


                if (
                    result.retentionDays ===
                    undefined
                ) {

                    chrome.storage.local.set(
                        {
                            retentionDays:
                                DEFAULT_RETENTION_DAYS
                        }
                    );

                }

            }
        );


        createCleanupAlarm();


        cleanupOldTabs();

    }
);


// ======================================================
// BROWSER START
// ======================================================

chrome.runtime.onStartup.addListener(
    () => {

        createCleanupAlarm();

        cleanupOldTabs();

    }
);


// ======================================================
// ALARM
// ======================================================

chrome.alarms.onAlarm.addListener(
    (alarm) => {


        if (
            alarm.name ===
            CLEANUP_ALARM_NAME
        ) {

            cleanupOldTabs();

        }

    }
);


// ======================================================
// CLEANUP AUF ANFRAGE
// ======================================================

chrome.runtime.onMessage.addListener(
    (
        message,
        sender,
        sendResponse
    ) => {


        if (
            message.action ===
            "cleanupOldTabs"
        ) {

            cleanupOldTabs();


            sendResponse(
                {
                    success: true
                }
            );

        }

    }
);