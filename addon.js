/* NightServ - Released under the GPL-3.0 license | Copyright 2020 - 2022 Adrian Bit - abit.dev */

chrome.runtime.onInstalled.addListener((reason) => {
  console.log("THANK YOU FOR CHOOSING NIGHTSERV MADE BY abit systems ^^");
  chrome.storage.local.get(["nightServ_enabled"], (res) => {
    if (isEmpty(res)) chrome.storage.local.set({ nightServ_enabled: true });
  });
  console.time("Refresh Data");
  reloadThemesAndOptions().then((res) => {console.timeEnd("Refresh Data")
  console.log(res);
});
});

async function reloadThemesAndOptions() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("active", (res) => {
      fetch("https://content.nightserv.cc/nightserv/2/themes.json")
        .then((data) => data.json())
        .then(json => {
          chrome.storage.local.set({ "json": json });
          if(json[res.active] == null) res.active = "dark";
          fetch("https://content.nightserv.cc/nightserv/2/" + json[res.active].category + "/template.css")
            .then(res => res.text())
            .then((template) => {
              fetch("https://content.nightserv.cc/nightserv/2/" + json[res.active].category + "/" + res.active + "/theme.css")
                .then(res => res.text())
                .then((data) => { chrome.storage.local.set({ "theme": template + data }); });
            });
        });
    });
  });
}

chrome.storage.local.set({ "iserv.de": false });

//TODO: Change listener to inject right layout and theme
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (!tab.url.startsWith("http")) return;
  let url = extractDomain(tab.url);
  if (changeInfo.status != "loading") return;
  console.time("inject");
  chrome.storage.local.get(
    [url, "nightServ_enabled"],
    (r) => {
      if (r[url] == null) return;
      if (r[url] && r["nightServ_enabled"]) {
        chrome.storage.local.get(["theme"], (data) => {
          let style = {
            target: { "tabId": tabId },
            css: data.theme
          }
          console.log(data);
          chrome.scripting.insertCSS(style);
          console.timeEnd("inject");
        })
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
