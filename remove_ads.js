// ==UserScript==
// @name         Hide sponsored items
// @namespace    Jayden
// @version      0.1
// @description  try to sanitize Facebook
// @author       Jayden
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
  // TODO: remove only when the number of items increases

  const pattern =
    "//*[@aria-label='Sponsored']//ancestor::div[contains(@data-pagelet,'FeedUnit_')]";
  const itemsContainer = document.querySelector("div[role='feed']");

  const config = { childList: true };

  const callback = () => {
    const items = document.evaluate(
      pattern,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    const length = items.snapshotLength;
    if (length) {
      console.log(`Found ${length} ads`);
    }

    for (let i = 0; i < length; i++) {
      const item = items.snapshotItem(i);
      itemsContainer.removeChild(item);
      // console.log('Remove ', i);
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(itemsContainer, config);
})();
