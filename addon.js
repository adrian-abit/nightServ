chrome.runtime.onInstalled.addListener(function () {
  console.log("THANK YOU FOR CHOOSING NIGHTSERV MADE BY abit systems ^^");

  chrome.storage.local.get(["nightServ_enabled"], res => {
    if (isEmpty(res))
      chrome.storage.local.set({ "nightServ_enabled": true });
  });

  chrome.storage.local.get(["verydark"], res => {
    if (isEmpty(res))
      chrome.storage.local.set({ "verydark": false });
  });

});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!tab.url.startsWith("http")) return;
  let url = extractDomain(tab.url);
  chrome.storage.local.get([url, "verydark", "nightServ_enabled"], r => {
    if (r[url] == null) return;
    if (r[url] && r["nightServ_enabled"]) {

      let style = {};
      style["file"] = "smaller.css";
      style["runAt"] = "document_start";

      if (r["verydark"]) {
        style["file"] = "darker.css";
        chrome.tabs.insertCSS(tabId, style);
      } else {
        style["file"] = "dark.css";
        chrome.tabs.insertCSS(tabId, style);
      }
      style["file"] = "smaller.css";
      chrome.tabs.insertCSS(tabId, style);

    }
  })

});


chrome.runtime.onMessage.addListener((m, s, ret) => {
  if (m != "getData") return;
  let url = s.origin;
  ret({ "id": s.tab.id, "url": url });
});

function minify(str) {
  return str
    .replace(/([^0-9a-zA-Z\.#])\s+/g, "$1")
    .replace(/\s([^0-9a-zA-Z\.#]+)/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\/\*.*?\*\//g, "");
}

function extractDomain(url) {
  return url.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "$1");
}

function isEmpty(r) { for (var i in r) if (r.hasOwnProperty(i)) return !1; return JSON.stringify(r) === JSON.stringify({}) }
