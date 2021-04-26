chrome.runtime.onInstalled.addListener(reason => {
  console.log("THANK YOU FOR CHOOSING NIGHTSERV MADE BY abit systems ^^");
  if (reason.reason == "install") {
    
    chrome.storage.local.get(["nightServ_enabled"], (res) => {
      if (isEmpty(res)) chrome.storage.local.set({ nightServ_enabled: true });
    });

    chrome.storage.local.set({ nightservdesign: { layout: 0, theme: 0 } });
  }
});

chrome.storage.local.set({ "iserv.de": false });

//TODO: Change listener to inject right layout and theme
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!tab.url.startsWith("http")) return;
  let url = extractDomain(tab.url);
  chrome.storage.local.get([url, "nightServ_enabled"], (r) => {
    if (r[url] == null) return;
    if (r[url] && r["nightServ_enabled"]) {
      let style = {};
      style["runAt"] = "document_start";
      style["file"] = "style.css";

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
