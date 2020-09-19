import { Advertiser } from "@src/parsers/data";

type Source = "Background" | "Content" | "Popup";

export default class Messenger {
    name: Source;
    constructor(name: Source) {
        this.name = name;
    }
    sendMessage(from: Source, to: Source, msg: any) {
        chrome.runtime.sendMessage({
            data_packet: msg,
            from: "conten",
        });
    }
    sendNewAdvertiserData(advertiser: Advertiser) {
        const sender = this.name;
        const recipient = "Background";
        this.sendMessage(sender, recipient, advertiser);
    }
}
