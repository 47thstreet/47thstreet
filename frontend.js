// =============================================
// 47th Street — Frontend Interactions
// Animated per Emil Kowalski's design engineering principles:
// - Custom easing curves (cubic-bezier, not generic ease)
// - Staggered reveals (30-80ms between items)
// - clip-path image reveals via WAAPI
// - Active press feedback on interactive elements
// - prefers-reduced-motion support
// - Performance: transform + opacity only
// =============================================

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Scroll-triggered fade-in ----
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");

        // WAAPI clip-path reveal for images inside this element
        if (!prefersReduced) {
          const imgs = e.target.querySelectorAll(".feat-img, .photo-img");
          imgs.forEach((img) => {
            img.animate(
              [
                { clipPath: "inset(0 0 8% 0)" },
                { clipPath: "inset(0 0 0% 0)" },
              ],
              {
                duration: 700,
                fill: "forwards",
                easing: "cubic-bezier(0.77, 0, 0.175, 1)",
              }
            );
          });
        }

        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll(".fi").forEach((el) => obs.observe(el));

// ---- Reading progress bar ----
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight > 0) {
    progressBar.style.width = ((scrollTop / docHeight) * 100) + "%";
  }
}

// ---- Back to top button ----
const btt = document.getElementById("btt");
function updateBtt() {
  btt.classList.toggle("show", window.scrollY > 600);
}
btt.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Combined scroll handler (rAF throttled)
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      updateBtt();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ---- Search toggle ----
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

searchToggle.addEventListener("click", () => {
  const opening = !searchBox.classList.contains("open");
  searchBox.classList.toggle("open");
  if (opening) {
    searchInput.focus();
    // WAAPI reveal
    if (!prefersReduced) {
      searchBox.animate(
        [
          { opacity: 0, transform: "translateY(-4px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" }
      );
    }
  }
});
searchClose.addEventListener("click", () => {
  searchBox.classList.remove("open");
  searchInput.value = "";
});

// ---- Mobile menu toggle ----
const menuBtn = document.getElementById("menuBtn");
const navInner = document.getElementById("navInner");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  navInner.classList.toggle("open");

  // Stagger nav links on open
  if (navInner.classList.contains("open") && !prefersReduced) {
    navInner.querySelectorAll("a").forEach((a, i) => {
      a.animate(
        [
          { opacity: 0, transform: "translateY(-6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 250,
          delay: i * 40,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "forwards",
        }
      );
    });
  }
});

// ---- Newsletter form with feedback ----
const nlForm = document.getElementById("nlForm");
nlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = nlForm.querySelector("button");
  const input = nlForm.querySelector("input");

  // Scale press feedback
  if (!prefersReduced) {
    btn.animate(
      [
        { transform: "scale(0.95)" },
        { transform: "scale(1.02)" },
        { transform: "scale(1)" },
      ],
      { duration: 300, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  }

  nlForm.classList.add("submitted");
  btn.innerHTML = "Subscribed &#9670;";
  btn.style.background = "#0a7c42";
  btn.style.borderColor = "#0a7c42";
  input.disabled = true;
  input.value = "";
  input.placeholder = "You\u2019re in!";
});

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href === "#") return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth", block: "start" });
      if (menuBtn.classList.contains("open")) {
        menuBtn.classList.remove("open");
        navInner.classList.remove("open");
      }
    }
  });
});

// ---- Hero image sparkle on mouse move (decorative only) ----
const heroImg = document.querySelector(".hero-img");
if (heroImg && !prefersReduced) {
  const sparkle = heroImg.querySelector(".sparkle-anim");
  if (sparkle) {
    heroImg.addEventListener("mousemove", (e) => {
      const rect = heroImg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      sparkle.style.transform = `translate(${x}px, ${y}px)`;
    });
    heroImg.addEventListener("mouseleave", () => {
      sparkle.style.transform = "";
      sparkle.style.transition = "transform 400ms cubic-bezier(0.23, 1, 0.32, 1)";
      setTimeout(() => { sparkle.style.transition = ""; }, 400);
    });
  }
}

// ---- Pulse counter animation ----
// Animate numbers counting up when they enter the viewport
const pulseObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const vals = e.target.querySelectorAll(".pulse-val");
        vals.forEach((val, i) => {
          if (prefersReduced) return;
          const text = val.textContent.trim();
          const numMatch = text.match(/[\d,]+/);
          if (!numMatch) {
            val.classList.add("counting");
            return;
          }
          const target = parseInt(numMatch[0].replace(/,/g, ""), 10);
          const prefix = text.slice(0, text.indexOf(numMatch[0]));
          const suffix = text.slice(text.indexOf(numMatch[0]) + numMatch[0].length);
          const duration = 800;
          const start = performance.now();
          const easeOut = (t) => 1 - Math.pow(1 - t, 3);

          setTimeout(() => {
            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const current = Math.round(easeOut(progress) * target);
              val.textContent = prefix + current.toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            val.classList.add("counting");
          }, i * 60);
        });
        pulseObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 }
);
const pulseRow = document.querySelector(".pulse-row");
if (pulseRow) pulseObs.observe(pulseRow);

// ---- Hero parallax on scroll ----
if (!prefersReduced && heroImg) {
  const heroInner = heroImg.querySelector(".hero-img-inner");
  if (heroInner) {
    window.addEventListener("scroll", () => {
      const rect = heroImg.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom > 0 && rect.top < viewH) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        const shift = (progress - 0.5) * 20;
        heroInner.style.transform = `translateY(${shift}px) scale(1.03)`;
      }
    }, { passive: true });
  }
}
