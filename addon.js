chrome.runtime.onInstalled.addListener(() => {
  console.log("THANK YOU FOR CHOOSING NIGHTSERV MADE BY abit systems ^^");

  chrome.storage.local.get(["nightServ_enabled"], (res) => {
    if (isEmpty(res)) chrome.storage.local.set({ nightServ_enabled: true });
  });

});

chrome.storage.local.set({ "iserv.de": false });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!tab.url.startsWith("http")) return;
  let url = extractDomain(tab.url);
  chrome.storage.local.get([url, "nightServ_enabled"], (r) => {
    if (r[url] == null) return;
    if (r[url] && r["nightServ_enabled"]) {
      let style = {};
      style["runAt"] = "document_start";
      style["file"] = "smaller.css";

      chrome.tabs.insertCSS(tabId, style);
    }
  });
});


function extractDomain(url) {
  return url.replace(
    /^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/,
    "$1"
  );
}

function isEmpty(r) {
  for (var i in r) if (r.hasOwnProperty(i)) return !1;
  return JSON.stringify(r) === JSON.stringify({});
}
