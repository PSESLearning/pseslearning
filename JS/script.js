const topBtn = document.getElementById("topBtn")
const themeButton = document.querySelector(".toggleTheme");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
    if (!navLinks || !hamburger) {
        return;
    }

    navLinks.classList.remove("show");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
}

function toggleMenu(button) {
    if (!navLinks) {
        return;
    }

    const trigger = button || hamburger;
    const isOpen = navLinks.classList.toggle("show");

    if (trigger) {
        trigger.classList.toggle("active", isOpen);
        trigger.setAttribute("aria-expanded", String(isOpen));
    }
}

function updateThemeButton() {
    if (!themeButton) {
        return;
    }

    const isDark = document.body.classList.contains("dark-mode");
    themeButton.textContent = isDark ? "Light mode" : "Dark mode";
    themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function toggleFunction() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeButton();
}

  window.onscroll = function () {
    if (document.documentElement.scrollTop > 460) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  };

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

function revealSections() {
    const sections = document.querySelectorAll(".reveal");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        sections.forEach((section) => section.classList.add("is-visible"));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    sections.forEach((section) => revealObserver.observe(section));
}

if (hamburger) {
    hamburger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMenu(hamburger);
        }
    });
}

if (navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
}

document.addEventListener("click", (event) => {
    if (!navLinks || !hamburger) {
        return;
    }

    if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
    }
});


window.addEventListener("load", () => {
    const storedTheme = localStorage.getItem("theme");
    const shouldUseDark = storedTheme
        ? storedTheme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.body.classList.toggle("dark-mode", shouldUseDark);
    updateThemeButton();

    const loader = document.querySelector(".loading-screen");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("is-hidden");
        }, 200);

        setTimeout(() => {
            loader.remove();
        }, 220);
    }

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    revealSections();
    updateThemeButton();
});

// Google Translate language switcher (site-wide on pages using this shared script).
(function setupGoogleTranslate() {
    if (document.getElementById("google_translate_element")) {
        return;
    }

    const languageBox = document.createElement("div");
    languageBox.id = "google_translate_element";
    languageBox.setAttribute("aria-label", "Choose website language");
    languageBox.style.cssText = [
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "min-height:40px",
        "padding:4px 8px",
        "border:1px solid rgba(74,163,255,.28)",
        "border-radius:14px",
        "background:rgba(255,255,255,.92)",
        "max-width:100%",
        "z-index:1001"
    ].join(";");

    const navbar = document.querySelector(".navbar");
    const themeControl = navbar && navbar.querySelector(".toggleTheme");
    if (navbar && themeControl) {
        navbar.insertBefore(languageBox, themeControl);
    } else {
        languageBox.style.position = "fixed";
        languageBox.style.top = "12px";
        languageBox.style.right = "12px";
        languageBox.style.boxShadow = "0 4px 18px rgba(0,0,0,.12)";
        document.body.appendChild(languageBox);
    }

    window.googleTranslateElementInit = function () {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            new window.google.translate.TranslateElement({
                pageLanguage: "en",
                includedLanguages: "en,hi",
                autoDisplay: false,
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            }, "google_translate_element");
        }
    };

    const translateScript = document.createElement("script");
    translateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    translateScript.async = true;
    translateScript.onerror = function () {
        languageBox.textContent = "Language translation unavailable";
        languageBox.setAttribute("title", "Google Translate could not be loaded. Check your connection or try again later.");
    };
    document.head.appendChild(translateScript);
})();
