import icons from "../utils/icons.js";
let allData = {};
let currentLang = "en";

document.addEventListener("DOMContentLoaded", () => {
  allData = window.APP_DATA;
  const savedLang = localStorage.getItem("preferredLang");
  currentLang = savedLang || allData.config.defaultLang;

  renderLanguageOptions();
  updateContent();
  setupForm();
  setupLanguageSwitcher();
  setupMobileMenu();
  setupNavbar(); // New: Handles scroll transparency
  setupScrollAnimations();
});


// 2. Localization
function renderLanguageOptions() {
  const desktopSelector = document.getElementById("lang-selector");
  const mobileSelector = document.getElementById("mobile-lang-selector");

  const populate = (selector) => {
    if (!selector) return;
    selector.innerHTML = "";
    Object.keys(allData.languages).forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = allData.languages[key];
      if (key === currentLang) option.selected = true;
      selector.appendChild(option);
    });
  };

  populate(desktopSelector);
  populate(mobileSelector);
}

function setupLanguageSwitcher() {
  const handleSwitch = (e) => {
    currentLang = e.target.value;
    localStorage.setItem("preferredLang", currentLang);

    const d = document.getElementById("lang-selector");
    const m = document.getElementById("mobile-lang-selector");
    if (d) d.value = currentLang;
    if (m) m.value = currentLang;

    updateContent();
  };

  const d = document.getElementById("lang-selector");
  const m = document.getElementById("mobile-lang-selector");
  if (d) d.addEventListener("change", handleSwitch);
  if (m) m.addEventListener("change", handleSwitch);
}

function updateContent() {
  const t = allData.translations[currentLang];
  if (!t) return;

  // Text Elements
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const keys = element.dataset.i18n.split(".");
    let value = t;
    keys.forEach((k) => (value = value?.[k]));
    if (value) element.textContent = value;
  });

  // Placeholders
  const labels = t.booking.labels;
  const inputs = {
    firstName: labels.first,
    lastName: labels.last,
    email: labels.email,
    phone: labels.phone,
    message: labels.message,
  };
  for (const [name, placeholder] of Object.entries(inputs)) {
    const el = document.querySelector(`[name="${name}"]`);
    if (el) el.placeholder = placeholder;
  }

  // Render Lists
  renderFeatures(t.hero.features);
  renderServices(t.services.list);
  renderTestimonials(t.testimonials.list);
  renderFooter(t.footer, allData.config.socials, t.contact);

  // Stats
  const s1 = document.getElementById("stat-label-1");
  const s2 = document.getElementById("stat-label-2");
  const s3 = document.getElementById("stat-label-3");
  if (s1) s1.textContent = t.hero.stats.clients;
  if (s2) s2.textContent = t.hero.stats.satisfaction;
  if (s3) s3.textContent = t.hero.stats.rating;

  // Trigger animations for new content
  observeElements();
}

// 3. Render Helpers
function renderFeatures(features) {
  const container = document.getElementById("features-list");
  if (!container) return;
  container.innerHTML = features
    .map(
      (f) => `
        <div class="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
            <div class="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                <img src="${icons[`${f.icon}.svg`]}" alt="" class="w-7 h-7" />
            </div>
            <span class="text-gray-700 font-medium">${f.text}</span>
        </div>
    `
    )
    .join("");
}

function renderServices(services) {
  const container = document.getElementById("services-grid");
  if (!container) return;

  const colorMap = {
    blue: "text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
    cyan: "text-cyan-600 bg-cyan-50 group-hover:bg-cyan-600 group-hover:text-white",
    indigo:
      "text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white",
    sky: "text-sky-600 bg-sky-50 group-hover:bg-sky-600 group-hover:text-white",
    teal: "text-teal-600 bg-teal-50 group-hover:bg-teal-600 group-hover:text-white",
    emerald:
      "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white",
  };

  container.innerHTML = services
    .map((s, index) => {
      const colorClass = colorMap[s.color] || colorMap.blue;
      return `
        <div class="reveal group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style="transition-delay: ${
          index * 50
        }ms">
            <div class="w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center transition-all duration-300 mb-6">
            <img src="${
              icons[s.icon]
            }" alt="${s.title} icon" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">${
              s.title
            }</h3>
            <p class="text-slate-500 text-sm leading-relaxed">${s.desc}</p>
        </div>
    `;
    })
    .join("");
}

function renderTestimonials(reviews) {
    const container = document.getElementById("testimonials-container");
    if (!container) return;

    if (!reviews || reviews.length === 0) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = reviews.map((r, index) => `
        <div class="testimonial-card reveal bg-white rounded-2xl shadow-lg p-8 border border-slate-100 h-full" style="transition-delay: ${index * 100}ms">
            <div class="relative z-10">
                <div class="text-yellow-400 text-lg mb-6">
                    ${Array(r.stars).fill('<i class="ri-star-fill"></i>').join("")}
                </div>
                <p class="text-slate-600 italic leading-relaxed mb-8 text-base">"${r.quote}"</p>
            </div>
            <div class="relative z-10 mt-auto flex items-center">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
                    ${r.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-slate-900">${r.name}</h4>
                    <p class="text-slate-500 text-sm">${r.role}</p>
                </div>
            </div>
        </div>
    `).join("");
    
    // Re-trigger scroll animations for the new content
    observeElements();
}


function renderFooter(footerData, socials, contactData) {
  const about = document.querySelector('[data-i18n="footer.about_desc"]');
  if (about) about.textContent = footerData.about_desc;

  const sContainer = document.getElementById("footer-socials");
  if (sContainer) {
    sContainer.innerHTML = socials
      .map(
        (s) => `
            <a href="${s.link}" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition">
                <i class="${s.icon} text-lg"></i>
            </a>
        `
      )
      .join("");
  }

  const cContainer = document.getElementById("footer-contact-info");
  if (cContainer) {
    cContainer.innerHTML = `
            <li class="flex items-center gap-3"><i class="ri-mail-line"></i><span>${contactData.email}</span></li>
            <li class="flex items-center gap-3"><i class="ri-phone-line"></i><span>${contactData.phone}</span></li>
        `;
  }
}

// 4. Navbar & Mobile Menu Logic
function setupNavbar() {
  const nav = document.getElementById("main-nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      nav.classList.add(
        "scrolled",
        "shadow-md",
        "bg-white/90",
        "backdrop-blur-md",
        "py-2"
      );
      nav.classList.remove("py-4", "bg-transparent");
    } else {
      nav.classList.remove(
        "scrolled",
        "shadow-md",
        "bg-white/90",
        "backdrop-blur-md",
        "py-2"
      );
      nav.classList.add("py-4", "bg-transparent");
    }
  });
}

function setupMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const links = menu.querySelectorAll(".mobile-link");
  const icon = btn.querySelector("i");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isClosed = menu.classList.contains("closed");

    if (isClosed) {
      // Open Menu
      menu.classList.remove("closed");
      menu.classList.add("open");
      icon.className =
        "ri-close-line transition-transform rotate-90 duration-300";
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      // Close Menu
      menu.classList.remove("open");
      menu.classList.add("closed");
      icon.className =
        "ri-menu-4-line transition-transform rotate-0 duration-300";
      document.body.style.overflow = "";
    }
  });

  // Close menu when a link is clicked
  links.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menu.classList.add("closed");
      icon.className = "ri-menu-4-line";
      document.body.style.overflow = "";
    });
  });
}

// 5. Scroll Animations (Fixed Scope)
function setupScrollAnimations() {
  observeElements();
}

function observeElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// 6. Form & Toast
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const isSuccess = type === "success";

  toast.className = `flex items-center w-full max-w-xs p-4 space-x-4 bg-white rounded-xl shadow-2xl border-l-4 ${
    isSuccess ? "border-green-500" : "border-red-500"
  } transform transition-all duration-500 translate-x-full opacity-0 mb-4`;

  toast.innerHTML = `
        <div class="flex-shrink-0"><i class="${
          isSuccess
            ? "ri-checkbox-circle-line text-green-500"
            : "ri-error-warning-line text-red-500"
        } text-2xl"></i></div>
        <div class="flex-1 min-w-0"><p class="text-sm font-bold text-gray-900">${
          isSuccess ? "Success" : "Error"
        }</p><p class="text-sm text-gray-500 truncate">${message}</p></div>
        <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-900"><i class="ri-close-line text-xl"></i></button>
    `;

  container.appendChild(toast);
  requestAnimationFrame(() =>
    toast.classList.remove("translate-x-full", "opacity-0")
  );
  setTimeout(() => {
    toast.classList.add("translate-x-full", "opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

function validateField(input, check, message) {
  const errorEl = input.nextElementSibling;
  if (!check(input.value)) {
    input.classList.add("border-red-400", "focus:border-red-500");
    errorEl.textContent = message;
    return false;
  } else {
    input.classList.remove("border-red-400", "focus:border-red-500");
    errorEl.textContent = "";
    return true;
  }
}

function setupForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const btn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btn-submit-text");
  const btnIcon = document.getElementById("btn-submit-icon");

  const fields = {
    firstName: {
      input: form.querySelector('[name="firstName"]'),
      check: (val) => val.trim() !== "",
      message: "First name is required.",
    },
    lastName: {
      input: form.querySelector('[name="lastName"]'),
      check: (val) => val.trim() !== "",
      message: "Last name is required.",
    },
    email: {
      input: form.querySelector('[name="email"]'),
      check: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      message: "Please enter a valid email.",
    },
    phone: {
      input: form.querySelector('[name="phone"]'),
      check: (val) => /^\D*(\d{3})\D*\D*(\d{3})\D*(\d{4})\D*$/.test(val),
      message: "Please enter a valid phone number.",
    },
  };

  // Real-time validation on input
  for (const field of Object.values(fields)) {
    field.input.addEventListener("input", () => {
      validateField(field.input, field.check, field.message);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = allData.translations[currentLang];
    const scriptUrl = allData.config.googleScriptUrl;

    // Run all validations on submit
    let isFormValid = true;
    for (const field of Object.values(fields)) {
      if (!validateField(field.input, field.check, field.message)) {
        isFormValid = false;
      }
    }

    if (!isFormValid) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    if (!scriptUrl || scriptUrl.includes("REPLACE_ME")) {
      showToast("Setup Error: Google URL missing", "error");
      return;
    }

    btn.disabled = true;
    btnText.textContent = t.booking.btn_sending;
    btnIcon.className = "ri-loader-4-line animate-spin mr-2";

    const formData = new FormData(form);
    const data = new URLSearchParams();
    for (const pair of formData) data.append(pair[0], pair[1]);

    fetch(scriptUrl, { method: "POST", body: data })
      .then(() => {
        showToast(t.booking.success_msg, "success");
        form.reset();
        // Clear validation states
        for (const field of Object.values(fields)) {
          validateField(field.input, () => true, "");
        }
      })
      .catch(() => {
        showToast(t.booking.error_msg, "error");
      })
      .finally(() => {
        btn.disabled = false;
        btnText.textContent = t.booking.btn_submit;
        btnIcon.className = "ri-send-plane-fill mr-2";
      });
  });
}
