// 🚩 SETTINGS
const INTERVALO_SEGUNDOS = 60;

// 🔍 Finds the correct iframe
const computeIframe = document.querySelector("iframe#sandbox-maui-preact-container");
const computeWindow = computeIframe?.contentWindow;
if (!computeWindow) throw new Error("❌ Compute iframe not found!");

// 🪪 Keeps the session alive by opening an Oracle popup
const sessionWindow = window.open(
  "https://cloud.oracle.com",
  "_blank",
  "height=400,width=400,popup=true"
);

// 🔘 Function to check if the button is visible and enabled
const isButtonClickable = (btn) => {
  if (!btn) return false;
  const style = window.getComputedStyle(btn);
  return style.display !== "none" && style.visibility !== "hidden" && !btn.disabled;
};

// 🔘 Finds the "Create" button
const getCreateButton = () => {
  return [...computeWindow.document.querySelectorAll('button')]
    .find(btn => btn.textContent.trim() === 'Create');
};

// 📊 Creates the status bar
const statusBar = document.createElement("div");
statusBar.style.cssText = `
  z-index: 9999999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: #00688c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-family: sans-serif;
`;
document.body.prepend(statusBar);

// ⏳ Countdown and click function with control to avoid clicking every time
let countdown = INTERVALO_SEGUNDOS;
let lastClickTimestamp = 0;
const CLICK_COOLDOWN_MS = INTERVALO_SEGUNDOS * 1000; // 60s

const intervalo = setInterval(() => {
  const now = Date.now();
  const createBtn = getCreateButton();

  if (!createBtn) {
    statusBar.textContent = "❌ 'Create' button not found!";
    console.error("❌ 'Create' button not found!");
    return;
  }

  if (!isButtonClickable(createBtn)) {
    statusBar.textContent = "⚠️ 'Create' button is currently not clickable.";
    console.log("'Create' button is present but not clickable.");
    return;
  }

  if (now - lastClickTimestamp < CLICK_COOLDOWN_MS) {
    statusBar.textContent = `⏳ Waiting for cooldown... Next click in ${(Math.ceil((CLICK_COOLDOWN_MS - (now - lastClickTimestamp))/1000))}s`;
    return;
  }

  if (countdown <= 0) {
    createBtn.style.border = "3px solid red"; // Highlights the button
    createBtn.click();
    lastClickTimestamp = now;
    // Does not reload popup to avoid overload
    // sessionWindow.location.reload(); 

    console.log(`✅ 'Create' clicked at ${new Date().toLocaleTimeString()}`);
    statusBar.textContent = `✅ 'Create' clicked! Next in ${INTERVALO_SEGUNDOS}s`;
    countdown = INTERVALO_SEGUNDOS;
  } else {
    statusBar.textContent = `⏳ Clicking 'Create' in ${countdown}s...`;
    countdown--;
  }
}, 1000);
