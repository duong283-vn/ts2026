/* tt.js – Animation & Interaction Engine */

(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [],
    W,
    H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.6 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.35 + 0.05;
    this.life = 0;
    this.maxLife = Math.random() * 400 + 300;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    const ratio = this.life / this.maxLife;
    this.alpha =
      ratio < 0.2
        ? (ratio / 0.2) * 0.35
        : ratio > 0.8
          ? ((1 - ratio) / 0.2) * 0.35
          : 0.35;
    if (this.life >= this.maxLife) this.reset();
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(184,134,11,${this.alpha})`;
    ctx.fill();
  };
  for (let i = 0; i < 55; i++) particles.push(new Particle());
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

(function initProgress() {
  const bar = document.getElementById("readProgress");
  window.addEventListener(
    "scroll",
    () => {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + "%";
    },
    { passive: true },
  );
})();

(function heroReveal() {
  document.querySelectorAll(".line-reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), 200 + i * 180);
  });
  setTimeout(() => {
    document.querySelector(".animate-badge")?.classList.add("in");
  }, 80);
  setTimeout(startAllCounters, 700);
})();

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 900,
    start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
function startAllCounters() {
  document.querySelectorAll(".counter").forEach((el) => animateCounter(el));
}

(function initScrollReveal() {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("visible");
        el.querySelectorAll(".counter").forEach((c) => {
          if (!c.dataset.animated) {
            c.dataset.animated = "1";
            animateCounter(c);
          }
        });
        revealObs.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  document
    .querySelectorAll(".reveal,.reveal-card,.school-block,.info-card")
    .forEach((el) => revealObs.observe(el));
  document.querySelectorAll(".wish-grid").forEach((grid) => {
    Array.from(grid.children).forEach((card, i) => {
      card.style.transitionDelay = i * 60 + "ms";
    });
  });
})();

(function initSalaryBars() {
  const salObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".sal-bar").forEach((bar, i) => {
          setTimeout(() => bar.classList.add("animate"), i * 120);
        });
        salObs.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );
  document.querySelectorAll(".salary-card").forEach((c) => salObs.observe(c));
})();

document.querySelectorAll(".wish-card").forEach((card) => {
  card.addEventListener("pointerdown", function (e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    card.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

(function initTabs() {
  const btns = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-pane");
  btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const target = this.dataset.tab;
      btns.forEach((b) => b.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
      const pane = document.getElementById("tab-" + target);
      if (pane) {
        pane.classList.add("active");
        pane.querySelectorAll(".reveal,.info-card").forEach((el) => {
          el.classList.remove("visible");
          setTimeout(() => el.classList.add("visible"), 80);
        });
        pane.querySelectorAll(".sal-bar").forEach((bar, i) => {
          bar.classList.remove("animate");
          setTimeout(() => bar.classList.add("animate"), 300 + i * 100);
        });
        pane.querySelectorAll(".counter").forEach((c) => {
          c.textContent = "0";
          setTimeout(() => animateCounter(c), 200);
        });
      }
    });
  });
})();

(function initParallax() {
  const orb1 = document.querySelector(".hero-orb-1");
  const orb2 = document.querySelector(".hero-orb-2");
  if (!orb1 || !orb2) return;
  document.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2,
      cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx,
      dy = (e.clientY - cy) / cy;
    orb1.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
    orb2.style.transform = `translate(${-dx * 22}px, ${-dy * 16}px)`;
  });
})();

(function initScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top-btn";
  btn.innerHTML = "↑";
  btn.title = "Lên đầu trang";
  document.body.appendChild(btn);
  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("show", window.scrollY > 400);
    },
    { passive: true },
  );
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

(function initTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".info-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();
