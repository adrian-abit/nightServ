chrome.runtime.onInstalled.addListener(function () {
  console.log("loaded u cunt");
  chrome.storage.sync.get(["nightServ_enabled"], res => {
    if(isEmpty(res)){
        chrome.storage.sync.set({"nightServ_enabled": true});
    }
  });
});

var style;

fetch(chrome.runtime.getURL("smaller.css"))
  .then(res => res.text())
  .then(data => style = minify(data))
  .then(() => console.log(style));
console.log(chrome.runtime.getURL("smaller.css"));

chrome.runtime.onMessage.addListener((m, s, ret) => {
  console.log(m);
  if (m == "getData") {
    let url = s.origin;

    ret({"id" : s.tab.id, "url" : url});
  } else if (m == "inject"){
    console.log("inject");
    ret({"style" : style})
  }
});

function minify(str) {
 return str
    .replace(/([^0-9a-zA-Z\.#])\s+/g, "$1")
    .replace(/\s([^0-9a-zA-Z\.#]+)/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\/\*.*?\*\//g, "");
}


function isEmpty(r) { for (var i in r) if (r.hasOwnProperty(i)) return !1; return JSON.stringify(r) === JSON.stringify({}) }


//chrome.tabs.insertCSS(s.tab.id, {file: "smaller.css"});