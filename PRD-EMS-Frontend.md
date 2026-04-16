# PRD — Event Management System (Frontend)

| Field | Value |
|---|---|
| **Document status** | Draft |
| **PRD type** | Product PRD |
| **Focus** | Frontend / UI-UX |
| **Last updated** | 2026-04-16 |
| **Target release** | MVP v1.0 |
| **Stack hint** | React / Next.js · Tailwind CSS · TypeScript |

> **Scope note:** PRD ini hanya mencakup kebutuhan UI/UX dan interaksi pengguna. Kontrak API, skema database, dan logika bisnis didokumentasikan di PRD-EMS-Backend.md.

---

## 2. Problem Statement

Event Organizer (EO) saat ini mengelola ticketing, pendaftaran peserta, dan pencairan dana melalui kombinasi spreadsheet, chat, dan platform terpisah. Tidak ada satu platform terpadu yang memungkinkan EO membuat event, mengelola kategori tiket, memantau penjualan, dan menarik dana — semuanya dalam satu antarmuka. Hasilnya: kesalahan data, waktu operasional tinggi, dan pengalaman peserta yang inkonsisten.

---

## 3. Goals

**Business goal:** EO dapat menyelesaikan seluruh siklus operasional event (buat → jual → cairkan) tanpa meninggalkan platform. Target: waktu setup event ≤ 10 menit dari halaman kosong hingga tiket live.

**User goal:** EO mendapat dashboard terpusat yang memberikan visibilitas real-time terhadap penjualan, peserta, dan saldo withdrawal — tanpa memerlukan pelatihan teknis.

**Non-goals:**
- Fitur live-streaming atau hybrid event
- Integrasi marketplace tiket pihak ketiga (Loket, Eventbrite)
- Aplikasi mobile native (iOS/Android) — MVP hanya web responsive
- Fitur multi-currency

---

## 4. User Personas

**Primary — Rina, Event Organizer (Solo/Tim Kecil)**
- Context: Mengelola 3–10 event/bulan, bekerja dari laptop, kadang via HP
- Motivation: Setup event cepat, pantau penjualan tiket real-time, tarik dana tepat waktu
- Pain point: Harus buka 3–4 tool berbeda untuk satu event; sering salah rekap data peserta

**Secondary — Admin Platform**
- Context: Memverifikasi data EO, mengelola withdrawal request
- Motivation: Proses approval efisien dengan data yang lengkap
- Pain point: Request withdrawal masuk via email/chat tanpa format standar

---

## 5. User Stories

| ID | User Story | Priority |
|---|---|---|
| US-01 | Sebagai EO, saya ingin mendaftar dan login ke platform sehingga akun saya aman dan terpisah dari EO lain. | P0 |
| US-02 | Sebagai EO, saya ingin membuat event baru dengan mengisi form detail (nama, tanggal, lokasi, banner) sehingga event saya bisa dipublikasikan. | P0 |
| US-03 | Sebagai EO, saya ingin menambahkan kategori tiket (nama, harga, kuota, tanggal buka/tutup) ke dalam event sehingga peserta dapat memilih tiket yang sesuai. | P0 |
| US-04 | Sebagai EO, saya ingin melihat dashboard penjualan tiket per event (total terjual, pendapatan, sisa kuota) sehingga saya dapat memantau performa event secara real-time. | P0 |
| US-05 | Sebagai EO, saya ingin melihat daftar peserta per event beserta status pembayarannya sehingga saya bisa memverifikasi kehadiran. | P1 |
| US-06 | Sebagai EO, saya ingin mengajukan withdrawal saldo ke rekening bank saya sehingga saya menerima dana hasil penjualan tiket. | P0 |
| US-07 | Sebagai EO, saya ingin melihat riwayat disbursement dan status setiap withdrawal sehingga saya tahu kapan dana akan masuk. | P1 |
| US-08 | Sebagai EO, saya ingin mengedit atau menutup event sebelum tanggal event sehingga saya dapat mengelola perubahan mendadak. | P1 |
| US-09 | Sebagai EO, saya ingin mengupload banner event dan melihat preview-nya sebelum publish sehingga tampilan halaman event sesuai harapan. | P1 |
| US-10 | Sebagai EO, saya ingin platform dapat diakses dengan nyaman di layar mobile sehingga saya bisa memantau event dari mana saja. | P1 |

---

## 6. Acceptance Criteria

**US-01 — Auth (Register & Login)**
- [ ] Given form register diisi lengkap & valid, when submit, then akun dibuat dan user diarahkan ke dashboard.
- [ ] Given email sudah terdaftar, when submit register, then muncul pesan error "Email sudah digunakan".
- [ ] Given kredensial salah, when login, then muncul pesan error tanpa expose alasan spesifik.
- [ ] Given user sudah login, when buka halaman login, then otomatis redirect ke dashboard.

**US-02 — Buat Event**
- [ ] Given form event diisi lengkap, when submit, then event tersimpan dengan status `draft`.
- [ ] Given field wajib (nama, tanggal mulai, lokasi) kosong, when submit, then muncul inline validation per field.
- [ ] Given event berhasil dibuat, when klik "Publish", then status berubah ke `published` dan event visible di halaman publik.

**US-03 — Kategori Tiket**
- [ ] Given event sudah ada, when tambah kategori tiket dengan data lengkap, then tiket muncul di daftar tiket event.
- [ ] Given kuota tiket = 0, when peserta mencoba beli, then tombol beli disabled dan label "Habis Terjual" tampil.
- [ ] Given tanggal penjualan belum mulai, when halaman event dibuka, then tiket tampil dengan label "Belum Tersedia".

**US-04 — Dashboard Penjualan**
- [ ] Given EO buka dashboard event, when halaman load, then tampil: total tiket terjual, total pendapatan, breakdown per kategori tiket.
- [ ] Given ada transaksi baru, when EO refresh dashboard, then angka diperbarui tanpa reload penuh (atau polling ≤ 30 detik).

**US-06 — Withdrawal**
- [ ] Given saldo tersedia > 0, when EO isi form withdrawal (jumlah, rekening), then request terkirim dengan status `pending`.
- [ ] Given jumlah withdrawal > saldo tersedia, when submit, then muncul error "Saldo tidak mencukupi".
- [ ] Given withdrawal berhasil disubmit, then EO menerima konfirmasi on-screen dan nomor referensi.

---

## 7. Functional Requirements (UI Scope)

| ID | Requirement | Story ref |
|---|---|---|
| FR-01 | Halaman Register dengan field: nama, email, password, konfirmasi password, nama organisasi | US-01 |
| FR-02 | Halaman Login dengan field email & password + link "Lupa password" | US-01 |
| FR-03 | Form buat event: nama, deskripsi (rich text), tanggal mulai/selesai, lokasi (teks), kapasitas, upload banner | US-02, US-09 |
| FR-04 | Form kategori tiket: nama kategori, harga, kuota, tanggal buka penjualan, tanggal tutup penjualan | US-03 |
| FR-05 | Dashboard event: kartu ringkasan (terjual/total, pendapatan, kategori aktif) + tabel transaksi terbaru | US-04 |
| FR-06 | Halaman daftar peserta: tabel dengan kolom nama, email, tiket, status bayar, tanggal beli; support search & filter | US-05 |
| FR-07 | Halaman withdrawal: form (jumlah, pilih rekening bank), saldo tersedia, riwayat withdrawal + badge status | US-06, US-07 |
| FR-08 | Halaman manajemen event: list event dengan filter status (draft/published/closed) + tombol edit/tutup | US-08 |
| FR-09 | Image upload component dengan preview inline sebelum disimpan | US-09 |
| FR-10 | Layout responsive (breakpoint mobile ≥ 375px, tablet ≥ 768px, desktop ≥ 1280px) | US-10 |

---

## 8. Non-Functional Requirements

| Category | Requirement | Threshold |
|---|---|---|
| Performance | First Contentful Paint | < 1.5s pada koneksi 4G |
| Performance | Time to Interactive dashboard | < 2.5s |
| Accessibility | WCAG compliance | Level AA minimum |
| Responsiveness | Mobile usability | Semua P0 flow dapat diselesaikan di viewport 375px |
| Token efficiency | Komponen reusable | Gunakan komponen atom/molecule (Design System pattern); hindari duplikasi style |
| Code quality | Clean Code standard | Satu komponen = satu tanggung jawab; nama variabel deskriptif; tidak ada magic number |
| Error handling | Semua API error ditampilkan | User-friendly message; tidak expose stack trace |

---

## 9. UI Component Map

Panduan struktur komponen untuk vibecoding — satu file per komponen, nama PascalCase.

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx            # Ringkasan semua event
│   │   └── [eventId]/
│   │       ├── page.tsx        # Detail & statistik event
│   │       ├── tickets/page.tsx
│   │       ├── attendees/page.tsx
│   │       └── edit/page.tsx
│   └── finance/
│       ├── page.tsx            # Saldo & riwayat
│       └── withdraw/page.tsx
├── components/
│   ├── ui/                     # Atom: Button, Input, Badge, Modal, Table
│   ├── forms/                  # Molecule: EventForm, TicketCategoryForm, WithdrawForm
│   ├── dashboard/              # Organism: StatCard, SalesChart, AttendeeTable
│   └── layout/                 # Sidebar, Topbar, PageWrapper
├── hooks/                      # useEvents, useTickets, useWithdrawal, useAuth
├── services/                   # api.ts — semua fetch call terpusat
├── types/                      # event.ts, ticket.ts, user.ts, finance.ts
└── utils/                      # formatCurrency, formatDate, cn (classname helper)
```

---

## 10. Screen Flow (Happy Path)

```
Register/Login
    └── Dashboard (list events)
            ├── [+ Buat Event] → Form Event → Tambah Tiket → Preview → Publish
            ├── [Event Card] → Detail Event
            │       ├── Tab: Statistik (StatCard + Chart)
            │       ├── Tab: Peserta (AttendeeTable + Search)
            │       └── Tab: Edit / Tutup Event
            └── [Finance] → Saldo + Riwayat → [Ajukan Withdrawal] → Form → Konfirmasi
```

---

## 11. Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-01 | Apakah halaman event publik (untuk peserta beli tiket) masuk scope MVP FE ini atau terpisah? | PM | Open |
| OQ-02 | Rich text editor untuk deskripsi event: pakai library apa? (Tiptap / Quill / textarea biasa) | FE Dev | Open |
| OQ-03 | Apakah dashboard perlu chart visualisasi penjualan per hari/minggu, atau cukup angka? | PM/Design | Open |
| OQ-04 | Format rekening bank untuk withdrawal: apakah ada validasi BIN/nomor rekening ke API eksternal? | BE Dev | Open |

---

## 12. Out of Scope (FE)

- Halaman publik pembelian tiket oleh peserta
- Payment gateway UI (Midtrans / Xendit) — ditangani redirect
- Fitur laporan/export CSV (P2, post-MVP)
- Dark mode
- Notifikasi push / email template

---

## 13. Appendix

- PRD Backend: `PRD-EMS-Backend.md`
- Design reference: `[NEEDS INPUT — Figma link]`
- API contract: dikembangkan bersama BE setelah PRD ini disetujui

---

*Status: Draft — 2 open questions (OQ-01, OQ-03) perlu dijawab sebelum desain dimulai.*
