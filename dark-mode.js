// =============================================
// 47th Street — Dark Mode Toggle
// Runs in <head> before paint to prevent flash
// =============================================

(function () {
  "use strict";

  // Apply theme before paint
  var stored = localStorage.getItem("47st-theme");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = stored || (systemDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  // Listen for system preference changes (only if no stored preference)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem("47st-theme")) {
      var newTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  });

  // Insert toggle button once DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    var mastRight = document.querySelector(".mast-right");
    if (!mastRight) return;

    // Create toggle button
    var btn = document.createElement("button");
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.innerHTML =
      // Moon icon (visible in light mode)
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
        '<polygon points="12,2 13,5 12,4 11,5" fill="currentColor" stroke="none" opacity=".3"/>' +
      '</svg>' +
      // Sun icon (visible in dark mode)
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="4"/>' +
        '<line x1="12" y1="1" x2="12" y2="3"/>' +
        '<line x1="12" y1="21" x2="12" y2="23"/>' +
        '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>' +
        '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
        '<line x1="1" y1="12" x2="3" y2="12"/>' +
        '<line x1="21" y1="12" x2="23" y2="12"/>' +
        '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>' +
        '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' +
        // Small diamond accent at center
        '<polygon points="12,8 14,12 12,16 10,12" fill="currentColor" stroke="none" opacity=".15"/>' +
      '</svg>';

    // Insert before the search button
    var searchBtn = mastRight.querySelector(".search-btn");
    if (searchBtn) {
      mastRight.insertBefore(btn, searchBtn);
    } else {
      mastRight.insertBefore(btn, mastRight.firstChild);
    }

    // Toggle handler
    btn.addEventListener("click", function () {
      // Enable transition class briefly
      document.documentElement.classList.add("theme-transition");

      var current = document.documentElement.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("47st-theme", next);

      // Remove transition class after animation completes
      setTimeout(function () {
        document.documentElement.classList.remove("theme-transition");
      }, 450);
    });
  });
})();
