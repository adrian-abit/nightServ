let enabled = true;

document.getElementById("abit").addEventListener("click", () => {
  window.open(
    "https://nightserv.adrianbit.tech/",
    "_blank"
  );
});

document.getElementById("changeNight").addEventListener("click", () => {
  enabled = !enabled;
  chrome.storage.local.set({ "nightServ_enabled": enabled });
  chrome.storage.local.get("nightServ_enabled", res => console.log(res));
  changeText();
});

function changeText() {
  if (enabled) {
    document.getElementById("changeNight").innerHTML = "<span class='disable'>Nightmode Ausschalten</span>";
    document.getElementById("changeNight").style.border = "1.5px solid #F44336";
  } else {
    document.getElementById("changeNight").innerHTML = "<span class='enable'>Nightmode Anschalten</span>";
    document.getElementById("changeNight").style.border = "1.5px solid #4CAF50";
  }

}

chrome.storage.local.get(["nightServ_enabled"], res => {
  if (isEmpty(res))
    chrome.storage.local.set({ "nightServ_enabled": true });
  else if (!res["nightServ_enabled"])
    enabled = false;

  changeText();
})

function isEmpty(r) { for (var i in r) if (r.hasOwnProperty(i)) return !1; return JSON.stringify(r) === JSON.stringify({}) }