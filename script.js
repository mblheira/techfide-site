const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    menuOverlay?.classList.toggle("open", isOpen);
  });
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((el) => observer.observe(el));

const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".menu a"));
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("active", isActive);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -45% 0px", threshold: 0.1 }
);

sections.forEach((section) => sectionObserver.observe(section));

const submenuToggle = document.querySelector(".submenu-toggle");
const submenu = document.querySelector(".submenu");
if (submenuToggle && submenu) {
  submenuToggle.addEventListener("click", () => {
    const isOpen = submenu.classList.toggle("open");
    submenuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!submenu.contains(event.target) && !submenuToggle.contains(event.target)) {
      submenu.classList.remove("open");
      submenuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

menuOverlay?.addEventListener("click", () => {
  menu.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  menuOverlay.classList.remove("open");
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    menuOverlay?.classList.remove("open");
  });
});

const heroVideos = Array.from(document.querySelectorAll(".hero-video"));
if (heroVideos.length === 2) {
  const [first, second] = heroVideos;
  const safePlay = (video) => video.play().catch(() => {});

  const swapTo = (current, next) => {
    next.currentTime = 0;
    safePlay(next);
    const onPlay = () => {
      next.classList.add("is-active");
      current.classList.remove("is-active");
      next.removeEventListener("playing", onPlay);
    };
    next.addEventListener("playing", onPlay);
  };

  first.addEventListener("ended", () => swapTo(first, second));
  second.addEventListener("ended", () => swapTo(second, first));

  safePlay(first);
  safePlay(second);
  second.pause();
}

const track = document.querySelector("[data-carousel]");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const dots = Array.from(document.querySelectorAll("[data-dot]"));
let autoScrollId;

const getGap = () => {
  if (!track) return 0;
  const gap = getComputedStyle(track).columnGap;
  return Number.parseFloat(gap) || 0;
};

const getSlideWidth = () => {
  if (!track) return 0;
  const first = track.firstElementChild?.getBoundingClientRect().width || 0;
  if (first > 0) return first;
  return Math.max(280, track.getBoundingClientRect().width * 0.8);
};

const setActiveDot = (index) => {
  dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
};

const scrollToIndex = (index) => {
  if (!track) return;
  const step = getSlideWidth() + getGap();
  track.scrollTo({ left: step * index, behavior: "smooth" });
  setActiveDot(index);
};

const scrollCarousel = (direction = 1) => {
  if (!track) return;
  const step = getSlideWidth() + getGap();
  const maxScroll = track.scrollWidth - track.clientWidth;
  const nextLeft = track.scrollLeft + direction * step;
  if (nextLeft >= maxScroll - 2) {
    track.scrollTo({ left: 0, behavior: "smooth" });
    setActiveDot(0);
    return;
  }
  if (nextLeft <= 0) {
    track.scrollTo({ left: maxScroll, behavior: "smooth" });
    setActiveDot(dots.length - 1);
    return;
  }
  track.scrollBy({ left: direction * step, behavior: "smooth" });
};

const startAutoScroll = () => {
  if (!track) return;
  stopAutoScroll();
  autoScrollId = setInterval(() => scrollCarousel(1), 3000);
};

const stopAutoScroll = () => {
  if (autoScrollId) {
    clearInterval(autoScrollId);
  }
};

if (track) {
  track.addEventListener("mouseenter", stopAutoScroll);
  track.addEventListener("mouseleave", startAutoScroll);
  track.addEventListener("touchstart", stopAutoScroll, { passive: true });
  track.addEventListener("touchend", startAutoScroll);
  track.addEventListener("scroll", () => {
    const step = getSlideWidth() + getGap();
    const index = Math.round(track.scrollLeft / step);
    setActiveDot(Math.min(index, dots.length - 1));
  });
  startAutoScroll();
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => scrollToIndex(Number(dot.dataset.dot)));
});

prevBtn?.addEventListener("click", () => scrollCarousel(-1));
nextBtn?.addEventListener("click", () => scrollCarousel(1));
