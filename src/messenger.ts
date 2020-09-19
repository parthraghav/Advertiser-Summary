import { Advertiser } from "@src/parsers/data";
import * as config from "@src/config";

type Source = "Background" | "Content" | "Popup";

export default class Messenger {
    name: Source;
    port: chrome.runtime.Port;

    constructor(name: Source) {
        this.name = name;
        this.port = chrome.runtime.connect({ name: config.PORT_NAME });
        this.port.onMessage.addListener(msg => this.handleResponse(msg));
    }

    handleResponse(msg: any) {
        console.log("content script received a message", msg);
    }

    async sendMessage(
        sender: Source,
        recipient: Source,
        msg: any,
        subject: string,
    ) {
        this.port.postMessage({
            data_packet: msg,
            from: sender,
            to: recipient,
            subject: subject,
        });
    }

    async sendNewAdvertiserData(advertiser: Advertiser) {
        const sender = this.name;
        const recipient = "Background";
        const subject = "NEW_AD_DATA";
        this.sendMessage(sender, recipient, advertiser, subject);
    }
}
