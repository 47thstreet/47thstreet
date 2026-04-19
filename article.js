// =============================================
// 47th Street — Article Page Interactions
// Reading progress, share buttons, scroll animations
// Following Emil Kowalski's design engineering principles
// =============================================

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Reading time calculator ----
(function calcReadTime() {
  const content = document.getElementById("articleContent");
  const readTimeEl = document.getElementById("readTime");
  if (!content || !readTimeEl) return;

  const text = content.innerText || content.textContent;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 250);
  readTimeEl.textContent = minutes + " min read";
})();

// ---- Reading progress bar ----
const progressBar = document.getElementById("progressBar");
const articleBody = document.getElementById("articleBody");

function updateProgress() {
  if (!articleBody) return;
  const rect = articleBody.getBoundingClientRect();
  const articleTop = rect.top + window.scrollY;
  const articleHeight = rect.height;
  const scrolled = window.scrollY - articleTop;
  const progress = Math.max(0, Math.min(1, scrolled / (articleHeight - window.innerHeight)));
  progressBar.style.width = (progress * 100) + "%";
}

// ---- Back to top button ----
const btt = document.getElementById("btt");
function updateBtt() {
  btt.classList.toggle("show", window.scrollY > 600);
}
btt.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---- Share rail visibility ----
const shareRail = document.getElementById("shareRail");
function updateShareRail() {
  if (!shareRail || !articleBody) return;
  const rect = articleBody.getBoundingClientRect();
  const inRange = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.3;
  shareRail.classList.toggle("show", inRange);
}

// ---- Combined scroll handler (rAF throttled) ----
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      updateBtt();
      updateShareRail();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ---- Scroll-triggered fade-in ----
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll(".fi").forEach((el) => obs.observe(el));

// ---- Share functionality ----
const articleTitle = document.title;
const articleUrl = window.location.href;

function copyLink() {
  navigator.clipboard.writeText(articleUrl).then(() => {
    const toast = document.getElementById("copyToast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);

    // Update button state briefly
    document.querySelectorAll("#shareCopy, #shareCopyInline").forEach((btn) => {
      btn.classList.add("copied");
      const label = btn.querySelector("span");
      const origText = label ? label.textContent : "";
      if (label) label.textContent = "Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        if (label) label.textContent = origText;
      }, 2000);
    });
  });
}

function shareTwitter() {
  const text = encodeURIComponent(articleTitle);
  const url = encodeURIComponent(articleUrl);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    "_blank",
    "width=550,height=420"
  );
}

function shareEmail() {
  const subject = encodeURIComponent(articleTitle);
  const body = encodeURIComponent(`I thought you'd enjoy this article from 47th Street:\n\n${articleTitle}\n${articleUrl}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Desktop rail buttons
document.getElementById("shareCopy")?.addEventListener("click", copyLink);
document.getElementById("shareTwitter")?.addEventListener("click", shareTwitter);
document.getElementById("shareEmail")?.addEventListener("click", shareEmail);

// Mobile inline buttons
document.getElementById("shareCopyInline")?.addEventListener("click", copyLink);
document.getElementById("shareTwitterInline")?.addEventListener("click", shareTwitter);
document.getElementById("shareEmailInline")?.addEventListener("click", shareEmail);

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
}

// ---- Mobile menu toggle ----
const menuBtn = document.getElementById("menuBtn");
const navInner = document.getElementById("navInner");

if (menuBtn && navInner) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    navInner.classList.toggle("open");

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
}

// ---- Sparkle animation on hero ----
const heroImg = document.querySelector(".article-hero-inner");
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
