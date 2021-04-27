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
        readFile(chrome.runtime.getURL("themes/layouts.json"), (d) => {
          let data = JSON.parse(d);
          let style = {};
          console.log(r.nightservdesign);
          let layout = data.layouts[r.nightservdesign.layout];
          let theme =
            data.layouts[r.nightservdesign.layout].themes[
              r.nightservdesign.theme
            ];
          style["runAt"] = "document_start";
          style["file"] = "themes/" + layout.iID + "/" + layout.iID + ".css";
          chrome.tabs.insertCSS(tabId, style);
          style["file"] = "themes/" + layout.iID + "/" + theme.iID + ".css";
          chrome.tabs.insertCSS(tabId, style);
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

//stolen https://stackoverflow.com/a/14446538/10548599 changed tho
function readFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        callback(allText);
      }
    }
  };
  rawFile.send(null);
}
