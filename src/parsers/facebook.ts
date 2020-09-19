// After looking at facebook network logs in the element inspector,
// I realised all the newsfeed data, along with other profile info,
// came from Facebook's /graphqL api endpoint. To find pin in a
// haystack, I looked at the json structure, and it was trivial to

import { getParam } from "@src/utils";
import { Advertiser, NullAdvertiser } from "./data";

// figure out the rules to match a data block for a sponsored post.
export default class FacebookParser {
    static parse(response: any) {
        if (
            response.label ==
                "CometNewsFeed_viewer$stream$CometNewsFeed_viewer_news_feed" &&
            response.data.category == "SPONSORED"
        ) {
            // find the advertiser info
            let advertiserName =
                response.data.node.comet_sections.context_layout.story
                    .comet_sections.title.story.actors[0].name;
            let advertiserRedirectLink =
                response.data.node.comet_sections.content.story.attachments[0]
                    .style_type_renderer.attachment.subattachments[0]
                    .call_to_action_renderer.action_link.url;
            let advertiserLink = getParam(advertiserRedirectLink, "u");
            // return a response advertiser object
            return new Advertiser({
                name: advertiserName,
                link: advertiserLink,
                captureSource: "Facebook",
                captureTime: new Date().getTime(),
            });
        } else {
            return new NullAdvertiser();
        }
    }
}
