import { browser } from "webextension-polyfill-ts";
import * as config from "@src/config";
import Database from "@src/database";
import { Advertiser } from "@src/parsers/data";
import Messenger from "@src/messenger";

const db = new Database();

// Listen for messages sent from other parts of the extension
browser.runtime.onConnect.addListener(port => {
    console.log(port.name);
    console.assert(port.name == config.PORT_NAME);
    port.onMessage.addListener(function(msg) {
        const messenger = new Messenger("Background", port);
        if (msg.subject == "PUT_AD_DATA" && msg.from == "Content") {
            console.log("data write request received");
            const advertiser: Advertiser = msg.data_packet;
            db.add_new_advertiser(advertiser);
            db.add_new_advertiser_view(advertiser);
        }
        if (msg.subject == "GET_AD_DATA" && msg.from == "Popup") {
            console.log("data read request received");
            const advertiser_data = db.get_all_advertiser_data();
            const advertiser_views = db.get_all_advertiser_views();
            console.log(advertiser_data);
            console.log(advertiser_views);
            messenger.sendRetrievedDataResponse(
                advertiser_data,
                "advertiser_data",
            );
            messenger.sendRetrievedDataResponse(
                advertiser_views,
                "advertiser_views",
            );
        }
        // if (msg.joke == "Knock knock")
        //     port.postMessage({ question: "Who's there?" });
        // else if (msg.answer == "Madame")
        //     port.postMessage({ question: "Madame who?" });
        // else if (msg.answer == "Madame... Bovary")
        //     port.postMessage({ question: "I don't get it." });
    });
});
