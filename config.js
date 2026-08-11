// Configuración centralizada - Tarjeta de 15 Años (Quinceañera)
const EVENT_CONFIG = {
  theme: "quinceanera",
  title: "🩵Mis 15 Años",
  subtitle: "Estás invitado a festejar mi cumpleaños. Tu presencia es especial para mí en este día. ¡Te espero!",
  hosts: "Mia",
  monogramText: "XV",

  // Fecha del Evento
  eventDate: new Date(2026, 10, 27, 21, 30, 0),

  // Ubicación del Evento
  location: {
    name: "Salón Antares Dinamarca",
    address: "2623, Temperley",
    googleMapsUrl: "https://maps.google.com/?q=Sal%C3%B3n+Antares+Dinamarca+Temperley"
  },

  // Código de Vestimenta
  dresscode: "Elegante sport",

  // Google Drive para Fotos (solo lectura)
  googleDriveUploadUrl: "https://drive.google.com/drive/folders/1bOssc7bcw70NC3u4MvAUcaEtH-sY6mG0PZgVU8nWQCfcBJMCXIjwWMXtuNIjXssfSzK9d1Ya",
  // URL del Google Form para subir fotos
  googlePhotoFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfwwFLykZJS3Go70SMUOZWx7GWA_3HhgQagAmHgQVcuFW996A/viewform?usp=dialog",

  // URL del Google Form para sugerir canciones. Puede contener {song} y {artist}
  // Ejemplo (prefill):
  // "https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.1234567890={song}&entry.0987654321={artist}"
  musicFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdqMSfJT2jTtIfuTB9fbc5xhPNK3CRjpVLsZj3rcyC8YlbjJQ/viewform?usp=dialog",

  // Música de Fondo (MP3)
  backgroundMusicUrl: "./images/photograph.mp3",

  // Galería de fotos previa
  galleryPhotos: [
    "./images/mia1.png",
    "./images/mia1.jpg"
    
  ]
};
