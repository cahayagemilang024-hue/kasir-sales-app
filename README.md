# Aplikasi Kasir dan Sales Lapangan

Proyek ini adalah aplikasi web kasir dan sales lapangan yang bisa berjalan offline dan diakses di HP.

## Cara Akses Simpel
- **Offline di PC**: Klik ganda `index.html` untuk buka di browser.
- **Server Lokal**: Klik ganda `run_server.bat` (jika Python terinstall) untuk start server di port 8000.
- **Di HP (lokal)**: Gunakan app "Web Server for Chrome" (install dari Play Store/App Store). Pilih folder proyek, start server, akses via IP di browser HP.
- **Install sebagai App**: Di browser mendukung PWA (Chrome/Edge), klik "Install" saat akses via server lokal.

## Fitur
- Offline support dengan service worker.
- Data tersimpan di localStorage (real-time).
- Responsive untuk HP dan desktop.

## Struktur folder
- `index.html` — Halaman utama.
- `styles.css` — Styling.
- `script.js` — Logika.
- `manifest.json` — Konfigurasi PWA.
- `sw.js` — Service worker untuk offline.
- `icon-*.png` — Ikon PWA (ganti dengan gambar asli).

