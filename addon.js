chrome.runtime.onInstalled.addListener((reason) => {
  console.log("THANK YOU FOR CHOOSING NIGHTSERV MADE BY abit systems ^^");
  if (reason.reason == "install") {
    chrome.storage.local.get(["nightServ_enabled"], (res) => {
      if (isEmpty(res)) chrome.storage.local.set({ nightServ_enabled: true });
    });

    chrome.storage.local.set({ nightservdesign: { layout: 0, theme: 0 } });
  }
  if (reason.reason == "update") {
    chrome.storage.local.get(["nightservdesign"], (r) => {
      if (isEmpty(r))
        chrome.storage.local.set({ nightservdesign: { layout: 0, theme: 0 } });
      else{
        readFile("themes/layouts.json", (data) => {
          console.log(data);
          if(data.layouts[r.nightservdesign.layout].themes[r.nightservdesign.theme] == null)
          chrome.storage.local.set({ nightservdesign: { layout: 0, theme: 0 } });
        });
        }
    });
  }
});

chrome.storage.local.set({ "iserv.de": false });

//TODO: Change listener to inject right layout and theme
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!tab.url.startsWith("http")) return;
  let url = extractDomain(tab.url);
  if (changeInfo.status != "loading") return;
  chrome.storage.local.get(
    [url, "nightServ_enabled", "nightservdesign"],
    (r) => {
      if (r[url] == null) return;
      if (r[url] && r["nightServ_enabled"]) {
        readFile("themes/layouts.json", (data) => {
          let style = {};
          let layout = data.layouts[r.nightservdesign.layout];
          let theme =
            data.layouts[r.nightservdesign.layout].themes[
              r.nightservdesign.theme
            ];
          style["target"] = {"tabId" : tabId};
          //style["runAt"] = "document_start";
          let files = ["themes/" + layout.iID + "/" + layout.iID + ".css", "themes/" + layout.iID + "/" + theme.iTF + ".css"]
          style["files"] = files;
          console.log(style);
          chrome.scripting.insertCSS(style);
        });
      }
    }
  );
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

function readFile(file, callback) {
  let url = chrome.runtime.getURL(file);

  fetch(url)
      .then((response) => response.json())
      .then(data => callback(data));
}
