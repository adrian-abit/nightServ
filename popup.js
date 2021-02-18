let enabled = true;
let verydark = false;

document.getElementById("abit").addEventListener("click", () => {
  window.open(
    "https://nightserv.abit.dev/",
    "_blank"
  );
});

document.getElementById("changeNight").addEventListener("click", () => {
  enabled = !enabled;
  chrome.storage.local.set({ "nightServ_enabled": enabled });
  changeText();
});

document.getElementById("changeVD").addEventListener("click", () => {
  if (!verydark) {
    verydark = true;
    chrome.storage.local.set({ "verydark": verydark });
    changeText();
  }
});

document.getElementById("changeD").addEventListener("click", () => {
  if (verydark) {
    verydark = false;
    chrome.storage.local.set({ "verydark": verydark });
    changeText();
  }
});

function changeText() {
  console.log(enabled);
  if (enabled) {
    document.getElementById("changeNight").innerHTML = "<span class='disable'>Nightmode Ausschalten</span>";
    document.getElementById("changeNight").style.border = "1.5px solid #F44336";
  } else {
    document.getElementById("changeNight").innerHTML = "<span class='enable'>Nightmode Anschalten</span>";
    document.getElementById("changeNight").style.border = "1.5px solid #4CAF50";
  }

  if (verydark) {
    document.getElementById("changeVD").style.border = "1.5px solid #8AB4F8";
    document.getElementById("changeD").style.border = "1.5px solid #5F6368";
  } else {
    document.getElementById("changeD").style.border = "1.5px solid #8AB4F8";
    document.getElementById("changeVD").style.border = "1.5px solid #5F6368";
  }

}


chrome.storage.local.get(["nightServ_enabled", "verydark"], res => {
  console.log(res);
  if (isEmpty(res) || res["nightServ_enabled"] == null)
    chrome.storage.local.set({ "nightServ_enabled": true });
  else
    enabled = res["nightServ_enabled"];

  if (isEmpty(res) || res["verydark"] == null)
    chrome.storage.local.set({ "verydark": false });
  else
    verydark = res["verydark"];

  changeText();
})

function isEmpty(r) { for (var i in r) if (r.hasOwnProperty(i)) return !1; return JSON.stringify(r) === JSON.stringify({}) }