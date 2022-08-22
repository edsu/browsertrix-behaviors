import { Behavior } from "../lib/behavior";
import { sleep, waitUnit } from "../lib/utils";

/**
 * This class will walk through the calendar entries on a Blogger website
 * to make sure that the AJAX calls that are triggered when opening up the month
 * are fetched as part of the crawl. Since these pages do not change during a
 * crawl the sessionStorage is used to remember that the months do not need
 * to be requested again. This prevents repetitive clicking of the calendar, and
 * subsequent HTTP requests, as part of the same crawl.
 */

export class BloggerBehavior extends Behavior
{
  constructor() {
    super();
    this.state = {
      calendar: 0 
    };
  }

  /**
   * Indicates whether this page is a blogspot page.
   */

  static isMatch() {
    // TODO: is there a better way to identify blogger sites at a custom domain?
    return window.location.href.match(/https:\/\/\w+\.blogspot.com\//);
  }

  async* [Symbol.asyncIterator]() {
    yield* this.getCalendar();
  }

  /**
   * Open up all the years and months on the archive calendar view.
   */

  async* getCalendar() {
    for (const year of document.querySelectorAll("#ArchiveList > div > ul.hierarchy > li")) {

      const [yearToggle, yearLink, yearText] = this.unpack(year);
      if (year.classList.contains("collapsed")) {
        yearToggle.click();
      }

      for (const month of year.querySelectorAll("ul.hierarchy > li.collapsed")) {
        const [monthToggle, monthLink, monthText] = this.unpack(month);

        // don't request the same content twice
        if (this.hasSeen(monthLink)) continue;
        this.setSeen(monthLink);

        const msg = `opening ${yearText} / ${monthText}`;
        yield this.getState(msg, "calendar");
        await monthToggle.click();
        await sleep(waitUnit * 2);
      }
    }
  }

  /**
   * Set the browser session to record that a calendar URL has been fetched.
   */

  setSeen(url) {
    window.sessionStorage.setItem(this.seenKey(url), "true");
  }


  /**
   * Returns true if a calendar URL has already been fetched, otherwise it
   * returns false.
   */

  hasSeen(url) {
    return window.sessionStorage.getItem(this.seenKey(url)) !== null;
  }

  /**
   * A key to use to store whether a given URL has been crawled already in this
   * browser session.
   */

  seenKey(url) {
    return `____browsertrix_behavior_blogger_${url}`;
  }
  
  /**
   * unpacks a hierarchy element into its toggle anchor, the link and its text
   */

  unpack(li) {
    return [li.children[0], li.children[1].href, li.children[1].text.trim()]
  }
}
