// stolen function to check if the iserv css files are there
function isCSSthere() {
    let is = false;
    console.log(document.styleSheets.length + " + " + document.styleSheets.length == 0)
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
chrome.runtime.sendMessage("getData", r => {

    let url = r.url;

    chrome.storage.local.get([url, "nightServ_enabled"], res => {
        let inject = false;

        if (!res["nightServ_enabled"]) inject = false;
        else if (res[url] == null)
            docReady(() => {
                let rss = {};
                let ic = isCSSthere();
                if (ic != null) {
                    rss[url] = ic;
                    chrome.storage.local.set(rss);
                    inject = rss[url];
                    location.reload();
                }
            });
        else if (res[url]) inject = true;


        if (inject) {
            //inject css into page
            chrome.storage.local.get("nightCSS", res => {
                const style = document.createElement('style');
                style.textContent = res["nightCSS"];
                document.head.append(style);
            })

            //chage some things in the page
            docReady(() => {

                //replace iserv logo
                let uri = chrome.runtime.getURL("nightservfull.svg");
                let el = document.getElementById("sidebar-nav-header");
                if (el != null) {
                    let img = el.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling;
                    img.src = uri;
                    img.srcset = uri;
                    img.width = 125;
                }

                //change school text
                el = document.getElementsByClassName("brand");
                if (el.length > 0) {
                    for (let i = 0; i < el.length; i++) {
                        let manifest = chrome.runtime.getManifest();
                        el[i].textContent = manifest.name + " v" + manifest.version_name;
                    }
                }

            });

        }
    })
});

