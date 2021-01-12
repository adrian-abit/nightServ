chrome.runtime.onInstalled.addListener(function () {
  console.log("THANK YOU FOR CHOOSING NIGHTSERV MADE BY abit systems ^^");

  chrome.storage.local.get(["nightServ_enabled"], res => {
    if (isEmpty(res))
      chrome.storage.local.set({ "nightServ_enabled": true });
  });

  fetch(chrome.runtime.getURL("smaller.css"))
    .then(res => res.text())
    .then(data => {
      let su = {};
      su["nightCSS"] = minify(data);
      chrome.storage.local.set(su);
    });

});


chrome.runtime.onMessage.addListener((m, s, ret) => {
  if (m != "getData") ret({ "bad": "request" });
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


function isEmpty(r) { for (var i in r) if (r.hasOwnProperty(i)) return !1; return JSON.stringify(r) === JSON.stringify({}) }