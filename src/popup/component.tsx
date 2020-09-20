import React, { useState, useCallback, useEffect } from "react";
import Messenger from "@src/messenger";
import "./styles.scss";
import { CaptureSource } from "@src/parsers/data";
const axios = require("axios");

interface AdvertiserHistoryGridProps {
    view_history: number[];
}

const AdvertiserHistoryGrid = ({
    view_history,
}: AdvertiserHistoryGridProps) => {
    return (
        <div className="history-grid-wrapper">
            {view_history.map((val: number, index: number) => (
                <div
                    key={index}
                    className={"advertiser-history-brid-box fill-" + val}
                ></div>
            ))}
        </div>
    );
};

interface AdvertiserContainerProps {
    index: number;
    name: string;
    view_count: number;
    platform: CaptureSource;
    url: string;
    last_visited: number;
    view_history: number[];
}
const AdvertiserContainer = ({
    index,
    name,
    view_count,
    platform,
    url,
    last_visited,
    view_history,
}: AdvertiserContainerProps) => {
    const [logoUrl, setLogoUrl] = useState<any>(undefined);
    // fetch the image url
    useEffect(() => {
        (async function() {
            const urlParams = new URL(url);
            const logoUrlApi =
                "http://favicongrabber.com/api/grab/" + urlParams.host;
            let cachedLogoUrl = window.localStorage.getItem(logoUrlApi);
            if (cachedLogoUrl != null) {
                setLogoUrl(cachedLogoUrl);
                return;
            }
            const response = await axios.get(logoUrlApi);
            let responseUrl = response.data.icons[0].src;
            window.localStorage.setItem(logoUrlApi, responseUrl);
            setLogoUrl(responseUrl);
        })();
    }, []);
    return (
        <div
            className="hrow advertiser-row"
            onClick={() => chrome.tabs.create({ url })}
        >
            <div className="index-container">
                <span className="index-label">{index + 1}.</span>
            </div>
            <div className="logo-container">
                <div className="logo-wrapper">
                    {logoUrl && (
                        <img className="advertiser-logo" src={logoUrl} />
                    )}
                </div>
            </div>

            <div className="info-container">
                <span className="info-container-name-label">{name}</span>
                <span className="info-container-view-label">
                    Viewed {view_count} times
                </span>
                <div className="info-container-share-label">
                    <span>Shared by</span>
                    <img
                        className="social-logo"
                        src="https://facebookbrand.com/wp-content/uploads/2019/10/flogo_RGB_HEX-BRC-Site-250.png?w=250&h=250"
                    />
                </div>
            </div>
            <div className="history-grid-container">
                <AdvertiserHistoryGrid view_history={view_history} />
            </div>
        </div>
    );
};

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
        <div className="popup-container">
            <div className="page-container">
                <div className="hrow title-container">
                    <h4>Top Advertisers</h4>
                    <h6>targeting you right now</h6>
                </div>
                <div className="hrow data-container">
                    {advertiserData.map((entry: any, index: number) => (
                        <AdvertiserContainer
                            key={index}
                            index={index}
                            name={entry.name}
                            view_count={entry.view_count}
                            platform={entry.platform}
                            url={entry.url}
                            last_visited={entry.last_visited}
                            view_history={[0, 1, 2, 5, 3, 1, 4]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
