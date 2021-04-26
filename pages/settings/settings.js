let currentlayout;
let currenttheme;

let jsondata;

chrome.storage.local.get(["nightservdesign"], (r) => {
  readFile(chrome.runtime.getURL("themes/layouts.json"), (d) => {
    jsondata = JSON.parse(d);
    currentlayout = r.nightservdesign.layout;
    currenttheme = r.nightservdesign.theme;

    jsondata.layouts.forEach(layout => {
      let ediv = document.createElement("div");
      let lh = document.createElement("h1");
      lh.textContent = layout.displayname;
      ediv.appendChild(lh);
      document.getElementById("layouts").appendChild(ediv);
    });
  });
});

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
