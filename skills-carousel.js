/* =========================================================
   skills-carousel.js
   Animates .skill-card elements along a Bernoulli lemniscate
   (horizontal figure-eight) centered in .infinity-carousel.

   HOW IT WORKS:
   Parametric lemniscate of Bernoulli:
     x(t) = a * cos(t) / (1 + sin²(t))
     y(t) = a * sin(t) * cos(t) / (1 + sin²(t))

   Each card is assigned a phase offset so they space evenly
   around the full loop. JS updates CSS custom properties
   --tx and --ty each animation frame, which the CSS
   transform picks up instantly.
========================================================= */

(function () {
  const CARD_COUNT = 14;
  const PERIOD_MS  = 28000;   // one full loop = 28 s (matches original)
  const A_X        = 390;     // horizontal half-width  of the figure-eight (px)
  const A_Y        = 150;     // vertical   half-height of the figure-eight (px)

  let paused = false;
  let startTime = null;

  // Lemniscate parametric equations (t in radians, 0 → 2π = one loop)
  function lemniscate(t, ax, ay) {
    const denom = 1 + Math.pow(Math.sin(t), 2);
    return {
      x: ax * Math.cos(t) / denom,
      y: ay * Math.sin(t) * Math.cos(t) / denom,
    };
  }

  function init() {
    const carousel = document.querySelector(".infinity-carousel");
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll(".skill-card"));
    if (!cards.length) return;

    // Pause on hover
    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;

      if (!paused) {
        const elapsed = timestamp - startTime;

        cards.forEach((card, i) => {
          // Spread cards evenly: each card offset by (2π / N) * i
          const phaseOffset = (2 * Math.PI / CARD_COUNT) * i;
          // t advances from 0 → 2π over PERIOD_MS
          const t = ((elapsed / PERIOD_MS) * 2 * Math.PI + phaseOffset) % (2 * Math.PI);

          const { x, y } = lemniscate(t, A_X, A_Y);

          card.style.setProperty("--tx", x + "px");
          card.style.setProperty("--ty", y + "px");
        });
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();