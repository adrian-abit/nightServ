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
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


//check if the website is cached as an iserv site
let url = extractDomain(location.href);

chrome.storage.local.get([url, "nightServ_enabled"], res => {

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
        //chage some things in the page
        docReady(() => {

            //replace iserv logo
            let uri = chrome.runtime.getURL("assets/nightservfull.svg");
            let el = document.getElementById("sidebar-nav-header");
            if (el != null) {
                let img = el.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling;
                img.src = uri;
                img.srcset = uri;
                img.width = 150;
            }

            //change school text
            el = document.getElementsByClassName("brand");
            if (el.length > 0) {
                for (let i = 0; i < el.length; i++) {
                    let manifest = chrome.runtime.getManifest();
                    el[i].textContent = manifest.name + " v" + manifest.version_name;
                }
            }

            //insert feedback option
            el = document.getElementById("menu-wrapper");
            if (el != null && el != undefined) {
                let button = document.createElement("li");
                button.setAttribute("class", "nav-item nav-module menu-item-nightserv");

                let buttoncontent = document.createElement("a");
                let iur = chrome.runtime.getURL("pages/settings/settings.html");
                buttoncontent.setAttribute("href", iur);

                let buttonimg = document.createElement("img");
                buttonimg.setAttribute("class", "nav-svg-icon");
                buttonimg.setAttribute("src", chrome.runtime.getURL("assets/N.svg"));
                buttoncontent.appendChild(buttonimg);

                let buttonlabel = document.createElement("span");
                buttonlabel.setAttribute("class", "item-label");
                buttonlabel.appendChild(document.createTextNode("nightServ Themes"))
                buttoncontent.appendChild(buttonlabel);

                button.appendChild(buttoncontent);
                el.insertBefore(button, el.firstChild)
            }
        });

    }
})


function extractDomain(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "$1");
}

