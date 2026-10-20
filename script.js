// CHAKA STORE — JavaScript website dan Music Player PRO

document.getElementById("year").textContent = new Date().getFullYear();
const CHAKA_WA_NUMBER = "6282187552664"; // Nomor admin: 082187552664
const CHAKA_DISCORD_SUPPORT = "https://discord.gg/hYV749ckgm";
document.querySelectorAll("[data-order]").forEach((button) => {
  button.addEventListener("click", async () => {
    const card = button.closest("[data-product]");
    const productName = card?.dataset.product || "Produk Chaka Store";
    const message = `Halo Admin Chaka Store, saya ingin memesan: ${productName}.

Mohon info harga dan ketersediaannya. Terima kasih!`;
    if (button.dataset.order === "whatsapp") {
      const url = `https://wa.me/${CHAKA_WA_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      alert(`Pesan untuk ${productName} sudah disalin. Tempelkan pesan tersebut di Discord Support setelah server terbuka.`);
    } catch (error) {
      alert(`Produk yang dipilih: ${productName}. Saat Discord terbuka, sampaikan bahwa kamu ingin memesan produk ini.`);
    }
    window.open(CHAKA_DISCORD_SUPPORT, "_blank", "noopener,noreferrer");
  });
});

// ===== Script asli dipindahkan dari index.html =====
(() => {
  "use strict";
  const tracks = [
    { title: "BREAKBEAT AFTERSHOCK SHELTER", artist: "Pelik Pungki", src: "./lagu-1.mp3", glyph: "✦", colors: ["#ff3478", "#9e45ff"] },
    { title: "DJ IN YOUR EYES", artist: "DJ Mariana Lopes Carvalho", src: "./lagu-2.mp3", glyph: "◈", colors: ["#ff4eaa", "#713bff"] },
    { title: "Black Hole", artist: "DJ Teloor", src: "./lagu-3.mp3", glyph: "◉", colors: ["#9c5bff", "#ff3478"] }
  ];
  const $ = (id) => document.getElementById(id);
  const player = $("chaka-music-player"), audio = $("chaka-audio"), status = $("music-status"), playButton = $("music-play");
  const progress = $("music-progress"), currentTime = $("music-current-time"), duration = $("music-duration");
  const titleEl = $("mp-track-title"), artistEl = $("mp-artist"), cover = $("mp-cover"), glyph = $("mp-cover-glyph");
  const playlistButtons = [...document.querySelectorAll("#mp-playlist [data-track]")];
  const shuffleButton = $("music-shuffle"), repeatButton = $("music-repeat"), volume = $("music-volume");
  let current = 0, shuffle = false, repeat = false, playWhenReady = false, audioContext = null, analyser = null, sourceNode = null, visualFrame = 0;
  const formatTime = (s) => Number.isFinite(s) && s >= 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2,"0")}` : "0:00";
  function updateModes(){ shuffleButton.classList.toggle("active",shuffle); shuffleButton.setAttribute("aria-pressed",String(shuffle)); repeatButton.classList.toggle("active",repeat); repeatButton.setAttribute("aria-pressed",String(repeat)); }
  function updateTrackUI(){ const t=tracks[current]; titleEl.textContent=t.title; artistEl.textContent=t.artist; glyph.textContent=t.glyph; cover.style.background=`radial-gradient(circle at 25% 20%, ${t.colors[0]} 0, transparent 34%),radial-gradient(circle at 78% 78%,${t.colors[1]} 0,transparent 44%),linear-gradient(135deg,#27123f,#090812 70%)`; playlistButtons.forEach((b,i)=>{b.setAttribute("aria-current",String(i===current)); const n=b.querySelector(".mp-item-num"); if(n)n.textContent=i===current&& !audio.paused?"♫":String(i+1).padStart(2,"0");}); }
  function selectTrack(index,autoplay=false){ current=(index+tracks.length)%tracks.length; playWhenReady=autoplay; audio.pause(); audio.src=tracks[current].src; audio.load(); updateTrackUI(); status.textContent=`Lagu ${current+1}/3 · ${tracks[current].title} — ${tracks[current].artist}`; progress.value=0; currentTime.textContent="0:00"; duration.textContent="0:00"; playButton.textContent="▶ Play"; player.classList.remove("is-playing"); }
  function nextIndex(){ if(shuffle && tracks.length>1){let n=current;while(n===current)n=Math.floor(Math.random()*tracks.length);return n;}return (current+1)%tracks.length; }
  function setupVisualizer(){ const canvas=$("mp-visualizer"),ctx=canvas.getContext("2d"); if(!ctx)return; const draw=()=>{visualFrame=requestAnimationFrame(draw); const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2); const w=Math.max(1,Math.floor(rect.width*dpr)),h=Math.max(1,Math.floor(rect.height*dpr)); if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;} ctx.clearRect(0,0,w,h); const bars=48,gap=2*dpr,bw=(w-gap*(bars-1))/bars; let data=null;if(analyser&& !audio.paused){data=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(data);} for(let i=0;i<bars;i++){let amp=data?data[Math.floor(i*data.length/bars)]/255:(audio.paused?.08:.12+Math.abs(Math.sin(Date.now()/210+i*.66))*.5);let bh=Math.max(2*dpr,amp*(h*.88));let x=i*(bw+gap),y=(h-bh)/2;let grad=ctx.createLinearGradient(0,y,0,y+bh);grad.addColorStop(0,"#ff69b4");grad.addColorStop(1,"#9c4dff");ctx.fillStyle=grad;ctx.globalAlpha=audio.paused?.45:.95;ctx.beginPath();const r=Math.min(bw/2,2*dpr);ctx.roundRect?ctx.roundRect(x,y,bw,bh,r):ctx.rect(x,y,bw,bh);ctx.fill();}ctx.globalAlpha=1;};draw(); }
  async function ensureAudioGraph(){ if(!audioContext){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{audioContext=new AC();analyser=audioContext.createAnalyser();analyser.fftSize=128;analyser.smoothingTimeConstant=.78;sourceNode=audioContext.createMediaElementSource(audio);sourceNode.connect(analyser);analyser.connect(audioContext.destination);}catch(e){audioContext=null;analyser=null;}} if(audioContext&&audioContext.state==="suspended")try{await audioContext.resume();}catch(e){} }
  async function startPlayback(){playWhenReady=true;try{await ensureAudioGraph();await audio.play();}catch(error){playWhenReady=false;playButton.textContent="▶ Play";status.textContent="Tidak bisa memutar lagu. Pastikan file MP3 tersedia di GitHub.";}}
  playButton.addEventListener("click",()=>{if(audio.paused)startPlayback();else{playWhenReady=false;audio.pause();}});
  $("music-prev").addEventListener("click",()=>selectTrack(current-1,true)); $("music-next").addEventListener("click",()=>selectTrack(nextIndex(),true));
  playlistButtons.forEach(b=>b.addEventListener("click",()=>selectTrack(Number(b.dataset.track),true)));
  shuffleButton.addEventListener("click",()=>{shuffle=!shuffle;updateModes();status.textContent=shuffle?"Shuffle aktif · lagu berikutnya diacak.":`Lagu ${current+1}/3 · ${tracks[current].title}`;});
  repeatButton.addEventListener("click",()=>{repeat=!repeat;audio.loop=repeat;updateModes();status.textContent=repeat?"Repeat aktif · lagu ini akan diulang.":`Lagu ${current+1}/3 · ${tracks[current].title}`;});
  volume.addEventListener("input",()=>{audio.volume=Number(volume.value);$("music-volume-label").textContent=`${Math.round(audio.volume*100)}%`;}); audio.volume=Number(volume.value);
  audio.addEventListener("play",()=>{playButton.textContent="❚❚ Pause";status.textContent=`Memutar: ${tracks[current].title} — ${tracks[current].artist}`;player.classList.add("is-playing");updateTrackUI();});
  audio.addEventListener("pause",()=>{playButton.textContent="▶ Play";player.classList.remove("is-playing");updateTrackUI();});
  audio.addEventListener("loadedmetadata",()=>{duration.textContent=formatTime(audio.duration);});
  audio.addEventListener("timeupdate",()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)progress.value=(audio.currentTime/audio.duration)*100;currentTime.textContent=formatTime(audio.currentTime);});
  progress.addEventListener("input",()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=(Number(progress.value)/100)*audio.duration;});
  audio.addEventListener("canplay",()=>{if(playWhenReady && audio.paused)startPlayback();});
  audio.addEventListener("ended",()=>{if(repeat){audio.currentTime=0;startPlayback();return;}selectTrack(nextIndex(),true);});
  audio.addEventListener("error",()=>{playWhenReady=false;playButton.textContent="▶ Play";player.classList.remove("is-playing");status.textContent=`File tidak dapat dimuat: ${tracks[current].src}. Cek file MP3 di GitHub.`;});
  updateModes();selectTrack(0,false);setupVisualizer();
})();

// ===== Tombol buka/tutup Music Player =====
document.addEventListener("DOMContentLoaded", () => {
  const musicToggle = document.getElementById("music-toggle");
  const musicPlayer = document.getElementById("chaka-music-player");
  if (!musicToggle || !musicPlayer) return;

  musicToggle.addEventListener("click", () => {
    const isCollapsed = musicPlayer.classList.toggle("is-collapsed");
    musicToggle.textContent = isCollapsed ? "♫ Buka Player" : "▼ Tutup";
    musicToggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
});
