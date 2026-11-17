/* ==========================================
   RASHMI & AMAN — GARDEN OF ROMANCE
   Invitation interactions + MP3 background music
========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const openButton = document.getElementById("openInvitation");
  const sealButton = document.getElementById("waxSeal");
  const openingScreen = document.getElementById("opening");
  const envelopeScene = document.getElementById("envelopeScene");
  const invitation = document.getElementById("invitation");
  const openingHint = document.getElementById("openingHint");

  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");
  const backgroundMusic = document.getElementById("backgroundMusic");

  const countdownMessage = document.getElementById("countdownMessage");
  let invitationOpened = false;

  // ========================================
  // 1. BACKGROUND MP3 MUSIC
  // Starts from the visitor's opening click.
  // ========================================

  function updateMusicButton(isPlaying) {
    musicToggle.classList.toggle("playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause background music" : "Play background music"
    );
    musicIcon.textContent = "♫";
    musicLabel.textContent = isPlaying ? "Music On" : "Play Music";
  }

  async function startMusic() {
    if (!backgroundMusic) return;

    try {
      // Keep the song at a comfortable background level.
      backgroundMusic.volume = 0.55;
      await backgroundMusic.play();
      updateMusicButton(true);
    } catch (error) {
      // Some browsers may block playback; the visible music button
      // remains available for another user-initiated attempt.
      console.warn("Background music could not start:", error);
      updateMusicButton(false);
      musicLabel.textContent = "Tap to Play";
    }
  }

  function pauseMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.pause();
    updateMusicButton(false);
  }

  musicToggle.addEventListener("click", () => {
    if (backgroundMusic.paused) {
      startMusic();
    } else {
      pauseMusic();
    }
  });

  // Keep the button state accurate if playback is interrupted externally.
  backgroundMusic.addEventListener("play", () => updateMusicButton(true));
  backgroundMusic.addEventListener("pause", () => updateMusicButton(false));
  backgroundMusic.addEventListener("ended", () => {
    // The audio element is looped, but reset the UI if a browser ends it.
    updateMusicButton(false);
  });
  backgroundMusic.addEventListener("error", () => {
    musicLabel.textContent = "Audio unavailable";
    updateMusicButton(false);
    musicLabel.textContent = "Audio unavailable";
  });

  // ========================================
  // 2. ENVELOPE OPENING
  // Both wax seal and open button work.
  // ========================================

  function createSealSparkles() {
    const sealBounds = sealButton.getBoundingClientRect();
    const sceneBounds = envelopeScene.getBoundingClientRect();
    const centerX = sealBounds.left + sealBounds.width / 2 - sceneBounds.left;
    const centerY = sealBounds.top + sealBounds.height / 2 - sceneBounds.top;
    const colors = ["#fff1c2", "#d9b66f", "#fffaf0", "#d78d98"];

    for (let index = 0; index < 30; index++) {
      const sparkle = document.createElement("span");
      const angle = (Math.PI * 2 * index) / 30 + Math.random() * 0.12;
      const distance = 55 + Math.random() * 95;

      sparkle.className = "seal-sparkle";
      sparkle.setAttribute("aria-hidden", "true");
      sparkle.textContent = index % 3 === 0 ? "✧" : "✦";
      sparkle.style.left = `${centerX}px`;
      sparkle.style.top = `${centerY}px`;
      sparkle.style.setProperty("--sparkle-x", `${Math.cos(angle) * distance}px`);
      sparkle.style.setProperty("--sparkle-y", `${Math.sin(angle) * distance}px`);
      sparkle.style.setProperty("--sparkle-color", colors[index % colors.length]);
      sparkle.style.setProperty("--sparkle-size", `${14 + Math.random() * 14}px`);
      sparkle.style.setProperty("--sparkle-delay", `${index * 10}ms`);
      envelopeScene.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 1900);
    }
  }

  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    envelopeScene.classList.add("open");
    openButton.disabled = true;
    sealButton.disabled = true;
    openButton.innerHTML = "OPENING YOUR INVITATION...";
    openingHint.textContent = "A beautiful celebration awaits...";

    // This call happens directly from the visitor's click, allowing
    // browsers to permit audio playback after user interaction.
    startMusic();

    // Reveal the invitation after the envelope animation.
    setTimeout(() => {
      openingScreen.classList.add("exit");

      setTimeout(() => {
        openingScreen.classList.add("hidden");
        invitation.classList.remove("hidden");

        requestAnimationFrame(() => {
          invitation.classList.add("show");
        });

        createPetals();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1000);
    }, 3200);
  }

  sealButton.addEventListener("click", () => {
    createSealSparkles();
    openInvitation();
  });
  openButton.addEventListener("click", openInvitation);

  // ========================================
  // 3. LIVE WEDDING COUNTDOWN
  // 9 December 2026, India Standard Time
  // ========================================

  const weddingDate = new Date("2026-12-09T00:00:00+05:30").getTime();
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  function updateCountdown() {
    const difference = weddingDate - Date.now();

    if (difference <= 0) {
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      countdownMessage.textContent = "Today is the beautiful beginning of forever!";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    daysElement.textContent = String(days).padStart(3, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
    countdownMessage.textContent = "The celebration is getting closer...";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ========================================
  // 4. FALLING ROSE PETALS
  // ========================================

  let petalsStarted = false;

  function createPetals() {
    if (petalsStarted) return;
    petalsStarted = true;

    const container = document.getElementById("petals");
    if (!container) return;

    function addPetal() {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "vw";

      const duration = 6 + Math.random() * 7;
      petal.style.animationDuration = duration + "s";
      petal.style.opacity = 0.3 + Math.random() * 0.5;
      container.appendChild(petal);

      setTimeout(() => petal.remove(), duration * 1000);
    }

    for (let i = 0; i < 12; i++) {
      setTimeout(addPetal, i * 250);
    }

    setInterval(addPetal, 850);
  }
});
