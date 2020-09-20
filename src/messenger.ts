import { Advertiser } from "@src/parsers/data";
import * as config from "@src/config";

type Source = "Background" | "Content" | "Popup";

export default class Messenger {
    name: Source;
    port: any;
    private _responseHandler: Function = (msg: any) => {
        console.error("Unitialised");
    };

    constructor(name: Source, _port?: any) {
        this.name = name;
        this.port = _port ?? chrome.runtime.connect({ name: config.PORT_NAME });
        this.port.onMessage.addListener((msg: any) =>
            this._responseHandler(msg),
        );
    }

    connect(port: chrome.runtime.Port): Messenger {
        return new Messenger(this.name, port);
    }

    onRetrievedDataResponse(fn: Function) {
        this._responseHandler = fn;
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
        const subject = "PUT_AD_DATA";
        this.sendMessage(sender, recipient, advertiser, subject);
    }

    async sendRetrievedDataResponse(data: any, packet_name: string) {
        const sender = this.name;
        const recipient = "Popup";
        const subject = "GET_AD_DATA";
        this.sendMessage(
            sender,
            recipient,
            {
                name: packet_name,
                contents: data,
            },
            subject,
        );
    }

    async sendRetrieveDataRequest() {
        const sender = this.name;
        const recipient = "Background";
        const subject = "GET_AD_DATA";
        this.sendMessage(sender, recipient, {}, subject);
    }
}
