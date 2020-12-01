function isCSSthere() {
    let is = false;
    for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href !== null) {
            var s = document.styleSheets[i].href;
            console.log(s);
            if (s.indexOf("iserv.bccd0cb4") !== -1) {
                blogCssFound = true;
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

hhdoc = function () {
    docReady(function () {
        let uri = chrome.runtime.getURL("whitetrans.png");
        let el = document.getElementById("sidebar-nav-header");
        if (el != null) {
            let img = el.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling;
            img.src = uri;
            img.srcset = uri;
            img.width = 100;
            img.height = 47.6;
        }

        el = document.getElementsByClassName("brand");
        console.log(el);
        if (el.length >= 1) {
            for (let i = 0; i < el.length; i++) {
                el[i].textContent = "nightServ v. DEVa0.1.0";
            }
        }
    });
}


chrome.runtime.sendMessage("getData", r => {

    let url = r.url;

    chrome.storage.sync.get([url, "nightServ_enabled"], res => {
        let inject = false;
        if (isEmpty(res))
            docReady(() => {
                let rss = {};
                rss[url] = isCSSthere();
                chrome.storage.sync.set(rss);
                inject = rss[url];
            });
        else if (res[url]) inject = true;

        if (!res["nightServ_enabled"]) inject = false;

        if (inject)
            chrome.runtime.sendMessage("inject", css => {
                addStyle(css.style);
                hhdoc();
            });

    })
});

function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

function isEmpty(r) { for (var i in r) if (r.hasOwnProperty(i)) return !1; return JSON.stringify(r) === JSON.stringify({}) }