// ==UserScript==
// @name         Hide sponsored items
// @namespace    whatisthis
// @version      0.1
// @description  try to sanitize Facebook
// @author       Sy Hung Doan
// @match        https://www.facebook.com/*
// @match        https://facebook.com/*
// @grant        none
// ==/UserScript==

(function () {
  // src: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  };

  let lastCommitIndex = 0;
  let unitsContainer = document.querySelector("div[role='feed']");

  const callback = () => {
    unitsContainer = document.querySelector("div[role='feed']");
    if (!unitsContainer) {
      return;
    }

    const feedUnits = Array.from(
      document.querySelectorAll(
        `div[role='feed'] > div[data-pagelet^='FeedUnit_']:nth-child(n+${lastCommitIndex})`
      )
    );

    if (!feedUnits.length) {
      return;
    }

    Array(feedUnits.length)
      .fill(0)
      .forEach((_, i, obj) => {
        const unit = feedUnits[i];

        if (unit.querySelector("[aria-label='Sponsored']")) {
          unitsContainer.removeChild(unit);
          obj.splice(i, 1);
        } else {
          lastCommitIndex = i;
        }
      });
  };

  const callbackThrottled = throttle(callback, 1000);

  const observer = new MutationObserver(callbackThrottled);
  observer.observe(unitsContainer, { childList: true });
})();
