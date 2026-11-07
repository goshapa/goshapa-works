(function () {
  var CATS = [
    { id: "all", label: "Все" },
    { id: "medical", label: "Медицина" },
    { id: "business", label: "Бизнес" },
    { id: "beauty", label: "Красота" },
    { id: "apps", label: "Веб-приложения" },
    { id: "bots", label: "Боты и CRM" },
    { id: "creative", label: "Креатив" }
  ];
  var CAT_LABEL = {};
  CATS.forEach(function (c) { CAT_LABEL[c.id] = c.label; });

  var works = window.WORKS || [];
  var salons = window.SALONS || [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function host(url) {
    try { var u = new URL(url); return (u.hostname + u.pathname).replace(/\/$/, ""); } catch (e) { return url; }
  }

  var ICONS = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>',
    gh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>',
    bot: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="15" width="30" height="22" rx="7"/><path d="M24 8v7M17 26h.01M31 26h.01M19 32h10M5 24v6M43 24v6"/></svg>',
    crm: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="36" height="32" rx="6"/><path d="M6 17h36M16 17v23M22 25h13M22 31h9"/></svg>'
  };

  function browserFrame(w, big) {
    var url = w.url || w.repo;
    var media;
    if (w.img) {
      media = '<img src="assets/shots/' + w.img + '.webp" alt="' + esc(w.title) + ' — скриншот" loading="' + (big ? "eager" : "lazy") + '" width="1200" height="750">';
    } else {
      media =
        '<div class="no-shot no-shot--' + (w.icon || "bot") + '">' +
          '<div class="no-shot-icon">' + ICONS[w.icon || "bot"] + "</div>" +
          '<div class="no-shot-chat">' +
            '<span class="bubble in"></span><span class="bubble out"></span><span class="bubble in short"></span>' +
          "</div>" +
        "</div>";
    }
    return (
      '<div class="frame">' +
        '<div class="frame-bar"><i></i><i></i><i></i><span class="frame-url">' + esc(host(url)) + "</span></div>" +
        '<div class="frame-media">' + media + "</div>" +
      "</div>"
    );
  }

  function actions(w) {
    var a = "";
    if (w.url) a += '<a class="btn btn-sm btn-primary" href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer">' + esc(w.urlLabel || "Открыть сайт") + ICONS.arrow + "</a>";
    if (w.repo) a += '<a class="btn btn-sm btn-ghost" href="' + esc(w.repo) + '" target="_blank" rel="noopener noreferrer">' + ICONS.gh + "GitHub</a>";
    return '<div class="card-actions">' + a + "</div>";
  }

  function tags(w) {
    return '<div class="tags">' + w.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>";
  }

  // Stats
  var siteCount = works.filter(function (w) { return w.url && w.cat !== "bots"; }).length + salons.length;
  var botCount = works.filter(function (w) { return w.cat === "bots"; }).length;
  var stats = [
    [works.length + salons.length, "работ в портфолио"],
    [siteCount, "живых сайтов"],
    [botCount, "ботов и CRM"],
    [works.filter(function (w) { return w.url && /\.uz\/?$/.test(w.url); }).length, "сайтов на своих доменах .uz"]
  ];
  document.getElementById("stats").innerHTML = stats.map(function (s) {
    return '<div class="stat"><b data-count="' + s[0] + '">' + s[0] + "</b><span>" + s[1] + "</span></div>";
  }).join("");

  // Featured
  document.getElementById("featured").innerHTML = works.filter(function (w) { return w.featured; }).map(function (w, i) {
    return (
      '<article class="feat reveal">' +
        '<a class="feat-media" href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Открыть ' + esc(w.title) + '">' + browserFrame(w, true) + "</a>" +
        '<div class="feat-body">' +
          '<div class="feat-num">0' + (i + 1) + '<span>' + esc(CAT_LABEL[w.cat]) + " · " + esc(w.year) + "</span></div>" +
          "<h3>" + esc(w.title) + "</h3>" +
          "<p>" + esc(w.desc) + "</p>" +
          tags(w) + actions(w) +
        "</div>" +
      "</article>"
    );
  }).join("");

  // Filters
  var filtersEl = document.getElementById("filters");
  var gridEl = document.getElementById("grid");
  var rest = works.filter(function (w) { return !w.featured; });
  filtersEl.innerHTML = CATS.map(function (c, i) {
    var n = c.id === "all" ? rest.length : rest.filter(function (w) { return w.cat === c.id; }).length;
    return '<button class="chip' + (i === 0 ? " is-active" : "") + '" role="tab" aria-selected="' + (i === 0) + '" data-cat="' + c.id + '">' + c.label + "<sup>" + n + "</sup></button>";
  }).join("");

  gridEl.innerHTML = rest.map(function (w) {
    return (
      '<article class="card reveal" data-cat="' + w.cat + '">' +
        (w.url ? '<a class="card-media" href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">' : '<div class="card-media">') +
          browserFrame(w) +
        (w.url ? "</a>" : "</div>") +
        '<div class="card-body">' +
          '<span class="card-cat">' + esc(CAT_LABEL[w.cat]) + "</span>" +
          "<h3>" + esc(w.title) + "</h3>" +
          "<p>" + esc(w.desc) + "</p>" +
          tags(w) + actions(w) +
        "</div>" +
      "</article>"
    );
  }).join("");

  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    var cat = b.getAttribute("data-cat");
    filtersEl.querySelectorAll(".chip").forEach(function (c) {
      var on = c === b;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", on);
    });
    gridEl.querySelectorAll(".card").forEach(function (card) {
      var show = cat === "all" || card.getAttribute("data-cat") === cat;
      card.hidden = !show;
      if (show) card.classList.add("is-visible");
    });
  });

  // Salons
  document.getElementById("salons").innerHTML = salons.map(function (s) {
    return (
      '<a class="salon reveal" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="salon-img"><img src="assets/shots/' + s.img + '.webp" alt="' + esc(s.title) + '" loading="lazy" width="1200" height="750"></div>' +
        '<div class="salon-body"><span>' + esc(s.tag) + "</span><h4>" + esc(s.title) + "</h4><p>" + esc(s.desc) + "</p></div>" +
      "</a>"
    );
  }).join("");

  document.getElementById("year").textContent = new Date().getFullYear();

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Header shadow
  var header = document.querySelector(".header");
  window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", scrollY > 10); }, { passive: true });
})();
