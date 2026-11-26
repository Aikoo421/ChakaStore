/* CHAKA STORE — extras.js (Tahap 4–6): tombol mengambang, animasi, statistik Discord live */
(() => {
  "use strict";
  const WA_NUMBER = "6282187552664";            // sama dengan js/main.js
  const DISCORD_INVITE = "PDCAgvpPJu";          // invite server utama
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Tombol mengambang: WhatsApp + kembali ke atas ---------- */
  function floats() {
    const wrap = document.createElement("div");
    wrap.className = "cs-float";
    const msg = encodeURIComponent("Halo Admin Chaka Store, saya ingin bertanya tentang produk.");
    wrap.innerHTML =
      `<a class="cs-fab cs-wa" href="https://wa.me/${WA_NUMBER}?text=${msg}" target="_blank" rel="noopener noreferrer" aria-label="Chat admin lewat WhatsApp">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
         <span>Chat Admin</span></a>
       <button class="cs-fab cs-top" type="button" aria-label="Kembali ke atas">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg></button>`;
    document.body.appendChild(wrap);
    const top = wrap.querySelector(".cs-top");
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
    // taruh tombol tepat di atas Music Player (yang tingginya berubah saat dibuka/ditutup)
    const player = document.getElementById("chaka-music-player");
    if (player) {
      if (!player.classList.contains("is-collapsed")) {
        player.classList.add("is-collapsed");           // player tertutup dulu agar tidak menutupi konten; klik "Buka Player" untuk memutar
        const t = document.getElementById("music-toggle");
        if (t) { t.textContent = "♫ Buka Player"; t.setAttribute("aria-expanded", "false"); }
      }
      const place = () => { wrap.style.bottom = Math.round(innerHeight - player.getBoundingClientRect().top + 12) + "px"; };
      if ("ResizeObserver" in window) new ResizeObserver(place).observe(player);
      addEventListener("resize", place); place();
    }
    return top;
  }

  /* ---------- Progress scroll + tombol atas ---------- */
  function scrollUi(topBtn) {
    const bar = document.createElement("div");
    bar.id = "cs-progress";
    document.body.appendChild(bar);
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0) + "%";
      topBtn.classList.toggle("show", h.scrollTop > 500);
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Animasi muncul saat scroll ---------- */
  function reveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const sel = ".section-head,.banner,.hero-grid>div,.profile,.stat-card,.badge-row,.testi-card,.step,.faq-item,.card,.product-card,.callout,.cat-tools,.x-head,.legal>*";
    const items = $$(sel).filter(el => !el.closest(".cat-grid"));
    if (!items.length) return;
    document.documentElement.classList.add("js-reveal");
    const idx = new Map();
    items.forEach(el => {
      const p = el.parentElement; const n = idx.get(p) || 0; idx.set(p, n + 1);
      el.style.setProperty("--rv-d", Math.min(n, 6) * 70 + "ms");
      el.classList.add("rv");
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; io.unobserve(el);
      el.classList.add("in");
      setTimeout(() => { el.classList.remove("rv", "in"); el.style.removeProperty("--rv-d"); }, 1100);
    }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(el => io.observe(el));
    // jaring pengaman: jangan pernah biarkan konten tersembunyi
    setTimeout(() => items.forEach(el => el.classList.remove("rv")), 6000);
  }

  /* ---------- Statistik Discord live (invite API publik) ---------- */
  async function discordLive() {
    const targets = $$("[data-discord]");
    if (!targets.length) return;
    try {
      let data = null;
      try { data = JSON.parse(sessionStorage.getItem("chaka-dc") || "null"); } catch {}
      if (!data || Date.now() - data.t > 5 * 60 * 1000) {
        const r = await fetch(`https://discord.com/api/v9/invites/${DISCORD_INVITE}?with_counts=true`, { cache: "no-store" });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const j = await r.json();
        data = { t: Date.now(), members: j.approximate_member_count, online: j.approximate_presence_count };
        try { sessionStorage.setItem("chaka-dc", JSON.stringify(data)); } catch {}
      }
      targets.forEach(el => {
        const v = data[el.dataset.discord];
        if (!Number.isFinite(v)) return;
        el.dataset.count = String(v);
        if (el.textContent.trim() !== "0") el.textContent = v.toLocaleString("id-ID");
        if (!el.hasAttribute("data-count")) el.textContent = v.toLocaleString("id-ID");
        const next = el.nextSibling;
        if (next && next.nodeType === 3 && next.textContent.trim() === "+") next.textContent = "";
        const badge = el.closest(".trust-badge");
        if (badge) badge.hidden = false;
      });
    } catch (err) {
      // gagal (offline / diblokir): angka cadangan di HTML tetap dipakai
      console.warn("CHAKA: statistik Discord tidak dapat dimuat", err);
    }
  }

  const topBtn = floats();
  scrollUi(topBtn);
  reveal();
  discordLive();
})();

/* ---------- Polish v4: cahaya mengikuti kursor di kartu (hanya mouse, hormati reduced-motion) ---------- */
(() => {
  "use strict";
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const SEL = ".card,.product-card,.link-card,.contact-card,.about-card,.stat-card,.testi-card,.step,.profile";
  let raf = 0;
  document.addEventListener("pointermove", (e) => {
    const host = e.target.closest ? e.target.closest(SEL) : null;
    if (!host) return;
    // kartu produk dibuat belakangan oleh catalog.js, jadi lapisan cahaya dipasang saat pertama disentuh
    if (!host.querySelector(":scope > .fx-glow")) {
      host.classList.add("fx-host");
      const g = document.createElement("span");
      g.className = "fx-glow";
      g.setAttribute("aria-hidden", "true");
      host.appendChild(g);
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = host.getBoundingClientRect();
      host.style.setProperty("--mx", (e.clientX - r.left) + "px");
      host.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }, { passive: true });
})();
