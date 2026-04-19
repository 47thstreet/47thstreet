// Version switcher — persists to localStorage
(function() {
  const saved = localStorage.getItem("47st-version") || "v1";
  if (saved !== "v1") document.documentElement.setAttribute("data-version", saved);

  document.addEventListener("DOMContentLoaded", () => {
    const switcher = document.getElementById("versionSelect");
    if (!switcher) return;
    switcher.value = saved;
    switcher.addEventListener("change", (e) => {
      const v = e.target.value;
      if (v === "v1") {
        document.documentElement.removeAttribute("data-version");
      } else {
        document.documentElement.setAttribute("data-version", v);
      }
      localStorage.setItem("47st-version", v);
    });
  });
})();
