import React, { useState, useCallback } from "react";
import Messenger from "@src/messenger";
import "./styles.scss";

// // // //

export const Popup = () => {
    const messenger = new Messenger("Popup");
    const [advertiserData, setAdvertiserData] = useState<any>([]);
    const [advertiserViews, setAdvertiserViews] = useState<any>([]);

    const handleRetrievedDataResponse = useCallback(
        (msg: any) => {
            if (msg.subject == "GET_AD_DATA" && msg.from == "Background") {
                const table_name = msg.data_packet.name;
                const table_contents = msg.data_packet.contents;
                console.log(
                    msg,
                    table_name == "advertiser_data",
                    table_name == "advertiser_views",
                );
                if (table_name == "advertiser_data") {
                    setAdvertiserData(table_contents);
                } else if (table_name == "advertiser_views") {
                    setAdvertiserViews(table_contents);
                }
            }
        },
        [advertiserData, advertiserViews],
    );

    React.useEffect(() => {
        messenger.onRetrievedDataResponse(handleRetrievedDataResponse);
        messenger.sendRetrieveDataRequest();
    }, []);
    console.log(advertiserData, advertiserViews);
    // Renders the component tree
    return (
        <div className="">
            <h1>Advertiser Data</h1>
            {advertiserData.map((entry: any, index: number) => (
                <p key={index}>{entry.name}</p>
            ))}
            <hr />
            <h1>Advertiser Views</h1>
            {advertiserViews.map((entry: any, index: number) => (
                <p key={index}>{entry.advertiser_name}</p>
            ))}
        </div>
    );
};
