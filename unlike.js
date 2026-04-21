(async function startTrulyInfiniteUnlike() {
  console.log("Auto-Unlike Script Started");

  const MAX_SELECT = 25;
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  
  const fastDelay = () => sleep(Math.floor(Math.random() * (120 - 50 + 1) + 50));

  async function runBatch() {
    let internalSelectedCount = 0;
    console.log("Starting new batch...");

    // 1. Ensure "Select" mode is active
    let selectBtn = Array.from(document.querySelectorAll("div, span, button"))
      .find((el) => el.textContent.trim() === "Select" && el.offsetParent !== null);
    
    if (selectBtn) {
      selectBtn.click();
      await sleep(800); 
    }

    const SELECTABLE_BTN_SELECTOR = 'div[data-testid="bulk_action_checkbox"]';
    
    while (internalSelectedCount < MAX_SELECT) {
      let nextBtn = Array.from(document.querySelectorAll(SELECTABLE_BTN_SELECTOR))
        .find(btn => !btn.classList.contains("script-clicked"));

      if (!nextBtn) {
        console.log("Scrolling for more content...");
        window.scrollBy(0, 800);
        await sleep(1500);
        continue;
      }

      nextBtn.click();
      nextBtn.classList.add("script-clicked");
      internalSelectedCount++;
      await fastDelay(); 
    }

    console.log(`Batch full (${internalSelectedCount}). Triggering Unlike...`);
    
    let bottomUnlikeBar = Array.from(document.querySelectorAll("span, div"))
      .find(el => 
        el.textContent.trim() === "Unlike" && 
        (getComputedStyle(el).color.includes("254, 67, 88") || getComputedStyle(el).color.includes("rgb(255, 48, 64)"))
      );

    if (!bottomUnlikeBar) {
      console.error("Could not find the red Unlike trigger.");
      return false;
    }

    bottomUnlikeBar.click();
    await sleep(1200);

    let confirmBtn = Array.from(document.querySelectorAll('button._a9--'))
      .find(btn => btn.textContent.includes("Unlike"));

    if (confirmBtn) {
      console.log("Clicking the final confirmation button!");
      confirmBtn.click();
      return true;
    } else {
      console.error("Confirmation modal button not found.");
      return false;
    }
  }

  while (true) {
    try {
      let success = await runBatch();
      
      if (!success) {
        console.warn("Batch sequence failed. Retrying in 5s...");
        await sleep(5000);
      } else {
        console.log("Batch successful. Waiting 10s for refresh...");
        await sleep(10000);
      }

      document.querySelectorAll(".script-clicked").forEach(el => el.classList.remove("script-clicked"));
      
    } catch (err) {
      console.error("Loop Error:", err);
      await sleep(5000);
    }
  }
})();
