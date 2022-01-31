/* NightServ - Released under the GPL-3.0 license | Copyright 2020 - 2022 Adrian Bit - abit.dev */

reloadThemesAndOptions().then(() => {
  populate().then(() => {
    let themes = document.getElementsByClassName("theme");
    for (let theme of themes) {
      if (theme.classList.contains("selected")) continue;
      theme.addEventListener("click", (event) => clickedTheme(event, theme));
    }
    document.getElementById("imgselect").addEventListener("click", () => {
      let input = document.getElementById("imgurl");
      if(input.value == "" || !(input.value.endsWith(".png") || input.value.endsWith(".jpeg") || input.value.endsWith(".jpg") || input.value.endsWith(".gif"))){
        alert("Bitte gebe eine richtige URL an.\nStelle sicher, dass die URL mit .png, .jpg, .jpeg oder .gif endet.\n");
        return;
      } else {
        chrome.storage.local.set({"active": "picture", "img" : input.value});
        reloadThemesAndOptions().then(location.reload());
      }
    });
    fade(document.getElementById("overlay"));
  });
});

async function reloadThemesAndOptions() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("active", (res) => {
      fetch("https://content.nightserv.cc/nightserv/2/themes.json")
        .then((data) => data.json())
        .then(json => {
          chrome.storage.local.set({ "json": json });
          if (json[res.active] == null) res.active = "dark";
          fetch("https://content.nightserv.cc/nightserv/2/" + json[res.active].category + "/template.css")
            .then(res => res.text())
            .then((template) => {
              fetch("https://content.nightserv.cc/nightserv/2/" + json[res.active].category + "/" + res.active + "/theme.css")
                .then(res => res.text())
                .then((data) => { chrome.storage.local.set({ "theme": template + data }); resolve() });
            });
        });
    });
  });
}

async function populate() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["json", "active"], (data) => {
      let json = data.json;
      let active = data.active;

      let container = document.getElementById("themes");
      Object.entries(json).forEach(([tname, value]) => {
        if (tname == "picture") return;
        let div = document.createElement("div");
        div.classList.add("theme");
        div.id = tname

        let name = document.createElement("h2");
        name.classList.add("themename");
        name.textContent = value.display;
        div.appendChild(name);

        themeimg = document.createElement("img");
        themeimg.src = "https://content.nightserv.cc/nightserv/2/" + value.category + "/" + tname + "/img.png";
        themeimg.classList.add("themeimg");
        div.appendChild(themeimg);

        if (tname == active) {
          div.classList.add("selected");
          let actext = document.createElement("h2");
          actext.id = "selectedtext";
          actext.textContent = chrome.i18n.getMessage("selectedtheme");
          div.appendChild(actext);
        }
        container.appendChild(div);
      });

      chrome.storage.local.get(["img", "active"], (data) => {
        if(data.img != null){
          let input = document.getElementById("imgurl");
          let button = document.getElementById("imgselect");

          document.getElementById("imgprev").src = data.img;
          input.value = data.img;
          if(data.active == "picture") {
            button.innerText = "Bild Ändern";
            document.getElementById("ownimage").classList.add("selected");
          }
        }
      }); 


      resolve();
    });
  });
}

function fade(element) {
  var op = 1; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = "none";
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op -= op * 0.1;
  }, 30);
}

function unfade(element, callback) {
  var op = 0.1; // initial opacity
  element.style.display = "block";
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
      callback();
    }
    element.style.opacity = op;
    element.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += op * 0.1;
  }, 10);
}

function clickedTheme(event, theme) {
  unfade(document.getElementById("overlay"), () => {
    chrome.storage.local.set({ active: theme.id });
    reloadThemesAndOptions().then(location.reload());
  });
}
