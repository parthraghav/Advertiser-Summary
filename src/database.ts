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
            "view_count",
        ]);
        this.db.createTable("advertiser_views", [
            "uuid",
            "advertiser_uuid",
            "advertiser_name",
            "timestamp",
            "platform",
        ]);
        this.db.commit();
    }
    get_all_advertiser_data() {
        return this.db.queryAll("advertiser_data", {
            sort: [["view_count", "DESC"]],
        });
    }
    get_all_advertiser_views() {
        return this.db.queryAll("advertiser_views", {
            sort: [["timestamp", "DESC"]],
        });
    }
    show_all_table_data() {
        const advertiserData = this.db.queryAll("advertiser_data", {});
        const advertiserViewsData = this.db.queryAll("advertiser_views", {});
        console.log("advertiser_data");
        console.log(advertiserData);
        console.log("advertiser_views");
        console.log(advertiserViewsData);
    }
    add_new_advertiser_view(advertiser: Advertiser) {
        const uuid = uuidv4();
        const advertiser_uuid = sha1(advertiser.name);
        const advertiser_name = advertiser.name;
        const timestamp = advertiser.captureTime;
        const platform = advertiser.captureSource;
        this.db.insert("advertiser_views", {
            uuid,
            advertiser_uuid,
            advertiser_name,
            timestamp,
            platform,
        });
        this.db.commit();
        // this.show_all_table_data();
    }
    add_new_advertiser(advertiser: Advertiser) {
        const uuid = sha1(advertiser.name);
        const name = advertiser.name;
        const platform = advertiser.captureSource;
        const last_visited = advertiser.captureTime;
        const url = advertiser.link;

        const response = this.db.queryAll("advertiser_data", {
            query: { uuid },
        });
        if (response.length > 0) {
            // perform an update
            this.db.update("advertiser_data", { uuid }, entry => {
                entry.name = name;
                entry.platform = platform;
                entry.view_count = entry.view_count + 1;
                entry.last_visited = last_visited;
                entry.url = url;
                return entry;
            });
        } else {
            // perform an insert
            this.db.insert("advertiser_data", {
                uuid,
                name,
                platform,
                view_count: 1,
                last_visited,
                url,
            });
        }

        this.db.commit();
        // this.show_all_table_data();
    }
}
