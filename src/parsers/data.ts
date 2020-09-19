type CaptureSource = "Facebook" | "Unknown";

interface AdvertiserInfoModel {
    name: string;
    link: string;
    captureSource: CaptureSource;
    captureTime: number;
}
export class Advertiser {
    name: string;
    link: string;
    captureSource: CaptureSource;
    captureTime: number;
    constructor({
        name,
        link,
        captureSource,
        captureTime,
    }: AdvertiserInfoModel) {
        this.name = name;
        this.link = link;
        this.captureSource = captureSource;
        this.captureTime = captureTime;
    }
}

export class NullAdvertiser {}
