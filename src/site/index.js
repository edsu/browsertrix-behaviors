import { FacebookTimelineBehavior } from "./facebook";
import { InstagramPostsBehavior } from "./instagram";
import { TelegramBehavior } from "./telegram";
import { TwitterTimelineBehavior } from "./twitter";
import { BloggerBehavior } from "./blogger";

const siteBehaviors = [
  InstagramPostsBehavior,
  TwitterTimelineBehavior,
  FacebookTimelineBehavior,
  TelegramBehavior,
  BloggerBehavior
];

export default siteBehaviors;
