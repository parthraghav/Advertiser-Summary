// After looking at facebook network logs in the element inspector,
// I realised all the newsfeed data, along with other profile info,
// came from Facebook's /graphqL api endpoint. To find pin in a
// haystack, I looked at the json structure, and it was trivial to

import { getParam } from "@src/utils";
import { Advertiser, NullAdvertiser } from "./data";

function match_against_all_data_patterns(response: any) {
    let advertiserRedirectLink;
    try {
        advertiserRedirectLink =
            advertiserRedirectLink ??
            response.data.node.comet_sections.content.story.attachments[0]
                .style_type_renderer.attachment.subattachments[0]
                .call_to_action_renderer.action_link.url;
    } catch {}
    try {
        advertiserRedirectLink =
            advertiserRedirectLink ??
            response.data.node.comet_sections.content.story.attachments[0]
                .comet_footer_renderer.attachment.action_links[0].url;
    } catch {}
    try {
        advertiserRedirectLink =
            advertiserRedirectLink ??
            response.data.node.comet_sections.content.story.attachments[0]
                .style_type_renderer.attachment.cta_screen_renderer.action_link
                .url;
    } catch {}

    try {
        advertiserRedirectLink =
            advertiserRedirectLink ??
            response.data.node.comet_sections.content.story.attachments[0]
                .style_type_renderer.attachment.story_attachment_link_renderer
                .action_links[0].url;
    } catch {}

    try {
        advertiserRedirectLink =
            advertiserRedirectLink ??
            response.data.node.comet_sections.content.story.attachments[0]
                .style_type_renderer.attachment.story_attachment_link_renderer
                .attachment.action_links[0].url;
    } catch {}

    try {
        advertiserRedirectLink =
            advertiserRedirectLink ??
            response.data.node.comet_sections.content.story.attachments[0]
                .style_type_renderer.attachment.story_attachment_link_renderer
                .attachment.web_link.url;
    } catch {}
    return advertiserRedirectLink;
}

// figure out the rules to match a data block for a sponsored post.
export default class FacebookParser {
    static parse(response: any) {
        if (
            response.label ==
                "CometNewsFeed_viewer$stream$CometNewsFeed_viewer_news_feed" &&
            response.data.category == "SPONSORED"
        ) {
            try {
                let actor =
                    response.data.node.comet_sections.context_layout.story
                        .comet_sections.title.story.actors[0];
                // find the advertiser info
                let advertiserName, advertiserRedirectLink;
                advertiserName = actor.name;

                advertiserRedirectLink = match_against_all_data_patterns(
                    response,
                );

                let advertiserLink;
                if (advertiserRedirectLink) {
                    advertiserLink = getParam(advertiserRedirectLink, "u");
                } else {
                    advertiserLink = actor.url;
                }

                // return a response advertiser object
                return new Advertiser({
                    name: advertiserName,
                    link: advertiserLink,
                    captureSource: "Facebook",
                    captureTime: new Date().getTime(),
                });
            } catch (e) {
                console.error(e);
                return new NullAdvertiser(
                    "Error occured in processing an advertiser",
                );
            }
        } else {
            return new NullAdvertiser("Not a sponsored post");
        }
    }
}
