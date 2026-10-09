(function () {
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menu no celular */
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

  /* Ano do rodapé */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* Entrada dos blocos ao rolar */
  var surgem = document.querySelectorAll(".surge");
  if (surgem.length && "IntersectionObserver" in window && !reduzMovimento) {
    var obsSurge = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("visto");
          obsSurge.unobserve(e.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    surgem.forEach(function (el) {
      obsSurge.observe(el);
    });
  } else {
    surgem.forEach(function (el) {
      el.classList.add("visto");
    });
  }

  /* Link ativo no menu e no índice da proposta */
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".menu a[href^='#'], .doc-indice a[href^='#']")
  );
  var secoes = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);
  if (secoes.length && "IntersectionObserver" in window) {
    var obsSecao = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = "#" + e.target.id;
          links.forEach(function (link) {
            link.classList.toggle("ativo", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    secoes.forEach(function (s) {
      obsSecao.observe(s);
    });
  }

  /* Malha de quadrados do hero: reage ao ponteiro e respira devagar */
  var canvas = document.querySelector(".malha");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var passo = 28;
    var lado = 6;
    var ponteiro = { x: -9999, y: -9999 };
    var alvo = { x: -9999, y: -9999 };
    var largura = 0;
    var altura = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var inicio = performance.now();
    var quadro = null;

    var redimensiona = function () {
      var r = canvas.getBoundingClientRect();
      largura = r.width;
      altura = r.height;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduzMovimento) desenha(0);
    };

    var desenha = function (t) {
      ctx.clearRect(0, 0, largura, altura);
      ponteiro.x += (alvo.x - ponteiro.x) * 0.12;
      ponteiro.y += (alvo.y - ponteiro.y) * 0.12;
      var tempo = (t - inicio) / 1000;
      var colunas = Math.ceil(largura / passo) + 1;
      var linhas = Math.ceil(altura / passo) + 1;
      var fade = Math.min(1, largura / 1200);
      for (var i = 0; i < colunas; i++) {
        for (var j = 0; j < linhas; j++) {
          var x = i * passo;
          var y = j * passo;
          var dx = x - ponteiro.x;
          var dy = y - ponteiro.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          var perto = Math.max(0, 1 - d / 220);
          var onda = 0.5 + 0.5 * Math.sin(tempo * 0.6 + x * 0.012 + y * 0.018);
          var base = 0.05 + onda * 0.07;
          var direita = Math.max(0, (x / largura - 0.45) * 1.6) * fade;
          var alfa = Math.min(1, base * (0.3 + direita) + perto * perto * 0.95);
          if (alfa < 0.02) continue;
          ctx.fillStyle = "rgba(0, 147, 254, " + alfa.toFixed(3) + ")";
          var tam = lado + perto * 6;
          ctx.fillRect(x - tam / 2, y - tam / 2, tam, tam);
        }
      }
      if (!reduzMovimento) quadro = requestAnimationFrame(desenha);
    };

    var secao = canvas.parentElement;
    secao.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      alvo.x = e.clientX - r.left;
      alvo.y = e.clientY - r.top;
    });
    secao.addEventListener("pointerleave", function () {
      alvo.x = -9999;
      alvo.y = -9999;
    });

    window.addEventListener("resize", redimensiona);
    redimensiona();
    if (!reduzMovimento) {
      var obsCanvas = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) {
            if (!quadro) quadro = requestAnimationFrame(desenha);
          } else if (quadro) {
            cancelAnimationFrame(quadro);
            quadro = null;
          }
        });
      });
      obsCanvas.observe(canvas);
    }
  }
})();
