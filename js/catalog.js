/* CHAKA STORE — catalog.js (Tahap 3): pencarian + filter + label di halaman katalog.
   EDIT daftar PRODUCTS di bawah: pop:true = label "Populer", isNew:true = "Baru", sold:true = "Stok habis". */
(() => {
  "use strict";
  const E = "https://cdn.discordapp.com/emojis/";
  const PRODUCTS = [
    // n=nama, c=kategori filter, t=tag kecil, d=deskripsi, h=halaman, i=id emoji (gambar)
    { n:"Netflix", c:"Streaming", t:"Streaming", d:"Paket Netflix premium.", h:"netflix.html", i:"1470029837002473564.webp?size=32", pop:true },
    { n:"Spotify", c:"Musik", t:"Musik", d:"Paket Spotify premium.", h:"spotify.html", i:"1420390465274122280.webp?size=32", pop:true },
    { n:"CapCut", c:"Editing", t:"Editing", d:"Paket CapCut premium.", h:"capcut.html", i:"1503443238265028713.webp?size=32", pop:true },
    { n:"Alight Motion", c:"Editing", t:"Editing", d:"Paket Alight Motion.", h:"alight-motion.html", i:"1503396609453588691.webp?size=44" },
    { n:"ChatGPT", c:"AI", t:"AI", d:"Paket ChatGPT.", h:"chatgpt.html", i:"1502905600210763837.webp?size=32" },
    { n:"Canva", c:"Desain", t:"Desain", d:"Paket Canva Pro.", h:"canva.html", i:"1470029912684630047.webp?size=32" },
    { n:"YouTube Premium", c:"Streaming", t:"Streaming", d:"Paket YouTube Premium.", h:"youtube-premium.html", i:"1502734451619266621.webp?size=32" },
    { n:"Prime Video", c:"Streaming", t:"Streaming", d:"Paket Prime Video.", h:"prime-video.html", i:"1503443380548538591.webp?size=44" },
    { n:"Disney+", c:"Streaming", t:"Streaming", d:"Paket Disney+.", h:"disney-plus.html", i:"1502791865030938765.webp?size=32" },
    { n:"iQIYI", c:"Streaming", t:"Streaming", d:"Paket iQIYI.", h:"iqiyi.html", i:"1503443667904364555.webp?size=32" },
    { n:"WeTV", c:"Streaming", t:"Streaming", d:"Paket WeTV.", h:"wetv.html", i:"1470029950747807927.webp?size=32" },
    { n:"Vidio", c:"Streaming", t:"Streaming", d:"Paket Vidio.", h:"vidio.html", i:"1503443906019463188.webp?size=44" },
    { n:"Apple Music", c:"Musik", t:"Musik", d:"Paket Apple Music.", h:"apple-music.html", i:"1503447273063846049.webp?size=44" },
    { n:"Discord Decoration & Bundle", c:"Discord", t:"Decoration", d:"Decoration, nameplate, profile effect, dan bundle.", h:"discord-decoration.html", i:"1502893656678600888.webp?size=32", },
    { n:"Discord Nitro", c:"Discord", t:"Nitro", d:"Paket Nitro dan promo.", h:"discord-nitro.html", i:"1470338861774409851.webp?size=32", pop:true },
    { n:"Akun Discord", c:"Discord", t:"Account", d:"Akun Discord berdasarkan tahun.", h:"discord-account.html", i:"1533334866073227386.webp?size=32" },
    { n:"Robux Roblox", c:"Game", t:"Top Up", d:"Pilihan nominal top up Robux Roblox.", h:"roblox.html", i:"1549220108529041450.webp?size=44" },
    { n:"Free Fire", c:"Game", t:"Top Up", d:"Top up Diamond, Membership Mingguan/Bulanan, dan Booyah Pass.", h:"free-fire.html", i:"1450494913106935840.webp?size=32", pop:true }
  ];
  const CATS = ["Semua", "Streaming", "Musik", "Editing", "AI", "Desain", "Discord", "Game"];

  const mount = document.getElementById("chaka-catalog-tools");
  if (!mount) return;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  mount.innerHTML = `
    <div class="x-kicker">CARI CEPAT</div>
    <h2 class="x-title">Semua produk</h2>
    <div class="cat-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.500-3.500"/></svg>
      <input id="cat-q" type="search" placeholder="Cari produk, mis. Netflix, Nitro, Free Fire…" autocomplete="off" aria-label="Cari produk">
    </div>
    <div class="cat-chips" id="cat-chips" role="group" aria-label="Filter kategori"></div>
    <div class="cat-count" id="cat-count" role="status" aria-live="polite"></div>
    <div class="product-grid cat-grid" id="cat-grid"></div>`;

  const q = mount.querySelector("#cat-q"), chips = mount.querySelector("#cat-chips"),
        count = mount.querySelector("#cat-count"), grid = mount.querySelector("#cat-grid");
  let active = "Semua";

  chips.innerHTML = CATS.map(c => `<button type="button" class="cat-chip" data-c="${c}" aria-pressed="${c === active}">${c}</button>`).join("");

  function card(p) {
    const badge = p.sold ? `<span class="pbadge sold">Stok habis</span>` : p.isNew ? `<span class="pbadge new">Baru</span>` : p.pop ? `<span class="pbadge">Populer</span>` : "";
    return `<a class="product-card split-category-card${p.sold ? " is-sold" : ""}" href="${p.h}">${badge}
      <div class="product-art roblox-art"><img alt="" loading="lazy" src="${E}${p.i}"><span></span></div>
      <span class="product-tag">${esc(p.t)}</span><h3>${esc(p.n)}</h3><p>${esc(p.d)}</p>
      <span class="order-btn">Lihat produk →</span></a>`;
  }
  function render() {
    const term = norm(q.value.trim());
    const list = PRODUCTS.filter(p => (active === "Semua" || p.c === active) &&
      (!term || norm(`${p.n} ${p.t} ${p.c} ${p.d}`).includes(term)));
    grid.innerHTML = list.map(card).join("");
    count.textContent = list.length ? `${list.length} produk ditemukan` : "";
    if (!list.length) {
      grid.innerHTML = `<div class="cat-empty" style="grid-column:1/-1">Produk “${esc(q.value)}” belum ada di daftar.<br>
        Coba kata lain, atau <a href="https://discord.gg/hYV749ckgm" target="_blank" rel="noopener noreferrer">tanya admin di Discord Support</a>.</div>`;
    }
  }
  q.addEventListener("input", render);
  chips.addEventListener("click", e => {
    const b = e.target.closest(".cat-chip"); if (!b) return;
    active = b.dataset.c;
    chips.querySelectorAll(".cat-chip").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    render();
  });
  const init = new URLSearchParams(location.search).get("q");
  if (init) q.value = init;
  render();
})();
