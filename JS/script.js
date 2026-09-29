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
        }, 160);

        setTimeout(() => {
            loader.remove();
        }, 200);
    }

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    revealSections();
    toggleTopButton();
});
