// =============================================
// 47th Street — Frontend Interactions
// Emil Kowalski design engineering principles applied
// =============================================

// ---- Reactive reduced-motion support ----
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let prefersReduced = reducedMotionQuery.matches;
reducedMotionQuery.addEventListener("change", (e) => { prefersReduced = e.matches; });

// ---- Scroll-triggered fade-in ----
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        if (!prefersReduced) {
          e.target.querySelectorAll(".feat-img, .photo-img").forEach((img) => {
            img.animate(
              [{ clipPath: "inset(0 0 8% 0)" }, { clipPath: "inset(0 0 0% 0)" }],
              { duration: 700, fill: "forwards", easing: "cubic-bezier(0.77, 0, 0.175, 1)" }
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
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (h > 0) progressBar.style.width = ((window.scrollY / h) * 100) + "%";
}

// ---- Back to top button ----
const btt = document.getElementById("btt");
function updateBtt() { if (btt) btt.classList.toggle("show", window.scrollY > 600); }
if (btt) btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---- Hero parallax (in rAF handler) ----
const heroImg = document.querySelector(".hero-img");
const heroInner = heroImg ? heroImg.querySelector(".hero-img-inner") : null;
function updateParallax() {
  if (prefersReduced || !heroImg || !heroInner) return;
  const rect = heroImg.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.bottom > 0 && rect.top < vh) {
    const p = (vh - rect.top) / (vh + rect.height);
    heroInner.style.transform = "translateY(" + ((p - 0.5) * 20) + "px) scale(1.03)";
  }
}

// Combined rAF-throttled scroll handler
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateProgress(); updateBtt(); updateParallax(); ticking = false; });
    ticking = true;
  }
}, { passive: true });

// ---- Search toggle ----
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

if (searchToggle && searchBox) {
  searchToggle.addEventListener("click", () => {
    const opening = !searchBox.classList.contains("open");
    searchBox.classList.toggle("open");
    if (opening) {
      searchInput.focus();
      if (!prefersReduced) {
        searchBox.animate(
          [{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
      }
    }
  });
  searchClose.addEventListener("click", () => {
    searchBox.classList.remove("open");
    searchInput.value = "";
    searchToggle.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchBox.classList.contains("open")) {
      searchBox.classList.remove("open");
      searchInput.value = "";
      searchToggle.focus();
    }
  });
}

// ---- Mobile drawer ----
const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const drawerClose = document.getElementById("drawerClose");
const drawerBackdrop = document.getElementById("drawerBackdrop");

function openDrawer() {
  document.body.classList.add("drawer-open");
  menuBtn.classList.add("open");
  menuBtn.setAttribute("aria-expanded", "true");
  drawerClose.focus();
  if (!prefersReduced) {
    drawer.querySelectorAll(".drawer-links a").forEach((a, i) => {
      a.animate(
        [{ opacity: 0, transform: "translateX(16px)" }, { opacity: 1, transform: "translateX(0)" }],
        { duration: 250, delay: 80 + i * 40, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" }
      );
    });
  }
}

function closeDrawer() {
  document.body.classList.remove("drawer-open");
  menuBtn.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.focus();
}

if (menuBtn && drawer && drawerBackdrop) {
  menuBtn.addEventListener("click", () => {
    if (document.body.classList.contains("drawer-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerClose.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);

  // Escape key closes drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("drawer-open")) {
      closeDrawer();
    }
  });

  // Focus trap inside drawer when open
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !document.body.classList.contains("drawer-open")) return;
    const focusable = drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Close drawer when a link inside it is clicked
  drawer.querySelectorAll(".drawer-links a, .drawer-subscribe").forEach((a) => {
    a.addEventListener("click", () => {
      closeDrawer();
    });
  });
}

// ---- Ticker pause/play ----
const tickerPause = document.getElementById("tickerPause");
const tickerTrack = document.getElementById("tickerTrack");
if (tickerPause && tickerTrack) {
  let paused = false;
  tickerPause.addEventListener("click", () => {
    paused = !paused;
    tickerTrack.style.animationPlayState = paused ? "paused" : "running";
    tickerPause.setAttribute("aria-label", paused ? "Resume ticker" : "Pause ticker");
    tickerPause.innerHTML = paused ? "&#9654;" : "&#10074;&#10074;";
  });
}

// ---- Newsletter form ----
const nlForm = document.getElementById("nlForm");
if (nlForm) {
  nlForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = nlForm.querySelector("button");
    const input = nlForm.querySelector("input");
    if (!prefersReduced) {
      btn.animate(
        [{ transform: "scale(0.95)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
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
}

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href === "#" || href === "#0") { e.preventDefault(); return; }
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth", block: "start" });
      if (document.body.classList.contains("drawer-open")) {
        closeDrawer();
      }
    }
  });
});

// ---- Hero sparkle mouse interaction ----
if (heroImg && !prefersReduced) {
  const sparkle = heroImg.querySelector(".sparkle-anim");
  if (sparkle) {
    sparkle.style.transition = "transform 400ms cubic-bezier(0.23, 1, 0.32, 1)";
    heroImg.addEventListener("mousemove", (e) => {
      const rect = heroImg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      sparkle.style.transform = "translate(" + x + "px, " + y + "px)";
    });
    heroImg.addEventListener("mouseleave", () => { sparkle.style.transform = ""; });
  }
}

// ---- Pulse counter animation ----
const pulseObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll(".pulse-val").forEach((val, i) => {
          if (prefersReduced) return;
          const text = val.textContent.trim();
          const numMatch = text.match(/[\d,]+/);
          if (!numMatch) { val.classList.add("counting"); return; }
          const target = parseInt(numMatch[0].replace(/,/g, ""), 10);
          const prefix = text.slice(0, text.indexOf(numMatch[0]));
          const suffix = text.slice(text.indexOf(numMatch[0]) + numMatch[0].length);
          const easeOut = (t) => 1 - Math.pow(1 - t, 3);
          setTimeout(() => {
            const start = performance.now();
            function tick(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / 800, 1);
              val.textContent = prefix + Math.round(easeOut(progress) * target).toLocaleString() + suffix;
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
