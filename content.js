// stolen function to check if the iserv css files are there
function isCSSthere() {
  let is = false;
  if (document.styleSheets.length == 0) is = null;
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href !== null) {
      if (document.styleSheets[i].href.includes("/css/iserv.")) {
        is = true;
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

browser.storage.local.get(
  [url, "nightServ_enabled", "nightservdesign"],
  (res) => {
    console.log(res);
    if (res[url] == null)
      docReady(() => {
        let rss = {};
        let ic = isCSSthere();
        if (ic != null) {
          rss[url] = ic;
          browser.storage.local.set(rss);
          location.reload();
        }
      });

    if (res[url] && res["nightServ_enabled"]) {
      readFile(browser.runtime.getURL("themes/layouts.json"), (d) => {
        let data = JSON.parse(d);
        if (
          data.layouts[res.nightservdesign.layout].themes[
            res.nightservdesign.theme
          ].iTheme
        ) {
          let img = document.createElement("img");
          img.src =
            data.layouts[res.nightservdesign.layout].themes[
              res.nightservdesign.theme
            ].iTimg;
          img.id = "nightservthemeimage";
          document.body.prepend(img);
        }
      });

      //chage some things in the page
      docReady(() => {
        console.log("danke, dass du nightServ verwendest!")
        //replace iserv logo
        let uri = browser.runtime.getURL("assets/nightserv.png");
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
            let manifest = browser.runtime.getManifest();
            el[i].textContent = manifest.name + " v" + manifest.version_name;
          }
        }

        //insert themes option
        el = document.getElementById("menu-wrapper");
        if (el != null && el != undefined) {
          let button = document.createElement("li");
          button.setAttribute("class", "nav-item menu-item-nightserv");

          let buttoncontent = document.createElement("a");
          let iur = browser.runtime.getURL("pages/settings/settings.html");
          buttoncontent.setAttribute("href", iur);

          let buttonimg = document.createElement("img");
          buttonimg.setAttribute("class", "nav-svg-icon");
          buttonimg.setAttribute("src", browser.runtime.getURL("assets/ns24.png"));
          buttoncontent.appendChild(buttonimg);

          let buttonlabel = document.createElement("span");
          buttonlabel.setAttribute("class", "item-label");
          buttonlabel.appendChild(document.createTextNode("nightServ Themes"));
          buttoncontent.appendChild(buttonlabel);
          let badge = document.createElement("span");
          badge.textContent = "NEU!";
          badge.id = "nsbadgenew";
          buttoncontent.appendChild(badge);
          button.appendChild(buttoncontent);
          el.insertBefore(button, el.firstChild);
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
