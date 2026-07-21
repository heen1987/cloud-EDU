// 라이트/다크 테마 수동 선택 — 되도록 빨리 적용해 깜빡임을 줄인다
(function () {
  var KEY = "sesac-theme";
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
  }

  function currentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function renderLabel(btn, theme) {
    if (theme === "dark") {
      btn.innerHTML = '<span class="icon">☀️</span>라이트 모드';
    } else {
      btn.innerHTML = '<span class="icon">🌙</span>다크 모드';
    }
  }

  function initThemeToggle() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "라이트/다크 모드 전환");
    renderLabel(btn, currentTheme());
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      renderLabel(btn, next);
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

// 공통 교안 스크립트: 모바일 TOC 토글 + 스크롤 시 현재 섹션 하이라이트
document.addEventListener("DOMContentLoaded", function () {
  var toc = document.querySelector(".toc");
  var toggle = document.querySelector(".toc-toggle");
  if (toggle && toc) {
    toggle.addEventListener("click", function () {
      toc.classList.toggle("open");
    });
    toc.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toc.classList.remove("open");
      });
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll(".toc nav a"));
  var targets = links
    .map(function (a) {
      var id = a.getAttribute("href").replace("#", "");
      return { a: a, el: document.getElementById(id) };
    })
    .filter(function (t) { return t.el; });

  if (!targets.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var match = targets.find(function (t) { return t.el === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          match.a.classList.add("active");
        }
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  );

  targets.forEach(function (t) { observer.observe(t.el); });
});
