document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.getElementById("hero");
  const btnOpen = document.getElementById("btn-open");
  const mainContent = document.getElementById("main-content");
  const navbar = document.querySelector(".navbar-bottom-floating");
  const song = document.getElementById("song");
  const audioIcon = document.getElementById("audio-icon");
  const guestNameElement = document.getElementById("guest-name");

  let isPlaying = false;

  // 1. Ambil nama tamu dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const namaTamu = urlParams.get("to");
  if (namaTamu && guestNameElement) {
    guestNameElement.innerText = namaTamu;
  }

  // 2. Kunci scroll saat awal (hanya tampil Hero)
  document.body.style.overflow = "hidden";

  // 3. Fungsi Buka Undangan
  if (btnOpen) {
    btnOpen.addEventListener("click", () => {
      heroSection.classList.add("fade-out");
      setTimeout(() => {
        heroSection.classList.add("d-none");
        mainContent.classList.remove("content-hidden");
        if (navbar) navbar.style.display = "flex";
        document.body.style.overflow = "auto";
        window.scrollTo(0, 0);

        if (song) {
          song.play();
          audioIcon.style.display = "flex";
          isPlaying = true;
        }
      }, 500);
    });
  }

  // 4. Kontrol Musik
  if (audioIcon) {
    audioIcon.addEventListener("click", () => {
      if (isPlaying) {
        song.pause();
        audioIcon.style.animationPlayState = "paused";
      } else {
        song.play();
        audioIcon.style.animationPlayState = "running";
      }
      isPlaying = !isPlaying;
    });
  }

  // 5. --- LOGIKA PESAN & UCAPAN (BARU) ---
  const messageForm = document.getElementById("message-form");
  const messageContainer = document.getElementById("message-container");

  // Fungsi untuk menampilkan pesan dari LocalStorage
  const displayMessages = () => {
    if (!messageContainer) return;

    const messages =
      JSON.parse(localStorage.getItem("undangan_messages")) || [];
    messageContainer.innerHTML = "";

    messages.forEach((data) => {
      // Tentukan warna badge berdasarkan status
      const badgeClass =
        data.status === "Hadir" ? "bg-success" : "bg-secondary";

      const msgElement = document.createElement("div");
      msgElement.className =
        "single-message border-bottom pb-2 mb-3 text-start";
      msgElement.innerHTML = `
        <h6 class="fw-bold mb-1 text-brown">${data.name} 
          <span class="badge ${badgeClass} small" style="font-size: 0.6rem">${data.status}</span>
        </h6>
        <p class="small text-muted mb-0">${data.message}</p>
      `;
      messageContainer.prepend(msgElement);
    });
  };

  // Simpan Pesan Baru saat Form di-submit
  if (messageForm) {
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("input-name").value;
      const status = document.getElementById("input-status").value;
      const message = document.getElementById("input-message").value;

      const messages =
        JSON.parse(localStorage.getItem("undangan_messages")) || [];

      // Simpan data ke array
      messages.push({ name, status, message });

      // Simpan ke memory browser
      localStorage.setItem("undangan_messages", JSON.stringify(messages));

      // Reset form dan update tampilan
      messageForm.reset();
      displayMessages();
    });
  }

  // Jalankan fungsi tampil pesan saat halaman dibuka
  displayMessages();
}); // Akhir dari DOMContentLoaded

// 6. Fungsi Salin Rekening (Di luar DOMContentLoaded agar bisa diakses atribut onclick)
function copyText(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Nomor rekening berhasil disalin!");
    })
    .catch((err) => {
      console.error("Gagal menyalin: ", err);
    });
}
