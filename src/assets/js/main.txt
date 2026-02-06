function loadCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

var timeoutFHS;
var listenersAdded = false;

function activateLazyLoading() {
  try {
    if (!localStorage.getItem("lazy")) {
      localStorage.setItem("lazy", "1");
    }
  } catch (e) {
    console.warn("LocalStorage not available", e);
  }

  loadCSS('/css/webfonts.min.css');

  setTimeout(() => {
    document.querySelectorAll('.skeleton').forEach(el => el.classList.add('loaded'));
  }, 100);

  if (listenersAdded) {
    document.removeEventListener("mousemove", activateLazyLoading);
    document.removeEventListener("touchstart", activateLazyLoading);
    document.removeEventListener("keydown", activateLazyLoading);
    document.removeEventListener("scroll", activateLazyLoading);
    clearTimeout(timeoutFHS);
  }
}

try {
  if (localStorage.getItem("lazy") === "1") {
    activateLazyLoading();
  } else {
    listenersAdded = true;
    document.addEventListener("mousemove", activateLazyLoading);
    document.addEventListener("touchstart", activateLazyLoading);
    document.addEventListener("keydown", activateLazyLoading);
    document.addEventListener("scroll", activateLazyLoading);
    timeoutFHS = setTimeout(activateLazyLoading, 30000);
  }
} catch (e) {
  activateLazyLoading();
}

// Search Functionality
const openSearch = document.querySelectorAll('.openSearch');
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const clearBtn = document.getElementById('clearBtn');
let fonts = [];

fetch('https://cdn.jsdelivr.net/gh/fuadhasanshihab/bangla-web-fonts@main/src/collections/fonts.json')
  .then(res => res.json())
  .then(data => fonts = data);

function displayResults(fontArray, query) {
  resultsContainer.innerHTML = '';
  resultsContainer.classList.remove('hidden');

  if (fontArray.length > 0) {
    fontArray.forEach(font => {
      const div = document.createElement('div');
      div.className = 'px-4 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors';
      const regex = new RegExp(`(${query})`, 'gi');
      const highlighted = font.FontName.replace(regex, match => `<span class="font-bold text-blue-600 dark:text-blue-400">${match}</span>`);
      div.innerHTML = highlighted;
      div.onclick = () => {
        window.location.href = `/${font.FontPath}/`;
      };
      resultsContainer.appendChild(div);
    });
  } else if (query.trim()) {
    const noMatch = document.createElement('div');
    noMatch.className = 'px-4 py-2 text-gray-500 italic';
    noMatch.textContent = `No results found for "${query}"`;
    resultsContainer.appendChild(noMatch);
  } else {
    resultsContainer.classList.add('hidden');
  }
}

searchInput?.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  clearBtn?.classList.toggle('hidden', query.length === 0);
  if (query.length === 0) {
    displayResults(fonts, '');
  } else {
    const filtered = fonts.filter(font => font.FontName.toLowerCase().includes(query));
    displayResults(filtered, searchInput.value);
  }
});

searchInput?.addEventListener('focus', () => {
  if (searchInput.value.trim() === '') displayResults(fonts, '');
});

clearBtn?.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.classList.add('hidden');
  displayResults(fonts, '');
  searchInput.focus();
});

openSearch.forEach(el => {
  el.addEventListener('click', () => {
    searchModal?.classList.remove('hidden');
    setTimeout(() => searchInput?.focus(), 150);
  });
});

searchModal?.addEventListener('click', (e) => {
  if (e.target === searchModal) {
    searchModal.classList.add('hidden');
    resultsContainer?.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchModal?.classList.add('hidden');
    resultsContainer?.classList.add('hidden');
  }
});

// Theme Toggle
function updateThemeIcons(isDark) {
  document.querySelectorAll(".sun").forEach(el => el.classList.toggle("hidden", !isDark));
  document.querySelectorAll(".moon").forEach(el => el.classList.toggle("hidden", isDark));
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("dark_mode", isDark);
  updateThemeIcons(isDark);
}

document.querySelectorAll(".darkToggle").forEach(btn => {
  btn.addEventListener("click", toggleDarkMode);
});

// Sticky Header
const stickyClasses = ["fixed", "h-16"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = ["border-neutral-200", "bg-white/80", "dark:border-neutral-800", "dark:bg-neutral-950/80", "backdrop-blur-md"];
const unstickyClassesContainer = ["border-transparent"];

function evaluateHeaderPosition() {
  const header = document.getElementById("header");
  const menu = document.getElementById("menu");
  const modal = document.getElementById("searchModal");
  if (!header) return;

  if (window.scrollY > 16) {
    header.firstElementChild.classList.add(...stickyClassesContainer);
    header.firstElementChild.classList.remove(...unstickyClassesContainer);
    header.classList.add(...stickyClasses);
    header.classList.remove(...unstickyClasses);
    menu?.classList.add("top-[64px]");
    menu?.classList.remove("top-[80px]");
    modal?.classList.add("top-[64px]");
    modal?.classList.remove("top-[80px]");
  } else {
    header.firstElementChild.classList.remove(...stickyClassesContainer);
    header.firstElementChild.classList.add(...unstickyClassesContainer);
    header.classList.add(...unstickyClasses);
    header.classList.remove(...stickyClasses);
    menu?.classList.remove("top-[64px]");
    menu?.classList.add("top-[80px]");
    modal?.classList.remove("top-[64px]");
    modal?.classList.add("top-[80px]");
  }
}

window.addEventListener("scroll", evaluateHeaderPosition);

// Init
document.addEventListener("DOMContentLoaded", () => {
  updateThemeIcons(document.documentElement.classList.contains("dark"));
  evaluateHeaderPosition();

  // Menu active state
  document.querySelectorAll("#menu a").forEach(link => {
    if (link.pathname === window.location.pathname) {
      link.classList.add("text-neutral-900", "dark:text-white");
    }
  });
});

// Mobile Menu
window.openMobileMenu = () => {
  document.getElementById("openMenu")?.classList.add("hidden");
  document.getElementById("closeMenu")?.classList.remove("hidden");
  document.getElementById("menu")?.classList.remove("translate-x-full");
  document.getElementById("menu")?.classList.add("translate-x-0");
  const bg = document.getElementById("mobileMenuBackground");
  bg?.classList.remove("hidden");
  bg?.classList.add("opacity-0");
  setTimeout(() => bg?.classList.remove("opacity-0"), 1);
};

window.closeMobileMenu = () => {
  document.getElementById("closeMenu")?.classList.add("hidden");
  document.getElementById("openMenu")?.classList.remove("hidden");
  document.getElementById("menu")?.classList.remove("translate-x-0");
  document.getElementById("menu")?.classList.add("translate-x-full");
  const bg = document.getElementById("mobileMenuBackground");
  bg?.classList.add("opacity-0");
  setTimeout(() => bg?.classList.add("hidden"), 300);
};

document.getElementById("openMenu")?.addEventListener("click", openMobileMenu);
document.getElementById("closeMenu")?.addEventListener("click", closeMobileMenu);
