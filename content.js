/* NightServ - Released under the GPL-3.0 license | Copyright 2020 - 2022 Adrian Bit - abit.dev */
// stolen function to check if the iserv css files are there
function isCSSthere() {
  let is = false;
  if (document.styleSheets.length == 0) is = null;
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href !== null) {
      if (document.styleSheets[i].href.includes("/css/iserv.")) {
        is = true;
        console.log("Du befindest dich zur Zeit auf einem IServ Schulserver!");
        break;
      }
    }
  }
  return is;
}

function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

//check if the website is cached as an iserv site
let url = extractDomain(location.href);

chrome.storage.local.get(
  [url, "nightServ_enabled", "active", "img"],
  (res) => {
    if (res[url] == null)
      docReady(() => {
        let rss = {};
        let ic = isCSSthere();
        if (ic != null) {
          rss[url] = ic;
          chrome.storage.local.set(rss);
          location.reload();
        }
      });

    if (res[url] && res["nightServ_enabled"]) {
      if (res.active == "picture") {
        let img = document.createElement("img");
        img.src = res.img;
        img.id = "nightservthemeimage";
        document.body.prepend(img);
      }

      //chage some things in the page
      docReady(() => {
        let msg = "%c Thanks for using nightServ!";
        let styles = [
          "font-size: 1.5em",
          "font-family: monospace",
          "background: transparent",
          "display: inline - block",
          "color: #fff",
          "padding: 8px 19px",
          "border: 2px dashed;"
        ].join(";")
        console.log(msg, styles);
        //replace iserv logo
        let uri = chrome.runtime.getURL("assets/nightserv.png");
        let el = document.getElementById("sidebar-nav-header");
        if (el != null) {
          let img =
            el.firstChild.nextElementSibling.firstChild.nextElementSibling
              .firstChild.nextElementSibling;
          img.src = uri;
          img.srcset = uri;
          img.alt = "nightServ";
          img.width = 120;
          img.removeAttribute("height");
        }

        //change school text
        el = document.getElementsByClassName("brand");
        if (el.length > 0) {
          for (let i = 0; i < el.length; i++) {
            let manifest = chrome.runtime.getManifest();
            el[i].textContent = manifest.name + " v" + manifest.version_name;
          }
        }

        //insert themes option
        el = document.getElementById("menu-wrapper");
        if (el != null && el != undefined) {
          let button = document.createElement("li");
          button.setAttribute("class", "nav-item menu-item-nightserv");

          let buttoncontent = document.createElement("a");
          let iur = chrome.runtime.getURL("pages/settings/settings.html");
          buttoncontent.setAttribute("href", iur);

          let buttonimg = document.createElement("img");
          buttonimg.setAttribute("class", "nav-svg-icon");
          buttonimg.setAttribute("src", chrome.runtime.getURL("assets/ns24.png"));
          buttoncontent.appendChild(buttonimg);

          let buttonlabel = document.createElement("span");
          buttonlabel.setAttribute("class", "item-label");
          buttonlabel.appendChild(document.createTextNode("nightServ Themes"));
          buttoncontent.appendChild(buttonlabel);
          button.appendChild(buttoncontent);
          el.insertBefore(button, el.firstChild);

          // insert tip
          let tip = document.createElement("div");
          tip.classList.add("panel", "panel-dashboard", "panel-default");
          let tipheader = document.createElement("div");
          tipheader.classList.add("panel-heading");
          let title = document.createElement("h2");
          title.classList.add("panel-title");
          title.innerText = "nightServ";
          tipheader.appendChild(title);
          tip.appendChild(tipheader);
          let tipbody = document.createElement("div");
          tipbody.classList.add("panel-body");
          tipbody.innerHTML = chrome.i18n.getMessage("tip");
          tip.appendChild(tipbody);
          document.getElementById("idesk-sidebar").prepend(tip);
        }
      });
    }
  }
);

function extractDomain(url) {
  return url.replace(
    /^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/,
    "$1"
  );
}

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
