import { Advertiser } from "@src/parsers/data";

type Source = "Background" | "Content" | "Popup";

export default class Messenger {
    name: Source;
    constructor(name: Source) {
        this.name = name;
    }
    async sendMessage(sender: Source, recipient: Source, msg: any) {
        chrome.runtime.sendMessage({
            data_packet: msg,
            from: sender,
            to: recipient,
        });
    }
    async sendNewAdvertiserData(advertiser: Advertiser) {
        const sender = this.name;
        const recipient = "Background";
        this.sendMessage(sender, recipient, advertiser);
    }
}
