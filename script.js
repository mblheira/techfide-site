(function () {
  var botao = document.querySelector(".menu-botao");
  var menu = document.getElementById("menu");

  if (botao && menu) {
    botao.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", String(aberto));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("aberto");
        botao.setAttribute("aria-expanded", "false");
      });
    });
  }

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());

  var links = Array.prototype.slice.call(
    document.querySelectorAll(".menu a[href^='#'], .doc-indice a[href^='#']")
  );
  var secoes = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (secoes.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          var id = "#" + entrada.target.id;
          links.forEach(function (link) {
            link.classList.toggle("ativo", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    secoes.forEach(function (s) {
      obs.observe(s);
    });
  }
})();
