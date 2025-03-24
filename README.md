# Panduan Perancangan Aplikasi Jadwalinae: Study Planner & Tracker (Extremely Detailed)

**Deskripsi Umum**

Aplikasi **Jadwalinae** adalah aplikasi Study Planner & Tracker yang dirancang untuk membantu siswa dan mahasiswa mengatur waktu belajar mereka secara efektif dan efisien. Aplikasi ini akan diluncurkan pertama kali sebagai aplikasi web yang responsif, dibangun menggunakan kombinasi teknologi modern untuk memberikan pengalaman pengguna yang optimal di berbagai perangkat. Frontend akan dikembangkan dengan React (menggunakan TypeScript untuk keamanan tipe data dan Tailwind CSS untuk styling yang cepat dan mudah dikustomisasi). Backend akan menggunakan Python (kemungkinan dengan framework FastAPI untuk performa tinggi dan kemudahan pengembangan API, atau Flask untuk fleksibilitas), yang akan dihosting di PythonAnywhere untuk kemudahan deployment dan pengelolaan di tahap awal. Seluruh data aplikasi, termasuk data pengguna, tugas, jadwal, dan preferensi, akan disimpan dan dikelola menggunakan Supabase, yang menyediakan database PostgreSQL yang scalable dan layanan autentikasi yang terintegrasi (termasuk Google Sign-In). Pengembangan aplikasi mobile (iOS dan Android) adalah tujuan jangka panjang dan akan dieksplorasi lebih lanjut setelah peluncuran dan validasi aplikasi web, dengan mempertimbangkan opsi seperti React Native untuk pengalaman native atau Capacitor untuk pembungkusan web app yang cepat.

Target pengguna utama aplikasi ini adalah siswa SMA, mahasiswa tingkat sarjana dan pascasarjana, serta individu yang memiliki kebutuhan untuk mengatur dan melacak kegiatan belajar mandiri mereka. Aplikasi ini dirancang untuk menjadi alat yang intuitif, mudah digunakan, dan membantu pengguna mencapai tujuan akademik mereka dengan perencanaan yang terstruktur.

Model monetisasi awal akan difokuskan pada pasar kelas internal dengan sistem subscription di luar toko aplikasi (pembayaran tunai atau antar teman). Model ini akan dievaluasi dan disesuaikan untuk menjangkau audiens yang lebih luas di masa mendatang, dengan mempertimbangkan opsi seperti freemium atau premium dengan fitur tambahan.

**Filosofi Aplikasi**

Filosofi di balik Jadwalinae adalah untuk menyediakan platform yang sederhana namun kuat untuk perencanaan studi. Aplikasi ini akan berfokus pada kemudahan penggunaan, memungkinkan pengguna untuk dengan cepat memasukkan informasi penting dan mendapatkan jadwal belajar yang terstruktur. Selain itu, Jadwalinae akan mendorong kebiasaan belajar yang baik melalui fitur-fitur seperti pengingat dan pelacakan kemajuan. Aspek komunitas (melalui fitur pertemanan) juga akan ditekankan untuk menciptakan lingkungan belajar yang suportif.

**Arsitektur Aplikasi**

Aplikasi Jadwalinae akan mengadopsi arsitektur tiga lapis:

1.  **Frontend (Client):** Aplikasi web yang dibangun dengan React, bertanggung jawab untuk menampilkan antarmuka pengguna dan berinteraksi dengan pengguna. Frontend akan berkomunikasi dengan backend melalui API.
2.  **Backend (Server):** Aplikasi yang dibangun dengan Python, bertanggung jawab untuk menangani logika bisnis, autentikasi, otorisasi, dan berinteraksi dengan database Supabase serta layanan eksternal lainnya (seperti Google Calendar API).
3.  **Database:** Supabase (PostgreSQL) akan digunakan sebagai penyimpanan data utama untuk seluruh informasi aplikasi.

**Teknologi Stack Detail**

* **Frontend:**
    * **Framework:** React (versi terbaru).
    * **Bahasa Pemrograman:** TypeScript (versi terbaru).
    * **Styling:** Tailwind CSS (versi 3.x).
    * **Manajemen State:** Kemungkinan menggunakan React Context API untuk state global yang sederhana atau Zustand jika state management yang lebih kompleks diperlukan.
    * **UI Library:** Pertimbangkan penggunaan UI library seperti Shadcn UI untuk komponen-komponen UI yang siap pakai dan mudah dikustomisasi.
* **Backend:**
    * **Bahasa Pemrograman:** Python (versi 3.x).
    * **Web Framework:** Kemungkinan FastAPI (untuk performa dan fitur modern seperti validasi data otomatis dan dokumentasi API) atau Flask (untuk fleksibilitas dan kesederhanaan). Keputusan akan didasarkan pada kompleksitas API yang dibutuhkan.
    * **Database Interaction:** Supabase Python client library.
    * **Hosting:** PythonAnywhere (tier gratis atau berbayar sesuai kebutuhan).
* **Database:**
    * **Platform:** Supabase.
    * **Database:** PostgreSQL.
    * **Autentikasi:** Supabase Auth (terintegrasi dengan Google Sign-In).
    * **Realtime:** Pertimbangkan fitur realtime dari Supabase untuk pembaruan data secara instan di masa mendatang (misalnya, untuk fitur kolaborasi).
* **Layanan Eksternal:**
    * **Autentikasi:** Google Sign-In (melalui Supabase Auth).
    * **Kalender:** Google Calendar API (diakses melalui backend Python menggunakan library `google-api-python-client`).
    * **AI (Masa Depan):** Gemini API atau Google Cloud Vertex AI (untuk algoritma rekomendasi yang lebih canggih).
    * **Penyimpanan (Masa Depan):** Google Drive API atau Google Cloud Storage API (untuk penyimpanan catatan dan file yang lebih besar).
    * **Speech-to-Text (Masa Depan):** Google Cloud Speech-to-Text API.
* **Mobile (Masa Depan):**
    * **Opsi 1: React Native:** Memungkinkan penggunaan kembali sebagian besar logika bisnis dan potensi kode dari aplikasi web, menghasilkan aplikasi native untuk iOS dan Android.
    * **Opsi 2: Capacitor:** Memungkinkan pembungkusan aplikasi web React yang sudah ada ke dalam kontainer native, lebih cepat untuk implementasi awal namun mungkin memiliki batasan dalam akses fitur native.

**Fitur Utama (Extremely Detailed)**

* **Autentikasi, Username, & Manajemen Pengguna:**
    * **Google Sign-In:** Pengguna akan dapat login dengan mudah menggunakan akun Google mereka. Proses autentikasi akan diimplementasikan menggunakan Supabase Auth. Setelah login berhasil, informasi profil dasar pengguna (nama, email, ID Google) akan disimpan di database Supabase.
    * **Username:** Setelah login pertama kali, pengguna akan diminta untuk memilih username unik. Username ini akan digunakan untuk identifikasi dalam aplikasi dan untuk fitur pertemanan. Validasi akan diterapkan untuk memastikan keunikan username.
    * **Manajemen Teman:**
        * **Pencarian Teman:** Pengguna dapat mencari teman berdasarkan username atau alamat email yang terdaftar.
        * **Permintaan Pertemanan:** Pengguna dapat mengirimkan permintaan pertemanan kepada pengguna lain.
        * **Penerimaan/Penolakan Permintaan:** Pengguna dapat melihat permintaan pertemanan yang masuk dan memiliki opsi untuk menerima atau menolaknya.
        * **Daftar Teman:** Pengguna akan memiliki daftar teman yang terhubung.
        * **Berbagi (dengan izin):** Pengguna akan memiliki opsi untuk berbagi jadwal belajar, catatan, dan rencana belajar mereka dengan teman-teman yang mereka pilih. Pengaturan privasi akan memungkinkan kontrol granular atas apa yang dibagikan.

* **Task Management & Kategori:**
    * **Input Tugas:** Pengguna dapat menambahkan tugas baru dengan detail berikut:
        * Judul Tugas (wajib).
        * Deskripsi Tugas (opsional, untuk detail tambahan).
        * Deadline (tanggal dan waktu, dengan pemilihan melalui kalender).
        * Prioritas (misalnya, Tinggi, Sedang, Rendah, dengan indikator visual).
        * Kategori (pilihan antara "Kuliah" dan "Project Mandiri/Belajar Mandiri" dengan opsi untuk kategori kustom di masa depan).
    * **Tampilan Tugas:** Tugas akan ditampilkan dalam format card view yang menarik dan informatif. Card akan menampilkan judul, deadline, prioritas, dan kategori.
    * **Pengeditan Tugas:** Pengguna dapat mengedit detail tugas yang sudah ada.
    * **Penghapusan Tugas:** Pengguna dapat menghapus tugas.
    * **Pengurutan dan Pemfilteran:** Pengguna dapat mengurutkan tugas berdasarkan deadline, prioritas, atau kategori, serta memfilter tugas berdasarkan status (belum selesai, selesai) atau kategori.

* **Calendar Integration & Reminders:**
    * **Sinkronisasi Google Calendar:** Setelah pengguna memberikan izin, backend Python akan menggunakan Google Calendar API untuk menyinkronkan jadwal belajar yang dihasilkan oleh aplikasi ke kalender Google pengguna. Ini memungkinkan pengguna melihat jadwal belajar mereka bersama dengan acara lain di kalender mereka.
    * **Pengaturan Pengingat:** Pengguna akan dapat mengatur pengingat untuk tugas dan sesi belajar mereka. Pengingat ini akan diimplementasikan melalui integrasi dengan Google Calendar, sehingga pengingat akan muncul di perangkat pengguna sesuai dengan pengaturan kalender mereka. Pertimbangkan opsi untuk mengatur waktu pengingat yang berbeda (misalnya, 15 menit sebelum, 1 jam sebelum).
    * **Potensi Sinkronisasi Dua Arah (Masa Depan):** Pertimbangkan kemungkinan untuk memungkinkan pengguna menambahkan acara belajar langsung dari Google Calendar dan menyinkronkannya kembali ke Jadwalinae.

* **Study Timer:**
    * **Implementasi Pomodoro:** Timer akan mengikuti teknik Pomodoro (misalnya, 25 menit belajar, 5 menit istirahat pendek, 15-30 menit istirahat panjang setelah beberapa siklus).
    * **Kustomisasi Durasi:** Pengguna akan memiliki opsi untuk menyesuaikan durasi sesi belajar dan istirahat sesuai dengan preferensi mereka.
    * **Notifikasi:** Aplikasi akan memberikan notifikasi saat sesi belajar atau istirahat berakhir.
    * **Pelacakan Sesi:** Aplikasi akan melacak jumlah sesi Pomodoro yang telah diselesaikan pengguna.

* **Dashboard & Progress Tracker:**
    * **Ringkasan Jadwal:** Menampilkan sekilas jadwal belajar untuk hari ini atau minggu ini.
    * **Tugas Mendatang:** Daftar tugas yang memiliki deadline dalam waktu dekat.
    * **Kemajuan Belajar:** Visualisasi kemajuan belajar, mungkin dalam bentuk grafik atau diagram yang menunjukkan jumlah tugas selesai, waktu belajar yang telah dihabiskan, atau metrik lainnya.
    * **Motivasi:** Kutipan motivasi atau tips belajar harian.

* **Personalized Study Plan (Algoritma):**
    * **Implementasi Saat Ini (Python di PythonAnywhere):**
        1.  **Pengumpulan Data:** Backend akan mengambil data mata kuliah (nama, SKS), daftar tugas (judul, deskripsi, deadline, prioritas, perkiraan waktu pengerjaan), dan preferensi waktu belajar pengguna (hari, rentang waktu, durasi sesi, durasi istirahat) dari database Supabase.
        2.  **Penentuan Prioritas:** Tugas akan diurutkan berdasarkan deadline. Tugas dengan deadline terdekat akan memiliki prioritas lebih tinggi. Prioritas yang ditetapkan pengguna juga akan dipertimbangkan.
        3.  **Alokasi Waktu Berdasarkan SKS:** Waktu belajar mingguan untuk setiap mata kuliah akan diestimasi berdasarkan jumlah SKS (misalnya, 2 jam per SKS).
        4.  **Penjadwalan Tugas:** Algoritma akan mencoba menjadwalkan tugas dan sesi belajar ke dalam blok waktu yang tersedia sesuai dengan preferensi pengguna. Tugas dengan prioritas tinggi dan deadline dekat akan dijadwalkan terlebih dahulu. Perkiraan waktu pengerjaan tugas (jika ada) akan digunakan untuk mengalokasikan durasi sesi belajar yang sesuai.
        5.  **Manajemen Sesi dan Istirahat:** Jadwal akan dibagi menjadi sesi-sesi belajar dengan durasi yang diinginkan pengguna, diselingi dengan istirahat dengan durasi yang ditentukan.
        6.  **Penyusunan Jadwal:** Hasilnya akan berupa jadwal belajar mingguan atau harian yang menampilkan mata kuliah atau tugas yang perlu dipelajari pada waktu tertentu.
    * **Fitur Lanjutan (Dipertimbangkan - Google Cloud Vertex AI):**
        1.  **Pengumpulan Feedback:** Aplikasi akan mengumpulkan feedback dari pengguna mengenai efektivitas jadwal yang dihasilkan (melalui tombol suka/tidak suka, rating, penyesuaian manual, dan formulir feedback).
        2.  **Ekspor Data:** Data feedback akan diekspor secara berkala ke Google Cloud Vertex AI.
        3.  **Training Model ML:** Model machine learning (kemungkinan model rekomendasi atau model prediksi rating) akan dilatih menggunakan data feedback dan parameter input jadwal.
        4.  **Deployment Model:** Model yang terlatih akan di-deploy sebagai endpoint API di Vertex AI.
        5.  **Integrasi Backend:** Backend Python akan memanggil endpoint model ML di Vertex AI untuk mendapatkan rekomendasi jadwal yang lebih personal berdasarkan preferensi dan feedback pengguna historis.

* **Note-Taking:**
    * **Rich Text Editor:** Implementasi editor teks kaya (mungkin menggunakan library seperti Quill atau TinyMCE) yang mendukung format dasar (bold, italic, underline, headings, lists).
    * **Dukungan LaTeX:** Integrasi dengan library LaTeX (misalnya, MathJax untuk rendering di web) untuk memungkinkan pengguna menulis dan melihat persamaan matematika dalam catatan mereka.
    * **Organisasi Catatan:** Pengguna dapat membuat dan mengelola catatan dalam folder atau menggunakan tag untuk organisasi yang lebih fleksibel.
    * **Pencarian Catatan:** Fitur pencarian untuk menemukan catatan berdasarkan judul atau konten.

* **Synchronization & Cloud Storage:**
    * **Supabase:** Untuk tahap awal, semua data aplikasi (termasuk catatan) akan disimpan di database Supabase.
    * **Integrasi Google Drive/Cloud Storage (Masa Depan):** Pertimbangkan untuk mengintegrasikan dengan Google Drive atau Google Cloud Storage untuk memungkinkan pengguna menyimpan dan menyinkronkan catatan dan file belajar lainnya. Ini bisa berguna untuk catatan yang lebih panjang atau file referensi.

* **Settings:**
    * **Preferensi Belajar:** Pengguna dapat mengatur preferensi waktu belajar (hari, jam), durasi sesi belajar, durasi istirahat.
    * **Input SKS Mata Kuliah:** Pengguna dapat memasukkan daftar mata kuliah mereka beserta jumlah SKS untuk membantu algoritma memperkirakan beban belajar.
    * **Pengaturan Notifikasi:** Mengaktifkan/menonaktifkan notifikasi dan mengatur preferensi jenis notifikasi.
    * **Tema Aplikasi:** Pilihan tema terang/gelap.
    * **Pengaturan Akun:** Mengelola profil dan koneksi akun Google.

* **Fitur Masa Depan:**
    * **Speech-to-Text:** Mengintegrasikan Google Cloud Speech-to-Text API untuk memungkinkan pengguna membuat catatan atau menambahkan tugas menggunakan suara.
    * **Fitur Kolaborasi:** Memungkinkan pengguna untuk berbagi jadwal dan catatan dengan teman secara real-time.
    * **Analitik Tingkat Lanjut:** Menyediakan insight yang lebih mendalam tentang kebiasaan belajar pengguna dan efektivitas jadwal mereka.
    * **Integrasi dengan Platform Belajar Lain:** Pertimbangkan integrasi dengan platform e-learning atau sistem manajemen pembelajaran (LMS).

**Navbar & Navigasi**

* Navigasi utama akan diimplementasikan menggunakan burger menu di sisi layar (kiri atau kanan, tergantung desain UI).
* Item menu kemungkinan akan mencakup: Dashboard, Task Management, Study Plan, Study Timer, Notes, Friends, Calendar, Settings, dan (jika ada) Subscription.

**Mekanisme Subscription & Pembayaran**

* **Pasar Internal Awal:** Model subscription akan dikelola secara manual di luar aplikasi (misalnya, melalui grup kelas atau komunitas). Pembayaran dapat dilakukan secara tunai atau antar teman.
* **Ekspansi Masa Depan:** Untuk menjangkau audiens yang lebih luas, pertimbangkan integrasi dengan platform pembayaran seperti Stripe atau Google Play Billing/App Store Connect. Model monetisasi bisa berupa:
    * **Freemium:** Fitur dasar gratis, dengan fitur premium (misalnya, algoritma AI tingkat lanjut, penyimpanan cloud tambahan, tema khusus) yang memerlukan subscription berbayar.
    * **Premium:** Semua fitur tersedia dengan biaya subscription bulanan atau tahunan.

**Struktur UI Aplikasi (Screen-by-Screen Detail)**

* **Splash & Login Screen:**
    * Logo aplikasi dan nama Jadwalinae.
    * Tombol "Login dengan Google" yang menggunakan Supabase Auth.
    * Potensi opsi untuk masuk sebagai guest user (jika diimplementasikan).
* **Dashboard:**
    * Sapaan selamat datang kepada pengguna.
    * Ringkasan jadwal hari ini (mungkin dalam bentuk timeline sederhana).
    * Daftar tugas yang akan datang (3-5 tugas terdekat).
    * Visualisasi kemajuan belajar (misalnya, progress bar atau lingkaran).
    * Akses cepat ke fitur study timer.
* **Task Management Screen:**
    * Tombol untuk menambahkan tugas baru (+ atau "Tambah Tugas").
    * Daftar tugas yang ada, ditampilkan sebagai card view.
    * Opsi untuk mengurutkan (berdasarkan deadline, prioritas, kategori) dan memfilter (berdasarkan status, kategori) tugas.
    * Fungsi pencarian tugas.
    * Saat menambahkan/mengedit tugas: Form dengan input untuk judul, deskripsi, deadline (dengan kalender), prioritas (dropdown atau radio button), dan kategori (dropdown).
* **Study Timer Screen:**
    * Tampilan timer Pomodoro dengan tombol Start, Pause, Reset.
    * Pengaturan untuk menyesuaikan durasi sesi belajar dan istirahat.
    * Indikator jumlah sesi Pomodoro yang telah diselesaikan.
* **Study Plan Screen:**
    * Tampilan jadwal belajar yang dihasilkan (kemungkinan dalam format kalender mingguan atau daftar harian).
    * Informasi detail untuk setiap blok waktu belajar (mata kuliah/tugas, perkiraan durasi).
    * Opsi untuk melihat jadwal harian atau mingguan.
    * Tombol untuk meregenerasi jadwal (jika diperlukan).
* **Note-Taking Screen:**
    * Daftar catatan yang ada (mungkin dalam format list dengan judul dan ringkasan).
    * Tombol untuk membuat catatan baru (+ atau "Buat Catatan").
    * Fungsi pencarian catatan.
    * Saat membuat/mengedit catatan: Editor teks kaya dengan opsi format dasar dan dukungan LaTeX. Opsi untuk menyimpan catatan ke folder atau menambahkan tag.
* **Friends Screen:**
    * Daftar teman pengguna.
    * Bagian untuk melihat permintaan pertemanan yang masuk.
    * Form atau tombol untuk mencari dan menambahkan teman berdasarkan username atau email.
    * Opsi untuk melihat profil teman (jika diimplementasikan lebih lanjut).
* **Calendar & Reminders Screen:**
    * Tampilan kalender (mungkin menggunakan library kalender React).
    * Jadwal belajar yang disinkronkan dari Google Calendar ditampilkan di kalender.
    * Opsi untuk mengelola pengingat (walaupun ini sebagian besar akan dikelola melalui Google Calendar).
* **Settings Screen:**
    * Bagian untuk mengatur preferensi waktu belajar (memilih hari dan jam belajar yang tersedia).
    * Input untuk menambahkan dan mengelola daftar mata kuliah beserta jumlah SKS.
    * Pengaturan notifikasi (mengaktifkan/menonaktifkan, memilih jenis notifikasi).
    * Pilihan tema aplikasi (terang/gelap).
    * Informasi akun dan opsi untuk logout.
* **Subscription Management Screen:**
    * (Jika model pembayaran diimplementasikan) Informasi tentang status subscription pengguna.
    * Opsi untuk mengelola atau memperbarui subscription.

**User Stories (Contoh)**

* Sebagai mahasiswa, saya ingin dapat dengan mudah menambahkan semua tugas kuliah saya dengan deadline agar saya tidak ada yang terlewat.
* Sebagai pengguna, saya ingin aplikasi ini membuatkan jadwal belajar mingguan yang realistis berdasarkan tugas dan waktu luang saya.
* Sebagai siswa, saya ingin mendapatkan pengingat sebelum deadline tugas atau sesi belajar saya dimulai.
* Sebagai pengguna, saya ingin dapat berbagi jadwal belajar saya dengan teman sekelas untuk belajar bersama.
* Sebagai pengguna, saya ingin dapat mencatat poin-poin penting saat belajar dan menyimpannya dengan mudah.

**Optimasi**

* **Performa Web:** Optimasi kode React untuk rendering yang cepat dan efisien. Gunakan lazy loading untuk komponen yang tidak langsung terlihat. Minimalkan ukuran bundle JavaScript.
* **Responsiveness:** Pastikan layout aplikasi web responsif dan dapat digunakan dengan baik di berbagai ukuran layar (desktop, tablet, mobile). Gunakan Tailwind CSS secara efektif untuk mencapai ini.
* **Performa Backend:** Pilih framework Python yang sesuai (FastAPI untuk performa tinggi) dan tulis kode yang efisien. Optimalkan query database ke Supabase.
* **Mobile (Masa Depan):** Jika menggunakan React Native, optimalkan komponen native untuk performa yang baik. Jika menggunakan Capacitor, optimalkan performa aplikasi web agar berjalan lancar di dalam WebView. Pertimbangkan penggunaan service workers untuk caching dan offline access.

**Penggunaan API & Model AI (Detailed)**

* **Supabase Client:** Digunakan di frontend dan backend untuk berinteraksi dengan database PostgreSQL. Frontend akan menggunakan Supabase JavaScript client untuk autentikasi dan fetching data. Backend akan menggunakan Supabase Python client untuk operasi database yang lebih kompleks dan integrasi layanan lainnya.
* **Google Sign-In API (via Supabase Auth):** Memungkinkan pengguna untuk melakukan autentikasi dengan akun Google mereka. Supabase Auth menyediakan integrasi yang mudah dengan berbagai penyedia OAuth, termasuk Google.
* **Google Calendar API:** Backend Python akan menggunakan library `google-api-python-client` untuk berinteraksi dengan Google Calendar pengguna. Ini akan melibatkan otentikasi dengan OAuth 2.0 (setelah pengguna memberikan izin) untuk membaca dan menulis acara kalender. Data yang akan disinkronkan kemungkinan adalah jadwal belajar yang dihasilkan oleh aplikasi.
* **Gemini API/Google Cloud Vertex AI (Masa Depan):** Jika diimplementasikan, backend Python akan membuat permintaan ke endpoint API Gemini atau model yang di-deploy di Vertex AI, mengirimkan data input (tugas, preferensi, feedback) dan menerima rekomendasi jadwal yang dipersonalisasi.
* **Google Cloud Speech-to-Text API (Masa Depan):** Jika diimplementasikan, frontend akan menggunakan API ini (kemungkinan melalui library JavaScript) untuk mengirimkan audio pengguna ke Google Cloud dan menerima transkripsi teks kembali, yang kemudian dapat digunakan untuk membuat catatan atau menambahkan tugas.

**Database (Extremely Detailed)**

* **Skema Database (Conceptual):**
    * **`users` Table:**
        * `id` (UUID, Primary Key)
        * `google_id` (String, Unique, untuk integrasi Google Sign-In)
        * `username` (String, Unique)
        * `email` (String)
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
    * **`courses` Table:**
        * `id` (UUID, Primary Key)
        * `user_id` (UUID, Foreign Key referencing `users.id`)
        * `name` (String)
        * `sks` (Integer)
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
    * **`tasks` Table:**
        * `id` (UUID, Primary Key)
        * `user_id` (UUID, Foreign Key referencing `users.id`)
        * `course_id` (UUID, Foreign Key referencing `courses.id`, optional)
        * `title` (String)
        * `description` (Text)
        * `deadline` (Timestamp)
        * `priority` (String, enum: 'High', 'Medium', 'Low')
        * `category` (String)
        * `estimated_duration` (Integer, dalam menit, optional)
        * `is_completed` (Boolean, default: false)
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
    * **`schedules` Table:**
        * `id` (UUID, Primary Key)
        * `user_id` (UUID, Foreign Key referencing `users.id`)
        * `task_id` (UUID, Foreign Key referencing `tasks.id`, optional)
        * `course_id` (UUID, Foreign Key referencing `courses.id`, optional)
        * `start_time` (Timestamp)
        * `end_time` (Timestamp)
        * `type` (String, enum: 'study', 'break', 'task')
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
    * **`notes` Table:**
        * `id` (UUID, Primary Key)
        * `user_id` (UUID, Foreign Key referencing `users.id`)
        * `title` (String)
        * `content` (Text)
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
    * **`friends` Table:**
        * `id` (UUID, Primary Key)
        * `user_id` (UUID, Foreign Key referencing `users.id`)
        * `friend_id` (UUID, Foreign Key referencing `users.id`)
        * `status` (String, enum: 'pending', 'accepted', 'rejected')
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
        * **(Unique constraint on user_id and friend_id to prevent duplicates)**
    * **`feedback` Table:**
        * `id` (UUID, Primary Key)
        * `user_id` (UUID, Foreign Key referencing `users.id`)
        * `schedule_parameters` (JSONB, menyimpan parameter yang digunakan untuk menghasilkan jadwal)
        * `feedback_type` (String)
        * `feedback_value` (Text atau Integer, tergantung jenis feedback)
        * `created_at` (Timestamp)
        * `updated_at` (Timestamp)
* **Relasi Antar Tabel:** Dijelaskan melalui Foreign Keys di atas.
* **Data Flow:** Frontend akan mengirimkan permintaan ke backend untuk membaca dan menulis data ke tabel-tabel ini melalui API endpoints. Backend akan menggunakan Supabase Python client untuk berinteraksi dengan database.

**Struktur & Organisasi File (Extremely Detailed)**

* **Frontend (React):**
    ```
    study-friend-sync-main/
    ├── public/
    ├── src/
    │   ├── App.tsx             # Root component
    │   ├── index.css           # Global styles
    │   ├── main.tsx            # Entry point
    │   ├── service-worker.ts   # Untuk PWA (jika diimplementasikan)
    │   ├── vite-env.d.ts
    │   ├── components/         # Komponen UI reusable
    │   │   ├── common/         # Komponen umum (Button, Card, Modal, dll.)
    │   │   ├── dashboard/      # Komponen khusus untuk dashboard
    │   │   ├── layout/         # Komponen layout (MainLayout, Navbar, Sidebar)
    │   │   ├── notes/          # Komponen terkait fitur catatan (NoteEditor, NoteList)
    │   │   ├── settings/       # Komponen untuk halaman pengaturan
    │   │   ├── tasks/          # Komponen terkait manajemen tugas (TaskCard, TaskForm)
    │   │   ├── timer/          # Komponen study timer
    │   │   ├── schedule/       # Komponen untuk menampilkan jadwal belajar
    │   │   └── ...             # Komponen UI lainnya
    │   ├── hooks/              # Custom React hooks (misalnya, untuk otentikasi, fetching data)
    │   │   ├── useAuth.tsx
    │   │   ├── useFetchData.tsx
    │   │   └── ...
    │   ├── integrations/       # Integrasi dengan layanan eksternal
    │   │   └── supabase/
    │   │       ├── client.ts     # Inisialisasi Supabase client
    │   │       ├── auth.ts       # Fungsi terkait autentikasi
    │   │       ├── database.ts   # Fungsi untuk interaksi database (fetching, mutations)
    │   │       └── types.ts      # Definisi tipe data yang berkaitan dengan Supabase
    │   ├── lib/                # Fungsi utilitas (misalnya, formatting tanggal, validasi)
    │   │   └── utils.ts
    │   ├── pages/              # Halaman utama aplikasi (routing)
    │   │   ├── index.tsx         # Halaman Dashboard
    │   │   ├── tasks.tsx         # Halaman Task Management
    │   │   ├── schedule.tsx      # Halaman Study Plan
    │   │   ├── notes.tsx         # Halaman Notes
    │   │   ├── friends.tsx       # Halaman Friends
    │   │   ├── settings.tsx      # Halaman Settings
    │   │   └── ...             # Halaman lainnya
    │   ├── styles/             # File CSS/SCSS atau file styling Tailwind CSS
    │   │   ├── global.css
    │   │   └── ...
    │   └── ...
    ├── .gitignore
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── ...
    ```
* **Backend (Python):**
    ```
    backend/
    ├── main.py             # Entry point aplikasi backend (misalnya, menggunakan FastAPI atau Flask)
    ├── routes/             # Definisi API endpoints
    │   ├── auth.py         # Endpoint untuk autentikasi
    │   ├── users.py        # Endpoint untuk manajemen pengguna
    │   ├── courses.py      # Endpoint untuk manajemen mata kuliah
    │   ├── tasks.py        # Endpoint untuk manajemen tugas
    │   ├── schedules.py    # Endpoint untuk menghasilkan dan mengelola jadwal
    │   ├── notes.py        # Endpoint untuk manajemen catatan
    │   ├── friends.py      # Endpoint untuk manajemen pertemanan
    │   ├── feedback.py     # Endpoint untuk menerima feedback
    │   └── ...
    ├── models/             # Definisi model data (Pydantic untuk FastAPI, atau SQLAlchemy jika menggunakan Flask dengan ORM)
    │   ├── user_model.py
    │   ├── course_model.py
    │   ├── task_model.py
    │   ├── schedule_model.py
    │   ├── note_model.py
    │   └── ...
    ├── database/           # Interaksi dengan database Supabase
    │   ├── supabase_client.py # Inisialisasi Supabase client
    │   ├── user_operations.py
    │   ├── course_operations.py
    │   ├── task_operations.py
    │   ├── schedule_operations.py
    │   ├── note_operations.py
    │   └── ...
    ├── algorithms/         # Implementasi algoritma belajar (awal)
    │   └── study_schedule_algorithm.py
    ├── integrations/       # Integrasi dengan layanan eksternal
    │   └── google_calendar.py # Fungsi untuk berinteraksi dengan Google Calendar API
    ├── config.py           # Konfigurasi aplikasi
    ├── requirements.txt    # Daftar dependencies Python
    └── ...
    ```

**Error Handling**

* Implementasikan error handling yang komprehensif di seluruh aplikasi, baik di frontend (menampilkan pesan error yang user-friendly) maupun di backend (menangani exceptions dan mengembalikan response error yang sesuai).
* Pastikan validasi input yang kuat di frontend dan backend untuk mencegah data yang tidak valid masuk ke sistem.
* Pantau log aplikasi di PythonAnywhere untuk mendeteksi dan memperbaiki error dengan cepat.

**Security**

* Gunakan HTTPS untuk semua komunikasi antara frontend dan backend.
* Manfaatkan fitur keamanan yang disediakan oleh Supabase untuk autentikasi dan otorisasi.
* Lindungi API endpoints Anda dari serangan umum (misalnya, CSRF, XSS).
* Jangan pernah menyimpan kredensial atau secret key secara langsung di kode frontend. Gunakan environment variables dengan aman.

**Cross-Platform Strategy**

* **Fokus Awal:** Pengembangan aplikasi web menggunakan React, TypeScript, dan Tailwind CSS.
* **Mobile di Masa Depan:**
    * **Capacitor:** Pertimbangkan untuk membungkus aplikasi web yang sudah ada menggunakan Capacitor untuk mendapatkan aplikasi mobile dengan cepat. Ini memungkinkan penggunaan kembali codebase web, namun mungkin ada batasan dalam mengakses fitur native perangkat.
    * **React Native:** Untuk pengalaman pengguna mobile yang lebih native dan akses penuh ke fitur perangkat, konversi ke React Native adalah pilihan jangka panjang. Ini akan memerlukan penulisan ulang sebagian besar UI menggunakan komponen React Native. Keputusan antara Capacitor dan React Native akan didasarkan pada kebutuhan performa, akses fitur native, dan sumber daya pengembangan yang tersedia setelah peluncuran web.

**Tim Pengembangan**

* Radhitya Guntoro Adhi (Pengembang Solo Indie)

**Timeline (Rough Estimate)**

* **Fase 1: Pengembangan Aplikasi Web MVP (Minimum Viable Product):** (Estimasi: 2-4 bulan) Fokus pada fitur-fitur inti seperti autentikasi, manajemen tugas, algoritma jadwal belajar sederhana, dan tampilan jadwal.
* **Fase 2: Integrasi Google Calendar & Fitur Tambahan Web:** (Estimasi: 1-2 bulan setelah Fase 1) Implementasi integrasi Google Calendar, fitur catatan, study timer, dan dashboard.
* **Fase 3: Eksplorasi dan Pengembangan Mobile (Capacitor atau React Native):** (Estimasi: Tergantung pada pilihan dan kompleksitas, bisa 2-6 bulan atau lebih).
* **Fase 4: Peningkatan Algoritma dengan ML (Vertex AI):** (Estimasi: Setelah data feedback terkumpul cukup banyak, waktu yang signifikan untuk riset, implementasi, dan training model).

**Metrics for Success**

* Jumlah pengguna terdaftar.
* Tingkat retensi pengguna.
* Frekuensi penggunaan fitur utama (task management, study plan, timer).
* Umpan balik positif dari pengguna (melalui rating, komentar, atau survei).
* Tingkat konversi ke model subscription (jika diimplementasikan).

**Risks and Challenges**

* Keterbatasan waktu dan sumber daya sebagai pengembang solo.
* Kurva pembelajaran teknologi baru (terutama jika mengimplementasikan Vertex AI).
* Memastikan algoritma jadwal belajar efektif dan disukai pengguna.
* Mendapatkan cukup banyak pengguna untuk mengumpulkan feedback yang berguna untuk ML.
* Persaingan dengan aplikasi study planner lain yang sudah ada.

**Next Steps**

1.  Pilih framework backend Python (FastAPI atau Flask).
2.  Siapkan proyek frontend React dengan TypeScript dan Tailwind CSS.
3.  Buat proyek di Supabase dan definisikan skema database awal.
4.  Implementasikan autentikasi Google Sign-In menggunakan Supabase Auth di frontend dan backend.
5.  Bangun UI dasar untuk halaman login, dashboard, dan task management.
6.  Implementasikan logika backend untuk menyimpan dan mengambil tugas dari Supabase.
7.  Implementasikan algoritma jadwal belajar sederhana di Python.
8.  Buat UI untuk menampilkan jadwal belajar.
9.  Deploy frontend ke Netlify dan backend ke PythonAnywhere.

**Credits**

Dibuat oleh: Radhitya Guntoro Adhi
