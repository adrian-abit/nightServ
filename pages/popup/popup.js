let enabled = true;

document.getElementById("abit").addEventListener("click", () => {
  window.open("https://nightserv.cc/", "_blank");
});

document.getElementById("changeNight").addEventListener("click", () => {
  enabled = !enabled;
  browser.storage.local.set({ nightServ_enabled: enabled });
  changeText();
});

document.getElementById("settings").addEventListener("click", () => {
  console.log("send to settings");
  let uri = browser.runtime.getURL("pages/settings/settings.html");
  browser.tabs.create({url : uri});
  window.close();
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

browser.storage.local.get(["nightServ_enabled", "verydark"], (res) => {
  console.log(res);
  if (isEmpty(res) || res["nightServ_enabled"] == null)
    browser.storage.local.set({ nightServ_enabled: true });
  else enabled = res["nightServ_enabled"];

  changeText();
});

function isEmpty(r) {
  for (var i in r) if (r.hasOwnProperty(i)) return !1;
  return JSON.stringify(r) === JSON.stringify({});
}
