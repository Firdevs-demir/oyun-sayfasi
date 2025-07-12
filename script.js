const sorular = [
  {
    ses: "أَخِي.mp3",
    dogru: "أَخِي",
    secenekler: ["أَخِي", "دِينُ", "قَدِيرُ"],
  },
  {
    ses: "قَالَ.mp3",
    dogru: "قَالَ",
    secenekler: ["قَالَ", "كَانَ", "كِتَابُ"],
  },
  {
    ses: "كِتَابُ.mp3",
    dogru: "كِتَابُ",
    secenekler: ["رَسُولُ", "كِتَابُ", "جِبَالَ"],
  },
  {
    ses: "عَظِيمُ.mp3",
    dogru: "عَظِيمُ",
    secenekler: ["عَظِيمُ", "عَابِدُونَ", "عَالَمِينَ"],
  },
  {
    ses: "يَشْكُرُونَ.mp3",
    dogru: "يَشْكُرُونَ",
    secenekler: ["تَعْبُدُونَ", "يَشْكُرُونَ", "يَعْلَمُونَ"],
  },
  {
    ses: "يَسْتَطِيعُونَ.mp3",
    dogru: "يَسْتَطِيعُونَ",
    secenekler: ["تَعْبُدُونَ", "يَسْتَطِيعُونَ", "يَعْلَمُونَ"],
  },
  {
    ses: "تَعْبُدُونَ.mp3",
    dogru: "تَعْبُدُونَ",
    secenekler: ["عَالَمِينَ", "يَعْلَمُونَ", "تَعْبُدُونَ"],
  },
  {
    ses: "مُجَاهِدُونَ.mp3",
    dogru: "مُجَاهِدُونَ",
    secenekler: ["مُهَاجِرُونَ", "يَسْتَطيعُونَ", "مُجَاهِدُونَ"],
  },
  {
    ses: "صَادِقِينَ.mp3",
    dogru: "صَادِقِينَ",
    secenekler: ["مُسْتَقيمُ", "صَادِقِينَ", "رَمَضَانَ"],
  },
  {
    ses: "مُؤْمِنِينَ.mp3",
    dogru: "مُؤْمِنِينَ",
    secenekler: ["رَمَضَانَ", "مَا دَامَ", "مُؤْمِنِينَ"],
  },
];

let soruIndex = 0;
let skor = 0;
let sure = 10;
let zamanlayici;

const optionsContainer = document.getElementById("options");
const playSoundBtn = document.getElementById("play-sound");
const nextBtn = document.getElementById("next-btn");
const nextContainer = document.getElementById("next-container");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const dogruSes = document.getElementById("dogru-ses");
const yanlisSes = document.getElementById("yanlis-ses");
const alkis = document.getElementById("alkis-sesi");
const yorege = document.getElementById("yönerge");

function soruYukle() {
  clearInterval(zamanlayici);
  sure = 10;
  timerEl.textContent = `⏳ Süre: ${sure}s`;

  optionsContainer.innerHTML = "";
  nextContainer.style.display = "none";
  if (yorege) yorege.style.display = "block";

  const soru = sorular[soruIndex];

  soru.secenekler.forEach((kelime) => {
    const btn = document.createElement("button");
    btn.textContent = kelime;
    btn.onclick = () => cevapKontrol(btn, kelime === soru.dogru);
    optionsContainer.appendChild(btn);
  });

  zamanlayici = setInterval(() => {
    sure--;
    timerEl.textContent = `⏳ Süre: ${sure}s`;
    if (sure <= 0) {
      clearInterval(zamanlayici);
      cevapKontrol(null, false, true);
    }
  }, 1000);
}

function cevapKontrol(button, dogruMu, sureBitti = false) {
  clearInterval(zamanlayici);

  const butonlar = document.querySelectorAll("#options button");
  butonlar.forEach((btn) => (btn.disabled = true));

  const dogruKelime = sorular[soruIndex].dogru;
  const dogruBtn = [...butonlar].find((btn) => btn.textContent === dogruKelime);

  if (dogruMu && !sureBitti) {
    if (button) {
      button.classList.remove("correct");
      void button.offsetWidth; // Reflow için
      button.classList.add("correct");
    }
    skor++;
    scoreEl.textContent = `🧠 Skor: ${skor}`;
    dogruSes.play();
  } else {
    if (button) {
      button.classList.remove("wrong");
      void button.offsetWidth; // Reflow için
      button.classList.add("wrong");
    }
    if (dogruBtn) {
      dogruBtn.classList.remove("correct");
      void dogruBtn.offsetWidth; // Reflow için
      dogruBtn.classList.add("correct");
    }
    yanlisSes.play();
  }

  nextContainer.style.display = "block";
}

playSoundBtn.addEventListener("click", async () => {
  const soru = sorular[soruIndex];
  const ses = new Audio("sesler/" + soru.ses);
  try {
    await ses.play();
  } catch (err) {
    console.error("Ses çalınamadı:", err);
    alert("Ses oynatılamadı. Lütfen tekrar deneyin.");
  }
});

nextBtn.addEventListener("click", () => {
  soruIndex++;
  if (soruIndex < sorular.length) {
    soruYukle();
  } else {
    clearInterval(zamanlayici);
    optionsContainer.innerHTML = `
      <h2>🎉 Tebrikler!</h2>
      <p>Doğru Sayısı: ${skor} / ${sorular.length}</p>
    `;
    playSoundBtn.style.display = "none";
    nextContainer.style.display = "none";
    timerEl.style.display = "none";
    if (yorege) yorege.style.display = "none";

    if (alkis) {
      alkis.play().catch((e) => console.warn("Alkış sesi oynatılamadı:", e));
    }

    // Konfeti başlat (confetti kütüphanesi varsa)
    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }
});

soruYukle();
