/* TechFide — interações da landing page */
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const overlay = document.querySelector(".menu-overlay");

  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    overlay?.classList.toggle("open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  overlay?.addEventListener("click", () => setMenu(false));
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* Reveal on scroll */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* Active nav link */
  const sections = Array.from(document.querySelectorAll("main section[id], main .doc-section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".menu a[href^='#'], .doc-nav a[href^='#']"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const so = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => so.observe(s));
  }

  /* Contact form → WhatsApp */
  const form = document.getElementById("contact-form");
  if (form) {
    const WHATSAPP = "5517999608805";
    const error = form.querySelector(".form-error");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = String(data.get("nome") || "").trim();
      const empresa = String(data.get("empresa") || "").trim();
      const interesse = String(data.get("interesse") || "").trim();
      const mensagem = String(data.get("mensagem") || "").trim();

      if (!nome || !mensagem) {
        if (error) error.hidden = false;
        (nome ? form.mensagem : form.nome).focus();
        return;
      }
      if (error) error.hidden = true;

      const lines = [
        `Olá, TechFide! Meu nome é ${nome}.`,
        empresa ? `Empresa: ${empresa}` : null,
        `Interesse: ${interesse}`,
        "",
        mensagem,
      ].filter((l) => l !== null);

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener");
    });
  }

  /* Footer year */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
