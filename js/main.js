/* CHAKA STORE — interaksi website, Appearance, dan Music Player PRO */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const defaults = {
    bg:"#09070d", panel:"#14101b", text:"#fbf8ff", muted:"#b4aabb", line:"#ffffff",
    red:"#ff3159", pink:"#ff78a1", purple:"#a23bff", link:"#ff8da8",
    button:"#ff3159", sidebar:"#0c0812", sidebarOpacity:88
  };
  const presets = {
    default:{...defaults},
    purple:{...defaults,bg:"#080711",panel:"#151027",red:"#8b5cf6",pink:"#c4b5fd",purple:"#6d28d9",link:"#c4b5fd",button:"#7c3aed",sidebar:"#100b20"},
    red:{...defaults,bg:"#100609",panel:"#241017",red:"#ef233c",pink:"#ff758f",purple:"#c9184a",link:"#ff8fa3",button:"#e01e37",sidebar:"#18070d"},
    light:{...defaults,bg:"#f4f2f8",panel:"#ffffff",text:"#21172b",muted:"#685d70",line:"#6b6074",red:"#d7265e",pink:"#c026d3",purple:"#7c3aed",link:"#a21caf",button:"#d7265e",sidebar:"#ffffff",sidebarOpacity:94}
  };
  const storageKey="chaka-store-appearance-v2";
  const panel=$("chaka-appearance-panel"), openButton=$("chaka-appearance-open");
  const colorInputs=[...(panel?.querySelectorAll("[data-appearance-color]")||[])];
  const opacity=$("appearance-opacity"), opacityValue=$("appearance-opacity-value"), feedback=$("appearance-feedback");

  function applyTheme(settings, syncInputs=true){
    Object.entries(settings).forEach(([key,value])=>{
      if(key==="sidebarOpacity"){
        root.style.setProperty("--appearance-sidebar-opacity",`${value}%`);
        if(syncInputs&&opacity)opacity.value=String(value);
        if(syncInputs&&opacityValue)opacityValue.textContent=`${value}%`;
      } else if(Object.hasOwn(defaults,key)){
        root.style.setProperty(`--appearance-${key}`,value);
        if(syncInputs){const input=colorInputs.find(el=>el.dataset.appearanceColor===key);if(input)input.value=value;}
      }
    });
  }
  function readSettings(){
    const result={};
    colorInputs.forEach(el=>result[el.dataset.appearanceColor]=el.value);
    result.sidebarOpacity=Number(opacity?.value??defaults.sidebarOpacity);
    return result;
  }
  function say(message){if(feedback)feedback.textContent=message;}
  function togglePanel(show){
    if(!panel||!openButton)return;
    panel.hidden=!show;openButton.setAttribute("aria-expanded",String(show));
    if(show)panel.querySelector('input[type="color"]')?.focus();
  }
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||"null");
    applyTheme(saved&&typeof saved==="object"?{...defaults,...saved}:defaults);
  } catch { applyTheme(defaults); }
  colorInputs.forEach(input=>input.addEventListener("input",()=>{
    root.style.setProperty(`--appearance-${input.dataset.appearanceColor}`,input.value);
    say("Pratinjau aktif. Tekan Simpan warna untuk menyimpan pilihan.");
  }));
  opacity?.addEventListener("input",()=>{
    root.style.setProperty("--appearance-sidebar-opacity",`${opacity.value}%`);
    if(opacityValue)opacityValue.textContent=`${opacity.value}%`;
  });
  panel?.querySelectorAll("[data-appearance-preset]").forEach(btn=>btn.addEventListener("click",()=>{
    applyTheme(presets[btn.dataset.appearancePreset]||defaults);
    say(`Preset ${btn.textContent.trim()} diterapkan. Tekan Simpan warna untuk menyimpan.`);
  }));
  openButton?.addEventListener("click",()=>togglePanel(panel.hidden));
  $("chaka-appearance-close")?.addEventListener("click",()=>togglePanel(false));
  $("chaka-appearance-save")?.addEventListener("click",()=>{
    try{localStorage.setItem(storageKey,JSON.stringify(readSettings()));say("Warna berhasil disimpan di browser ini.");}
    catch{say("Warna diterapkan, tetapi penyimpanan browser tidak tersedia.");}
  });
  $("chaka-appearance-reset")?.addEventListener("click",()=>{
    applyTheme(defaults);try{localStorage.removeItem(storageKey);}catch{}
    say("Warna kembali ke tema CHAKA STORE.");
  });
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel&&!panel.hidden)togglePanel(false);});

  // Product order buttons retained.
  const WA_NUMBER="6282187552664", DISCORD_SUPPORT="https://discord.gg/hYV749ckgm";
  document.querySelectorAll("[data-order]").forEach(button=>button.addEventListener("click",async()=>{
    const card=button.closest("[data-product]"), product=card?.dataset.product||"Produk Chaka Store";
    const message=`Halo Admin Chaka Store, saya ingin memesan: ${product}.\n\nMohon info harga dan ketersediaannya. Terima kasih!`;
    if(button.dataset.order==="whatsapp"){window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");return;}
    try{await navigator.clipboard.writeText(message);alert(`Pesan untuk ${product} disalin. Tempelkan di Discord Support.`);}
    catch{alert(`Sampaikan kepada admin bahwa kamu ingin memesan ${product}.`);}
    window.open(DISCORD_SUPPORT,"_blank","noopener,noreferrer");
  }));
  if($("year"))$("year").textContent=new Date().getFullYear();

  // Music Player PRO: playlist menggunakan MP3 asli dari assets/music; tidak ada audio demo.
  const audio=$("chaka-audio"), player=$("chaka-music-player");
  if(audio&&player){
    const tracks=[


const tracks = [
  {
    title: "DJ IN YOUR EYES",
    artist: "DJ Mariana Lopes Carvalho",
    src: "music/lagu-2.mp3",
    glyph: "◈",
    colors: ["#ff4eaa", "#713bff"]
  },
  {
    title: "Black Hole",
    artist: "DJ Teloor",
    src: "music/lagu-3.mp3",
    glyph: "◉",
    colors: ["#9c5bff", "#ff3478"]
  }
];
      {title:"BREAKBEAT AFTERSHOCK SHELTER",artist:"Pelik Pungki",src:"assets/music/lagu-1.mp3",glyph:"✦",colors:["#ff3478","#9e45ff"]},
      {title:"DJ IN YOUR EYES",artist:"DJ Mariana Lopes Carvalho",src:"assets/music/lagu-2.mp3",glyph:"◈",colors:["#ff4eaa","#713bff"]},
      {title:"Black Hole",artist:"DJ Teloor",src:"assets/music/lagu-3.mp3",glyph:"◉",colors:["#9c5bff","#ff3478"]}
    ];
    const pagePrefix=location.pathname.includes("/pages/")?"../":"";
    const play=$("music-play"), status=$("music-status"), title=$("mp-track-title"), artist=$("mp-artist");
    const cover=$("mp-cover"), glyph=$("mp-cover-glyph"), progress=$("music-progress");
    const now=$("music-current-time"), duration=$("music-duration"), shuffleBtn=$("music-shuffle"), repeatBtn=$("music-repeat");
    const playlist=[...document.querySelectorAll("#mp-playlist [data-track]")];
    let current=0,shuffle=false,repeat=false,context=null,analyser=null,source=null,raf=0;
    const fmt=n=>Number.isFinite(n)&&n>=0?`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,"0")}`:"0:00";
    function render(){
      const t=tracks[current];title.textContent=t.title;artist.textContent=t.artist;glyph.textContent=t.glyph;
      cover.style.background=`radial-gradient(circle at 25% 20%,${t.colors[0]},transparent 45%),radial-gradient(circle at 78% 78%,${t.colors[1]},transparent 50%),#170e25`;
      playlist.forEach((b,i)=>{b.setAttribute("aria-current",String(i===current));const n=b.querySelector(".mp-item-num");if(n)n.textContent=i===current&&!audio.paused?"♫":String(i+1).padStart(2,"0");});
    }
    function select(i,autoplay=false){
      current=(i+tracks.length)%tracks.length;audio.pause();audio.src=pagePrefix+tracks[current].src;audio.load();render();
      play.textContent="▶ Play";player.classList.remove("is-playing");progress.value=0;now.textContent="0:00";duration.textContent="0:00";
      status.textContent=`Lagu ${current+1}/${tracks.length} · ${tracks[current].title}`;
      if(autoplay)start();
    }
    async function start(){
      try{
        if(!audio.src)select(current,false);
        if(window.AudioContext||window.webkitAudioContext){
          if(!context){context=new (window.AudioContext||window.webkitAudioContext)();analyser=context.createAnalyser();analyser.fftSize=128;source=context.createMediaElementSource(audio);source.connect(analyser);analyser.connect(context.destination);}
          if(context.state==="suspended")await context.resume();
        }
        await audio.play();play.textContent="❚❚ Pause";player.classList.add("is-playing");status.textContent=`Memutar · ${tracks[current].title}`;render();
      }catch(err){status.textContent="Klik Play untuk memulai audio. Jika gagal, periksa file assets/music.";console.error("CHAKA Music:",err);}
    }
    function stop(){audio.pause();play.textContent="▶ Play";player.classList.remove("is-playing");render();}
    function next(){
      let n=current;
      if(shuffle&&tracks.length>1){while(n===current)n=Math.floor(Math.random()*tracks.length);}
      else n=(current+1)%tracks.length;
      select(n,true);
    }
    play?.addEventListener("click",()=>audio.paused?start():stop());
    $("music-next")?.addEventListener("click",next);
    $("music-prev")?.addEventListener("click",()=>select(current===0?tracks.length-1:current-1,true));
    shuffleBtn?.addEventListener("click",()=>{shuffle=!shuffle;shuffleBtn.classList.toggle("active",shuffle);shuffleBtn.setAttribute("aria-pressed",String(shuffle));});
    repeatBtn?.addEventListener("click",()=>{repeat=!repeat;repeatBtn.classList.toggle("active",repeat);repeatBtn.setAttribute("aria-pressed",String(repeat));});
    $("music-volume")?.addEventListener("input",e=>audio.volume=Number(e.target.value));
    audio.volume=Number($("music-volume")?.value??.75);
    progress?.addEventListener("input",()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=(Number(progress.value)/100)*audio.duration;});
    audio.addEventListener("timeupdate",()=>{if(Number.isFinite(audio.duration)&&audio.duration>0){progress.value=String(audio.currentTime/audio.duration*100);now.textContent=fmt(audio.currentTime);duration.textContent=fmt(audio.duration);}});
    audio.addEventListener("ended",()=>{if(repeat){audio.currentTime=0;start();}else next();});
    audio.addEventListener("error",()=>{status.textContent="Audio gagal dimuat. Pastikan file MP3 tersedia di assets/music.";play.textContent="▶ Play";});
    playlist.forEach(btn=>btn.addEventListener("click",()=>select(Number(btn.dataset.track),true)));
    $("music-toggle")?.addEventListener("click",()=>{
      const collapsed=player.classList.toggle("is-collapsed"),btn=$("music-toggle");
      btn.textContent=collapsed?"♫ Buka Player":"▼ Tutup";btn.setAttribute("aria-expanded",String(!collapsed));
    });
    function visualizer(){
      const canvas=$("mp-visualizer"),ctx=canvas?.getContext("2d");if(!canvas||!ctx)return;
      const draw=()=>{raf=requestAnimationFrame(draw);const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.floor(canvas.clientWidth*dpr)),h=Math.max(1,Math.floor(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}ctx.clearRect(0,0,w,h);const count=42,gap=2*dpr,bw=(w-gap*(count-1))/count;let data=null;if(analyser&&!audio.paused){data=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(data);}for(let i=0;i<count;i++){const amp=data?data[Math.floor(i*data.length/count)]/255:(audio.paused?.08:.18+Math.abs(Math.sin(Date.now()/220+i*.7))*.45);const bh=Math.max(2*dpr,amp*h*.85),x=i*(bw+gap),y=(h-bh)/2,g=ctx.createLinearGradient(0,y,0,y+bh);g.addColorStop(0,"#ff69b4");g.addColorStop(1,"#9c4dff");ctx.fillStyle=g;ctx.fillRect(x,y,bw,bh);}};
      draw();
    }
    select(0,false);visualizer();
  }
})();
