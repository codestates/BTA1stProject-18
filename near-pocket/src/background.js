/*global chrome*/

// create alarm for watchdog and fresh on installed/updated, and start fetch data
chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled....");
});

// fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
chrome.runtime.onStartup.addListener(() => {
  console.log("onStartup....");
});
