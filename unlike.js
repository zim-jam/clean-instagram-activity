(async function startInfiniteUnlike() {
  console.log("🚀 INFINITE Precision Auto-Unlike Script Started");

  const MAX_SELECT = 25;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const randomDelay = () =>
    sleep(Math.floor(Math.random() * (400 - 150 + 1) + 150));

  async function runBatch() {
    let internalSelectedCount = 0;

    console.log("▶️ Starting new batch...");

    let selectBtn = Array.from(document.querySelectorAll("div, span, button"))

      .find((el) => el.textContent.trim() === "Select");

    if (selectBtn) {
      console.log("✅ Clicking 'Select' button");

      selectBtn.click();

      await sleep(1500);
    }

    async function processUnlike() {
      console.log(
        `🛑 Reached ${internalSelectedCount} items. Attempting to unlike...`,
      );

      let allElements = Array.from(document.querySelectorAll("span, div"));

      let redUnlikeText = allElements.find(
        (el) =>
          el.textContent.trim() === "Unlike" &&
          el.style.color &&
          el.style.color.includes("254, 67, 88"),
      );

      if (!redUnlikeText) {
        console.error(
          "❌ ERROR: Could not find the red 'Unlike' text. Instagram may have rate-limited you.",
        );

        return false;
      }

      console.log("👉 Clicking the red 'Unlike' text...");

      redUnlikeText.click();

      await sleep(2000);

      let modalElements = Array.from(
        document.querySelectorAll('button, div[role="button"], span, div'),
      );

      let confirmBtn = modalElements.find(
        (el) =>
          el.textContent.trim() === "Unlike" &&
          el !== redUnlikeText &&
          el.closest('div[role="dialog"]'),
      );

      if (!confirmBtn) {
        confirmBtn = Array.from(
          document.querySelectorAll('button, div[role="button"]'),
        )

          .find((el) => el.textContent.trim() === "Unlike");
      }

      if (confirmBtn) {
        console.log("💔 Clicking the final 'Unlike' confirmation button!");

        confirmBtn.click();

        console.log("✅ Batch complete!");

        return true; // Success
      } else {
        console.error(
          "❌ ERROR: Could not find the final 'Unlike' confirmation button.",
        );

        return false;
      }
    }

    async function selectItems() {
      if (internalSelectedCount >= MAX_SELECT) {
        return await processUnlike();
      }

      const SELECTABLE_BTN_SELECTOR = 'div[data-testid="bulk_action_checkbox"]';

      let allCheckboxes = Array.from(
        document.querySelectorAll(SELECTABLE_BTN_SELECTOR),
      );

      let nextBtn = allCheckboxes.find(
        (btn) => !btn.classList.contains("script-clicked"),
      );

      if (!nextBtn) {
        console.log(
          `✅ No more posts found on screen. Selected ${internalSelectedCount} total.`,
        );

        if (internalSelectedCount > 0) {
          return await processUnlike();
        } else {
          console.log("No unliked items left to process.");

          return false;
        }
      }

      nextBtn.click();

      nextBtn.classList.add("script-clicked");

      internalSelectedCount++;

      console.log(`✅ Selected item ${internalSelectedCount}/${MAX_SELECT}`);

      await randomDelay();

      return await selectItems();
    }

    return await selectItems();
  }

  while (true) {
    let batchSuccess = await runBatch();

    if (!batchSuccess) {
      console.warn(
        "⚠️ Batch failed or list is empty. Terminating infinite loop to prevent page freeze.",
      );

      break;
    }

    console.log(
      "⏳ Waiting 15 seconds for Instagram to refresh the DOM before starting next batch...",
    );

    await sleep(15000);
  }

  console.log(
    "🏁 Infinite script has fully terminated. Refresh the page if you wish to start over.",
  );
})();
