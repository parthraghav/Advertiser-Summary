import { browser } from "webextension-polyfill-ts";
import * as config from "@src/config";

// Listen for messages sent from other parts of the extension
browser.runtime.onConnect.addListener(port => {
    console.assert(port.name == config.PORT_NAME);
    port.onMessage.addListener(function(msg) {
        if (msg.subject == "NEW_AD_DATA" && msg.from == "Content") {
        }
        // if (msg.joke == "Knock knock")
        //     port.postMessage({ question: "Who's there?" });
        // else if (msg.answer == "Madame")
        //     port.postMessage({ question: "Madame who?" });
        // else if (msg.answer == "Madame... Bovary")
        //     port.postMessage({ question: "I don't get it." });
    });
});
