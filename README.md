# Dashboard PWA Laporan Harian Kepala Ruangan (RSU Surya Husadha)

Aplikasi ini jalan di GitHub Pages dan menyimpan setiap laporan ke Google Drive
(baris di Google Sheet + 1 Google Doc per ruang per hari).

## A. Pasang backend Google Drive (sekali saja, ±5 menit)
1. Buka Google Drive, buat **Google Sheet** baru, misalnya "Data Laporan Karu".
2. Menu **Extensions > Apps Script**. Hapus isi default, tempel isi file `Code.gs`.
3. Ganti `GANTI-KODE-RAHASIA` di baris pertama dengan kode buatan Anda sendiri.
4. Klik **Deploy > New deployment > Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik Deploy, setujui izin akses Drive/Sheets/Docs, lalu salin **Web app URL** (berakhiran `/exec`).
6. Folder "Laporan Harian Kepala Ruangan" akan dibuat otomatis di Drive saat laporan pertama masuk.

## B. Upload ke GitHub
1. Buat repository baru di GitHub (misalnya `lapor-karu`).
2. Upload semua file: `index.html`, `logo.png`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`
   (`Code.gs` dan README ini boleh ikut atau tidak).
3. Repository **Settings > Pages > Source: Deploy from a branch > main / (root) > Save**.
4. Tunggu 1-2 menit. Alamatnya: `https://USERNAME.github.io/lapor-karu/`

## C. Hubungkan aplikasi
1. Buka alamat tadi di HP/laptop, masuk tab **Pengaturan**.
2. Isi **URL Web App** dan **Kode rahasia** (sama dengan di Code.gs), lalu **Simpan & sinkron**.
3. Pasang ke layar utama ("Tambahkan ke layar utama" / "Install app").
Setiap kepala ruangan cukup melakukan langkah C di perangkatnya sendiri.

## Cara kerja
- Offline: laporan disimpan di perangkat, dikirim otomatis saat online ("menunggu kirim").
- Satu laporan per ruang per hari; mengisi ulang akan memperbarui laporan yang sama.
- Dashboard menampilkan 12 ruang: status lapor, pasien, BOR, ketenagaan, SKP, masalah, dan alkes.
- URL dan kode rahasia hanya tersimpan di perangkat, tidak ada di repository GitHub.
- Jika mengubah Code.gs: **Deploy > Manage deployments > Edit > New version**.
