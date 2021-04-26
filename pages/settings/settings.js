let currentlayout;
let currenttheme;

let jsondata;

let idmap = new Map();

createO(() => {
  let themes = document.getElementsByClassName("theme");
  for (let theme of themes) {
    if (theme.classList.contains("selected")) continue;
    theme.addEventListener("click", (event) => clickedTheme(event, theme));
  }
  fade(document.getElementById("overlay"));
});

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.1;
  }, 20);
}

function unfade(element, callback) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
      if (op >= 1){
          clearInterval(timer);
          callback();
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
  }, 20);
}

function clickedTheme(event, theme) {
  let iID = theme.id.replace("theme-", "");
  chrome.storage.local.set({nightservdesign : idmap.get(iID)});
  unfade(document.getElementById("overlay"), () =>  location.reload())
}

/** ugly shit but does what it's supposed to do */
function createO(callback) {
  chrome.storage.local.get(["nightservdesign"], (r) => {
    readFile(chrome.runtime.getURL("themes/layouts.json"), (d) => {
      jsondata = JSON.parse(d);
      currentlayout = r.nightservdesign.layout;
      currenttheme = r.nightservdesign.theme;

      jsondata.layouts.forEach((layout) => {
        let ediv = document.createElement("div");
        ediv.id = "layout-" + layout.iID;
        let lh = document.createElement("h1");
        lh.textContent = layout.displayname;
        ediv.appendChild(lh);
        let themesd = document.createElement("div");
        themesd.classList.add("themes");

        layout.themes.forEach((theme) => {
          let tdiv = document.createElement("div");
          tdiv.id = "theme-" + theme.iID;
          tdiv.classList.add("theme");
          if (layout.id == currentlayout && theme.id == currenttheme) {
            tdiv.classList.add("selected");
            let actext = document.createElement("h2");
            actext.id = "selectedtext";
            actext.textContent = "Ausgewählt";
            tdiv.appendChild(actext);
          }
          let name = document.createElement("h2");
          name.classList.add("themename");
          name.textContent = theme.name;
          tdiv.appendChild(name);
          idmap.set(theme.iID, { layout: layout.id, theme: theme.id });
          let themeimg = document.createElement("img");
          themeimg.src = chrome.runtime.getURL(
            "assets/themes/" + layout.iID + "/" + theme.img
          );
          themeimg.classList.add("themeimg");
          tdiv.appendChild(themeimg);
          themesd.appendChild(tdiv);
        });
        ediv.appendChild(themesd);
        document.getElementById("layouts").appendChild(ediv);
        callback();
      });
    });
  });
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
