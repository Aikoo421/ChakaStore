
const musicToggle = document.getElementById("music-toggle");
const musicPlayer = document.getElementById("chaka-music-player");

musicToggle.addEventListener("click", () => {
  const isCollapsed = musicPlayer.classList.toggle("is-collapsed");

  musicToggle.textContent = isCollapsed
    ? "♫ Buka Player"
    : "▼ Tutup";

  musicToggle.setAttribute(
    "aria-expanded",
    String(!isCollapsed)
  );
});
