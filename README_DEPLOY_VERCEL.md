# Panduan Deploy Frontend (Next.js) ke Vercel

## Prasyarat
Backend FastAPI (`main.py`) **harus sudah live** di Render (atau platform lain) sebelum
langkah ini, karena frontend butuh URL publiknya. Ikuti `README_DEPLOY.md` dari paket
sebelumnya untuk itu.

## 1. Upload proyek ke GitHub
Kalau laptop kantor tidak ada Git, pakai cara upload manual lewat browser GitHub
(lihat penjelasan sebelumnya): buat repo baru, lalu upload folder ini
(`app/`, `package.json`, `next.config.js`, `.gitignore`) — **jangan upload folder
`node_modules` atau `.next`** kalau ada, itu akan dibuat ulang otomatis oleh Vercel.

## 2. Import ke Vercel
1. Buka [vercel.com](https://vercel.com), daftar/login dengan akun GitHub.
2. Klik **Add New... → Project**.
3. Pilih repository yang baru kamu buat, klik **Import**.
4. Vercel otomatis mendeteksi ini sebagai proyek Next.js — tidak perlu ubah
   Build Command atau Output Directory apa pun.

## 3. Set Environment Variable (langkah paling penting)
Sebelum klik Deploy, buka bagian **Environment Variables** di form import, tambahkan:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://insurance-lapse-api.onrender.com/predict` (ganti dengan URL backend Render-mu, wajib akhiran `/predict`) |

Kalau langkah ini terlewat, frontend akan mencoba menghubungi `http://127.0.0.1:8000/predict`
(localhost) dari browser pengunjung — yang pasti gagal karena browser mereka tidak
punya backend lokal itu.

## 4. Deploy
Klik **Deploy**. Proses build biasanya selesai dalam 1–2 menit. Setelah selesai,
Vercel memberi URL publik seperti `https://insurance-lapse-frontend.vercel.app`.

## 5. Uji end-to-end
1. Buka beberapa menit sebelumnya URL backend Render supaya "bangun" dari idle
   (lihat catatan cold start di panduan backend).
2. Buka URL Vercel, isi form, klik **Analisis risiko lapse**.
3. Kalau muncul panel hasil dengan tier risiko dan rekomendasi tindakan, deployment berhasil.

## Perbedaan penting dibanding versi Streamlit
| Aspek | Streamlit (lama) | Next.js di Vercel (baru) |
|---|---|---|
| Hosting | Harus di Render/Railway/HF Spaces (proses persisten) | Vercel (serverless, native) |
| Cold start | Ya, backend & frontend sama-sama tidur | Hanya backend yang tidur; frontend Vercel selalu responsif instan |
| Env var API URL | `API_URL` (dibaca server-side Python) | `NEXT_PUBLIC_API_URL` (wajib prefix `NEXT_PUBLIC_`, dibaca browser) |
| Update tampilan | Ubah `frontend.py`, restart proses | Ubah `app/page.js`/`globals.css`, git push, Vercel auto-redeploy |

Catatan: karena frontend Vercel tidak pernah sleep, tapi backend Render tetap sleep,
pengunjung bisa saja membuka halaman form dengan mulus lalu mengalami jeda 10–50 detik
saat menekan submit (backend baru bangun). Ini bukan bug — hanya backend, bukan
frontend, yang punya batasan free-tier cold start.
