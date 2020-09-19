import localStorageDB from "localStorageDB";
import { Advertiser } from "@src/parsers/data";
const { v4: uuidv4 } = require("uuid");
var sha1 = require("sha1");

export default class Database {
    db: localStorageDB;
    constructor() {
        // Initialise. If the database doesn't exist, it is created
        this.db = new localStorageDB("advertiser_summary", "localStorage");
        if (this.db.isNew()) {
            this.initialize();
        }
    }
    initialize() {
        // create the "advertiser_data" table
        this.db.createTable("advertiser_data", [
            "uuid",
            "name",
            "platform",
            "url",
            "last_visited",
        ]);
        this.db.createTable("advertiser_views", [
            "uuid",
            "advertiser_uuid",
            "timestamp",
            "platform",
        ]);
        this.db.commit();
    }
    add_new_advertiser_view(advertiser: Advertiser) {
        const uuid = uuidv4();
        const advertiser_uuid = sha1(advertiser.name);
        const timestamp = advertiser.captureTime;
        const platform = advertiser.captureSource;
        this.db.insert("advertiser_views", {
            uuid,
            advertiser_uuid,
            timestamp,
            platform,
        });
        this.db.commit();
    }
    add_new_advertiser(advertiser: Advertiser) {
        const uuid = sha1(advertiser.name);
        const name = advertiser.name;
        const platform = advertiser.captureSource;
        const last_visited = advertiser.captureTime;
        const url = advertiser.link;

        this.db.insertOrUpdate("advertiser_data", { uuid }, { ID: uuid });
        this.db.commit();
    }
}
