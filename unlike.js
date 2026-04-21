(async function startTrulyInfiniteUnlike() {
  console.log("Auto-Unlike Script Started");

  const MAX_SELECT = 25;
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const fastDelay = () => sleep(Math.floor(Math.random() * (150 - 80) + 80)); 

  async function runBatch() {
    let internalSelectedCount = 0;
    console.log("▶️ Starting new batch...");

    let selectBtn = Array.from(document.querySelectorAll("div, span, button"))
      .find((el) => el.textContent.trim() === "Select");
    
    if (selectBtn) {
      selectBtn.click();
      await sleep(1000);
    }

    async function selectItems() {
      const SELECTABLE_BTN_SELECTOR = 'div[data-testid="bulk_action_checkbox"]';
      
      while (internalSelectedCount < MAX_SELECT) {
        let allCheckboxes = Array.from(document.querySelectorAll(SELECTABLE_BTN_SELECTOR));
        let nextBtn = allCheckboxes.find(btn => !btn.classList.contains("script-clicked"));

        if (!nextBtn) {
          console.log("Scrolling for more items...");
          window.scrollBy(0, 500);
          await sleep(2000);
          
          allCheckboxes = Array.from(document.querySelectorAll(SELECTABLE_BTN_SELECTOR));
          nextBtn = allCheckboxes.find(btn => !btn.classList.contains("script-clicked"));
          
          if (!nextBtn) {
            console.log("No more items found even after scroll.");
            break; 
          }
        }

        nextBtn.click();
        nextBtn.classList.add("script-clicked");
        internalSelectedCount++;
        await fastDelay(); 
      }

      if (internalSelectedCount > 0) {
        return await processUnlike();
      }
      return false;
    }

    async function processUnlike() {
      let allElements = Array.from(document.querySelectorAll("span, div"));
      let redUnlikeText = allElements.find(
        (el) => el.textContent.trim() === "Unlike" && 
        getComputedStyle(el).color.includes("254, 67, 88")
      );

      if (!redUnlikeText) {
        console.error("❌ Could not find red 'Unlike' text. Trying manual scroll.");
        return false;
      }

      redUnlikeText.click();
      await sleep(1500);

      let confirmBtn = Array.from(document.querySelectorAll('button, div[role="button"]'))
        .find(el => el.textContent.trim() === "Unlike" && el.offsetParent !== null);

      if (confirmBtn) {
        confirmBtn.click();
        console.log("✅ Batch unlike confirmed.");
        return true;
      }
      return false;
    }

    return await selectItems();
  }

  while (true) {
    try {
      let success = await runBatch();
      if (!success) {
        console.log("Empty batch or error. Waiting longer before retry...");
        await sleep(10000);
      }
      
      console.log("⏳ Cooling down for 12s to avoid rate limits...");
      await sleep(12000); 
      
      document.querySelectorAll(".script-clicked").forEach(el => el.classList.remove("script-clicked"));
      
    } catch (err) {
      console.error("Critical error in loop:", err);
      await sleep(5000);
    }
  }
})();
