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
