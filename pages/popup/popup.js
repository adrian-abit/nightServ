let enabled = true;

document.getElementById("abit").addEventListener("click", () => {
  window.open("https://nightserv.abit.dev/", "_blank");
});

document.getElementById("changeNight").addEventListener("click", () => {
  enabled = !enabled;
  chrome.storage.local.set({ nightServ_enabled: enabled });
  changeText();
});

document.getElementById("settings").addEventListener("click", () => {
  window.close();
  let uri = chrome.runtime.getURL("pages/settings/settings.html");
  chrome.tabs.create({url : uri});
});

function changeText() {
  console.log(enabled);
  if (enabled) {
    document.getElementById("changeNight").innerHTML =
      "<span class='disable'>Nightmode Ausschalten</span>";
    document.getElementById("changeNight").style.border = "1.5px solid #F44336";
  } else {
    document.getElementById("changeNight").innerHTML =
      "<span class='enable'>Nightmode Anschalten</span>";
    document.getElementById("changeNight").style.border = "1.5px solid #4CAF50";
  }
}

chrome.storage.local.get(["nightServ_enabled", "verydark"], (res) => {
  console.log(res);
  if (isEmpty(res) || res["nightServ_enabled"] == null)
    chrome.storage.local.set({ nightServ_enabled: true });
  else enabled = res["nightServ_enabled"];

  changeText();
});

function isEmpty(r) {
  for (var i in r) if (r.hasOwnProperty(i)) return !1;
  return JSON.stringify(r) === JSON.stringify({});
}
