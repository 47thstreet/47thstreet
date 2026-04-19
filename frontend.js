// ---- Scroll-triggered fade-in with stagger support ----
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("vis");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".fi").forEach((el) => obs.observe(el));

// ---- Reading progress bar ----
const progressBar = document.getElementById("progressBar");
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + "%";
}

// ---- Back to top button ----
const btt = document.getElementById("btt");
function updateBtt() {
  if (window.scrollY > 600) {
    btt.classList.add("show");
  } else {
    btt.classList.remove("show");
  }
}
btt.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Combined scroll handler
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
});

// ---- Search toggle ----
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");

searchToggle.addEventListener("click", () => {
  searchBox.classList.toggle("open");
  if (searchBox.classList.contains("open")) {
    searchInput.focus();
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
});

// ---- Newsletter form ----
const nlForm = document.getElementById("nlForm");
nlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = nlForm.querySelector("button");
  const input = nlForm.querySelector("input");
  btn.innerHTML = "Subscribed &#9670;";
  btn.style.background = "#0a7c42";
  btn.style.borderColor = "#0a7c42";
  input.disabled = true;
  input.value = "";
  input.placeholder = "You're in!";
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
      // close mobile menu
      if (menuBtn.classList.contains("open")) {
        menuBtn.classList.remove("open");
        navInner.classList.remove("open");
      }
    }
  });
});
