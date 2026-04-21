(async function startHydraUnlike() {
  console.log("Auto Unlike on Instagram Activity");

  const MAX_SELECT = 25;
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const fastDelay = () => sleep(Math.floor(Math.random() * (100 - 40) + 40));

  async function ensureSelectMode() {
    if (document.querySelector('div[data-testid="bulk_action_checkbox"]')) return true;

    let selectBtn = Array.from(document.querySelectorAll("div, span, button"))
      .find((el) => el.textContent.trim() === "Select" && el.offsetParent !== null);
    
    if (selectBtn) {
      console.log("Activating Select Mode...");
      selectBtn.click();
      await sleep(1000);
      return true;
    }
    return false;
  }

  async function runBatch() {
    let internalSelectedCount = 0;
    let failedScrollAttempts = 0;

    while (internalSelectedCount < MAX_SELECT) {
      await ensureSelectMode();

      let checkboxes = Array.from(document.querySelectorAll('div[data-testid="bulk_action_checkbox"]'))
        .filter(btn => !btn.classList.contains("script-clicked"));

      if (checkboxes.length === 0) {
        if (failedScrollAttempts > 5) {
          console.warn("No more items found after multiple scrolls. Ending.");
          return false;
        }
        console.log("Empty view. Scrolling...");
        window.scrollBy(0, 1000);
        await sleep(2000);
        failedScrollAttempts++;
        continue; 
      }

      failedScrollAttempts = 0;

      for (let box of checkboxes) {
        if (internalSelectedCount >= MAX_SELECT) break;
        
        box.click();
        box.classList.add("script-clicked");
        internalSelectedCount++;
        await fastDelay();
      }
    }

    console.log(`Batch full (${internalSelectedCount}). Processing...`);
    
    let redBar = Array.from(document.querySelectorAll("span, div"))
      .find(el => el.textContent.trim() === "Unlike" && 
        (getComputedStyle(el).color.includes("254, 67, 88") || getComputedStyle(el).color.includes("255, 48, 64")));

    if (!redBar) return false;
    redBar.click();
    await sleep(1500);

    let confirmBtn = Array.from(document.querySelectorAll('button._a9--'))
      .find(btn => btn.textContent.includes("Unlike"));

    if (confirmBtn) {
      confirmBtn.click();
      return true;
    }
    return false;
  }

  while (true) {
    try {
      const success = await runBatch();
      
      if (success) {
        console.log("⏳ Batch complete. Cooling down 10s...");
        await sleep(10000);
      } else {
        console.log("Search loop active... looking for more items.");
        await sleep(3000);
      }

      document.querySelectorAll(".script-clicked").forEach(el => el.classList.remove("script-clicked"));
      
    } catch (e) {
      console.error("Critical error:", e);
      await sleep(5000);
    }
  }
})();
