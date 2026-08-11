/**
 * LÓGICA PRINCIPAL DE LA TARJETA DE INVITACIÓN INTERACTIVA
 * Sombra / Boda / 15 Años (Quinceañera)
 */

const onReady = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

onReady(() => {
  // 1. Cargar Datos y Tema desde config.js
  initEventData();

  // 2. Inicializar Event Listener para Apertura de Sobre
  initEnvelope();

  // 3. Inicializar Cuenta Regresiva
  initCountdown();

  // 4. Inicializar Galería Slider
  initGallerySlider();

  // 5. Inicializar Módulo de Música
  initMusicModule();

  // 6. Inicializar Formulario RSVP
  initRSVPForm();

  // 7. Inicializar Reproductor de Audio
  initAudioPlayer();
});

/* ==========================================================================
   1. INICIALIZACIÓN DE DATOS Y TEMAS DESDE CONFIG
   ========================================================================== */
function initEventData() {
  if (typeof EVENT_CONFIG === 'undefined') return;

  // Aplicar tema si es quinceañera o personalizado
  if (EVENT_CONFIG.theme === 'quinceanera') {
    document.body.classList.add('theme-quinceanera');
  }

  // Monograma y Títulos
  const monogramEl = document.getElementById('envelopeMonogram');
  if (monogramEl) {
    if (EVENT_CONFIG.monogramText) {
      monogramEl.textContent = EVENT_CONFIG.monogramText;
    } else {
      const initials = EVENT_CONFIG.hosts.split('&').map(name => name.trim()[0]).join('&');
      monogramEl.textContent = initials || 'V';
    }
  }

  const envelopeSubtitleEl = document.getElementById('envelopeSubtitle');
  if (envelopeSubtitleEl) {
    envelopeSubtitleEl.textContent = EVENT_CONFIG.title.toUpperCase();
  } else {
    const envelopeSubtitleFirst = document.getElementById('envelopeSubtitleFirst');
    const envelopeSubtitleSecond = document.getElementById('envelopeSubtitleSecond');
    if (envelopeSubtitleFirst && !envelopeSubtitleFirst.textContent.trim()) envelopeSubtitleFirst.textContent = 'MIS';
    if (envelopeSubtitleSecond && !envelopeSubtitleSecond.textContent.trim()) envelopeSubtitleSecond.textContent = 'AÑOS';
  }

  const envelopeTitleEl = document.getElementById('envelopeTitle');
  if (envelopeTitleEl) envelopeTitleEl.textContent = EVENT_CONFIG.hosts;

  const heroSubtitleEl = document.getElementById('heroSubtitle');
  if (heroSubtitleEl) heroSubtitleEl.textContent = EVENT_CONFIG.title.toUpperCase();
  document.getElementById('heroNames').textContent = EVENT_CONFIG.hosts;
  if (EVENT_CONFIG.subtitle) {
    document.getElementById('heroTagline').textContent = `"${EVENT_CONFIG.subtitle}"`;
  }

  // Detalles del Evento
  const formattedDateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const dateStr = EVENT_CONFIG.eventDate.toLocaleDateString('es-ES', formattedDateOptions);
  const capitalizedDateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  
  document.getElementById('detailDate').textContent = `${capitalizedDateStr} hs`;
  document.getElementById('detailVenue').textContent = EVENT_CONFIG.location.name;
  document.getElementById('detailAddress').textContent = EVENT_CONFIG.location.address;
  document.getElementById('detailDresscode').textContent = EVENT_CONFIG.dresscode;

  // Enlace a Google Maps
  const mapsBtn = document.getElementById('btnGoogleMaps');
  if (mapsBtn && EVENT_CONFIG.location.googleMapsUrl) {
    mapsBtn.href = EVENT_CONFIG.location.googleMapsUrl;
  }

  // Enlace a Google Drive
  const driveBtn = document.getElementById('btnDriveUpload');
  if (driveBtn && EVENT_CONFIG.googleDriveUploadUrl) {
    driveBtn.href = EVENT_CONFIG.googleDriveUploadUrl;
  }

  // Enlace al formulario de fotos
  const photoFormBtn = document.getElementById('btnPhotoForm');
  if (photoFormBtn && EVENT_CONFIG.googlePhotoFormUrl) {
    photoFormBtn.href = EVENT_CONFIG.googlePhotoFormUrl;
  }

  // Enlace a Calendario de Google
  const calendarBtn = document.getElementById('btnAddToCalendar');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', createGoogleCalendarEvent);
  }
}

/* ==========================================================================
   2. APERTURA DE SOBRE / BIENVENIDA
   ========================================================================== */
function openInvitation() {
  const overlay = document.getElementById('envelopeOverlay');
  if (!overlay || overlay.classList.contains('opened')) return;

  overlay.classList.add('opened');
  overlay.style.pointerEvents = 'none';
  overlay.style.display = 'none';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 800);

  playBackgroundMusic();
  document.querySelector('.app-viewport')?.scrollIntoView({ behavior: 'smooth' });

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      colors: EVENT_CONFIG && EVENT_CONFIG.theme === 'quinceanera'
        ? ['#f7aef8', '#ff4d6d', '#ffd166', '#ffffff']
        : undefined,
      origin: { y: 0.6 }
    });
  }
}

window.openInvitation = openInvitation;

function initEnvelope() {
  const btnOpen = document.getElementById('btnOpenEnvelope');
  const monogram = document.getElementById('envelopeMonogram');

  if (btnOpen) btnOpen.addEventListener('click', openInvitation);
  if (monogram) monogram.addEventListener('click', openInvitation);
}

/* ==========================================================================
   3. CUENTA REGRESIVA EN TIEMPO REAL
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  function updateTimer() {
    const now = new Date().getTime();
    const target = EVENT_CONFIG.eventDate.getTime();
    const diff = target - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. GALERÍA SLIDER PREVIA
   ========================================================================== */
function initGallerySlider() {
  const photos = EVENT_CONFIG.galleryPhotos || [];
  if (photos.length === 0) return;

  const heroImg = document.getElementById('heroImg');
  let currentIndex = 0;
  const placeholders = ['images/placeholder1.svg', 'images/placeholder2.svg'];

  const setHeroSrc = (src, fallbackIdx = 0) => {
    if (!heroImg) return;
    const tmp = new Image();
    tmp.onload = () => {
      heroImg.style.opacity = '0';
      setTimeout(() => {
        heroImg.src = src;
        heroImg.style.opacity = '1';
      }, 200);
    };
    tmp.onerror = () => {
      const fb = placeholders[fallbackIdx % placeholders.length];
      heroImg.style.opacity = '0';
      setTimeout(() => {
        heroImg.src = fb;
        heroImg.style.opacity = '1';
      }, 200);
    };
    tmp.src = src;
  };

  // initial
  setHeroSrc(photos[0], 0);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % photos.length;
    setHeroSrc(photos[currentIndex], currentIndex);
  }, 10000);
}

/* ==========================================================================
   5. MÓDULO DE MÚSICA (SUGERENCIA Y LISTA)
   ========================================================================== */
const STORAGE_KEY_SONGS = 'invitation_songs_list_15_v1';

function initMusicModule() {
  const musicForm = document.getElementById('musicForm');
  const songNameInput = document.getElementById('songName');
  const artistNameInput = document.getElementById('artistName');
    const btnOpenMusicForm = document.getElementById('btnOpenMusicForm');

  let songs = getStoredSongs();

  renderSongs(songs);

  if (musicForm) {
    musicForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const song = songNameInput.value.trim();
      const artist = artistNameInput.value.trim();

      if (!song || !artist) return;

      // If a Google Form URL is configured, redirect there (supports placeholders {song} and {artist})
      if (typeof EVENT_CONFIG !== 'undefined' && EVENT_CONFIG.musicFormUrl && EVENT_CONFIG.musicFormUrl.trim()) {
        let url = EVENT_CONFIG.musicFormUrl;
        try {
          url = url.replace('{song}', encodeURIComponent(song)).replace('{artist}', encodeURIComponent(artist));
        } catch (err) {
          // ignore replacement errors and use raw URL
        }
        window.open(url, '_blank');
        if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        songNameInput.value = '';
        artistNameInput.value = '';
        return;
      }

      // Fallback: save locally (existing behavior)
      const newSong = {
        id: Date.now(),
        song,
        artist,
        likes: 1
      };

      songs.unshift(newSong);
      saveSongs(songs);
      renderSongs(songs);

      songNameInput.value = '';
      artistNameInput.value = '';

      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
    });
  }

    // If the standalone button exists, open the Google Form or fallback behavior
    if (btnOpenMusicForm) {
      btnOpenMusicForm.addEventListener('click', () => {
        if (typeof EVENT_CONFIG !== 'undefined' && EVENT_CONFIG.musicFormUrl && EVENT_CONFIG.musicFormUrl.trim()) {
          window.open(EVENT_CONFIG.musicFormUrl, '_blank');
          return;
        }

        // Fallback: try to open the existing music form if present
        if (musicForm) {
          // show a simple prompt to collect song/artist and reuse existing submit flow
          const song = prompt('Nombre de la canción (ej: Automático)');
          if (!song) return;
          const artist = prompt('Artista / Banda (ej: Maria Becerra)');
          if (!artist) return;
          // Attempt to reuse previous submit logic by populating inputs and submitting
          if (songNameInput) songNameInput.value = song;
          if (artistNameInput) artistNameInput.value = artist;
          musicForm.dispatchEvent(new Event('submit', { cancelable: true }));
        } else {
          alert('Formulario de canciones no disponible.');
        }
      });
    }
}

function getStoredSongs() {
  const data = localStorage.getItem(STORAGE_KEY_SONGS);
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  // Canciones sugeridas para fiesta de 15 por defecto
  return [
    { id: 1, song: "Automático", artist: "Maria Becerra", likes: 12 },
    { id: 2, song: "Lala", artist: "Myke Towers", likes: 9 },
    { id: 3, song: "Prohibidox", artist: "Feid", likes: 7 }
  ];
}

function saveSongs(songs) {
  localStorage.setItem(STORAGE_KEY_SONGS, JSON.stringify(songs));
}

function renderSongs(songs) {
  const container = document.getElementById('songsList');
  if (!container) return;

  if (songs.length === 0) {
    container.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 10px;">¡Sé el primero en pedir un tema para el DJ!</p>`;
    return;
  }

  container.innerHTML = songs.map(item => `
    <div class="song-item">
      <div class="song-details">
        <h5>${escapeHtml(item.song)}</h5>
        <p>${escapeHtml(item.artist)}</p>
      </div>
      <button class="song-like-btn" onclick="likeSong(${item.id})">
        <i class="fa-solid fa-heart"></i> <span>${item.likes || 1}</span>
      </button>
    </div>
  `).join('');
}

window.likeSong = function(id) {
  let songs = getStoredSongs();
  songs = songs.map(s => {
    if (s.id === id) s.likes = (s.likes || 0) + 1;
    return s;
  });
  saveSongs(songs);
  renderSongs(songs);
};

/* ==========================================================================
   6. RSVP VIA WHATSAPP
   ========================================================================== */
function initRSVPForm() {
  const rsvpForm = document.getElementById('rsvpForm');
  if (!rsvpForm) return;

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const attendance = document.getElementById('attendanceSelect').value;
    const dietary = document.getElementById('dietaryInput').value.trim();
    const message = document.getElementById('rsvpMessage').value.trim();

    if (!name) return;

      let waMessage = `Hola ${EVENT_CONFIG.hosts}, soy ${name}.\n`;
      waMessage += `Asistencia: ${attendance}\n`;
      if (dietary) waMessage += `Restricción alimentaria: ${dietary}\n`;
      if (message) waMessage += `Mensaje: ${message}\n`;
      // Mensaje enviado desde la tarjeta de invitación de mis 15
      // Nota: no se envía automáticamente; el usuario debe confirmar el envío en WhatsApp.

    const encodedMessage = encodeURIComponent(waMessage);
    const phone = EVENT_CONFIG.whatsappNumber || '';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

      // Abrir WhatsApp Web / App con el mensaje precompletado.
      window.open(whatsappUrl, '_blank');

    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   7. REPRODUCTOR DE MÚSICA Y AGENDAR EN CALENDARIO
   ========================================================================== */
let audioPlaying = false;

function initAudioPlayer() {
  const bgAudio = document.getElementById('bgAudio');
  const btnToggle = document.getElementById('btnToggleAudio');

  if (bgAudio && EVENT_CONFIG.backgroundMusicUrl) {
    bgAudio.querySelector('source').src = EVENT_CONFIG.backgroundMusicUrl;
    bgAudio.load();
  }

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      if (audioPlaying) {
        pauseBackgroundMusic();
      } else {
        playBackgroundMusic();
      }
    });
  }
}

function playBackgroundMusic() {
  const bgAudio = document.getElementById('bgAudio');
  const btnToggle = document.getElementById('btnToggleAudio');

  if (bgAudio && EVENT_CONFIG.backgroundMusicUrl) {
    bgAudio.play().then(() => {
      audioPlaying = true;
      if (btnToggle) btnToggle.classList.add('playing');
    }).catch(err => {
      console.log('Autoplay bloqueado por el navegador.');
    });
  }
}

function pauseBackgroundMusic() {
  const bgAudio = document.getElementById('bgAudio');
  const btnToggle = document.getElementById('btnToggleAudio');

  if (bgAudio) {
    bgAudio.pause();
    audioPlaying = false;
    if (btnToggle) btnToggle.classList.remove('playing');
  }
}

function createGoogleCalendarEvent() {
  const title = encodeURIComponent(`${EVENT_CONFIG.title}: ${EVENT_CONFIG.hosts}`);
  const details = encodeURIComponent(`¡Acompáñanos a celebrar los 15 de ${EVENT_CONFIG.hosts}! Ubicación: ${EVENT_CONFIG.location.name}`);
  const location = encodeURIComponent(EVENT_CONFIG.location.address);

  const startDate = EVENT_CONFIG.eventDate;
  const endDate = new Date(startDate.getTime() + (6 * 60 * 60 * 1000));

  const formatCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const dates = `${formatCalDate(startDate)}/${formatCalDate(endDate)}`;
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

  window.open(calUrl, '_blank');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
