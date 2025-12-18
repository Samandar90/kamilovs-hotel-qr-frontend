// === CONFIG (заполни после моих 3 вопросов) ===
const API_BASE = "https://kamilovs-hotel-qr-backend.onrender.com"; // FastAPI (Render/Railway/VPS)
const MANAGER_TG = "https://t.me/flottant3";      // менеджер
const MANAGER_TEL = "tel:+998950884141";  
       // телефон

const LS_LANG = "kh_lang";
const LS_ROOM = "kh_room";

const T = {
  ru: {
    title: "Добро пожаловать",
    sub: "Выберите действие — всё быстро и удобно с телефона.",
    reviewTitle: "Оставить отзыв",
    reviewSub: "Рейтинг и комментарий",
    menuTitle: "Меню",
    menuSub: "Категории и цены",
    contactTitle: "Связь с менеджером",
    contactSub: "Telegram или звонок",
    note: "Если у вас срочный вопрос — используйте звонок.",
    roomTitle: "Введите номер комнаты",
    roomSub: "Один раз — дальше подставится автоматически.",
    roomLabel: "Room",
    reviewHead: "Отзыв",
    reviewHint: "Спасибо — это помогает нам стать лучше.",
    name: "Имя",
    phone: "Телефон (необязательно)",
    text: "Комментарий",
    send: "Отправить",
    menuHead: "Меню",
    menuHint: "Актуальные позиции и цены",
    contactHead: "Менеджер",
    contactHint: "Выберите удобный способ связи",
    tg: "Telegram",
    call: "Позвонить",
    needRoom: "Введите номер комнаты",
    needStars: "Выберите рейтинг",
    needName: "Введите имя",
    needText: "Напишите комментарий",
    sent: "Отправлено. Спасибо!",
    fail: "Ошибка отправки. Попробуйте еще раз."
  },
  uz: {
    title: "Xush kelibsiz",
    sub: "Amalni tanlang — hammasi tez va qulay.",
    reviewTitle: "Fikr qoldirish",
    reviewSub: "Reyting va izoh",
    menuTitle: "Menyu",
    menuSub: "Bo‘limlar va narxlar",
    contactTitle: "Menejer bilan aloqa",
    contactSub: "Telegram yoki qo‘ng‘iroq",
    note: "Agar shoshilinch bo‘lsa — qo‘ng‘iroq qiling.",
    roomTitle: "Xona raqamini kiriting",
    roomSub: "Bir marta — keyin avtomatik qo‘yiladi.",
    roomLabel: "Xona",
    reviewHead: "Fikr",
    reviewHint: "Rahmat — bu bizga yaxshiroq bo‘lishga yordam beradi.",
    name: "Ism",
    phone: "Telefon (ixtiyoriy)",
    text: "Izoh",
    send: "Yuborish",
    menuHead: "Menyu",
    menuHint: "Aktual taomlar va narxlar",
    contactHead: "Menejer",
    contactHint: "Qulay usulni tanlang",
    tg: "Telegram",
    call: "Qo‘ng‘iroq",
    needRoom: "Xona raqamini kiriting",
    needStars: "Reytingni tanlang",
    needName: "Ismni kiriting",
    needText: "Izoh yozing",
    sent: "Yuborildi. Rahmat!",
    fail: "Yuborishda xatolik. Qayta urinib ko‘ring."
  },
  en: {
    title: "Welcome",
    sub: "Choose an option — fast and mobile-friendly.",
    reviewTitle: "Leave a review",
    reviewSub: "Rating and comment",
    menuTitle: "Menu",
    menuSub: "Categories and prices",
    contactTitle: "Contact manager",
    contactSub: "Telegram or call",
    note: "For urgent requests — please call.",
    roomTitle: "Enter your room number",
    roomSub: "Once — it will be reused automatically.",
    roomLabel: "Room",
    reviewHead: "Review",
    reviewHint: "Thank you — it helps us improve.",
    name: "Name",
    phone: "Phone (optional)",
    text: "Comment",
    send: "Send",
    menuHead: "Menu",
    menuHint: "Current items and prices",
    contactHead: "Manager",
    contactHint: "Choose a contact method",
    tg: "Telegram",
    call: "Call",
    needRoom: "Please enter room number",
    needStars: "Select a rating",
    needName: "Enter your name",
    needText: "Write a comment",
    sent: "Sent. Thank you!",
    fail: "Send failed. Please try again."
  }
};

const $ = (id) => document.getElementById(id);

let lang = (localStorage.getItem(LS_LANG) || "ru").toLowerCase();
if (!T[lang]) lang = "ru";

let rating = 0;
let activeCat = null;

// --- UI bind
const roomLine = $("roomLine");
const roomModal = $("roomModal");
const roomInput = $("roomInput");
const saveRoom = $("saveRoom");

const reviewModal = $("reviewModal");
const menuModal = $("menuModal");
const contactModal = $("contactModal");

const langBtn = $("langBtn");
const langMenu = $("langMenu");
const langLabel = $("langLabel");

const tgLink = $("tgLink");
const telLink = $("telLink");

// --- Room from URL: ?room=401 (always override saved room)
(function roomFromUrl(){
  const u = new URL(window.location.href);
  const r = (u.searchParams.get("room") || "").trim();
  if (!r) return;

  // override saved room
  localStorage.setItem("kh_room", r);

  // update header immediately (if exists)
  const line = document.getElementById("roomLine");
  if (line) line.textContent = `Room: ${r}`;

  // optional: clean URL (so it looks neat after scan)
  // u.searchParams.delete("room");
  // window.history.replaceState({}, "", u.toString());
})();


tgLink.href = MANAGER_TG;
telLink.href = MANAGER_TEL;

function setTexts() {
  const tr = T[lang];

  $("tTitle").textContent = tr.title;
  $("tSub").textContent = tr.sub;
  $("tReviewTitle").textContent = tr.reviewTitle;
  $("tReviewSub").textContent = tr.reviewSub;
  $("tMenuTitle").textContent = tr.menuTitle;
  $("tMenuSub").textContent = tr.menuSub;
  $("tContactTitle").textContent = tr.contactTitle;
  $("tContactSub").textContent = tr.contactSub;
  $("tNote").textContent = tr.note;

  $("tRoomTitle").textContent = tr.roomTitle;
  $("tRoomSub").textContent = tr.roomSub;
  $("tRoomLabel").textContent = tr.roomLabel;

  $("tReviewHead").textContent = tr.reviewHead;
  $("tReviewHint").textContent = tr.reviewHint;
  $("tName").textContent = tr.name;
  $("tPhone").textContent = tr.phone;
  $("tText").textContent = tr.text;
  $("sendReview").textContent = tr.send;

  $("tMenuHead").textContent = tr.menuHead;
  $("tMenuHint").textContent = tr.menuHint;

  $("tContactHead").textContent = tr.contactHead;
  $("tContactHint").textContent = tr.contactHint;

  tgLink.textContent = tr.tg;
  telLink.textContent = tr.call;

  langLabel.textContent = lang.toUpperCase();
}

function getRoom() {
  return (localStorage.getItem(LS_ROOM) || "").trim();
}

function setRoom(room) {
  localStorage.setItem(LS_ROOM, room);
  roomLine.textContent = `Room: ${room}`;
}

function openModal(el, sourceCardId = null) {
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");

  // micro stroke-draw on the source card icon
  if (sourceCardId && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const card = document.getElementById(sourceCardId);
    if (card) {
      card.classList.remove("is-draw"); // перезапуск
      // reflow to restart animation
      void card.offsetWidth;
      card.classList.add("is-draw");
      setTimeout(() => card.classList.remove("is-draw"), 650);
    }
  }
}


function closeModal(el) {
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
}

// --- Room from URL: ?room=304 (best for hotel QR)
(function roomFromUrl(){
  const u = new URL(window.location.href);
  const r = (u.searchParams.get("room") || "").trim();
  if (!r) return;
  localStorage.setItem("kh_room", r);
  const line = document.getElementById("roomLine");
  if (line) line.textContent = `Room: ${r}`;
})();


function ensureRoom() {
  const room = getRoom();
  if (!room) {
    openModal(roomModal);
    roomInput.focus();
    return false;
  }
  roomLine.textContent = `Room: ${room}`;
  return true;
}

// --- Language dropdown
langBtn.addEventListener("click", () => {
  langMenu.classList.toggle("is-open");
  langMenu.setAttribute("aria-hidden", langMenu.classList.contains("is-open") ? "false" : "true");
});

langMenu.addEventListener("click", (e) => {
  const l = e.target?.getAttribute?.("data-lang");
  if (!l) return;
  lang = l;
  localStorage.setItem(LS_LANG, lang);
  langMenu.classList.remove("is-open");
  setTexts();
  renderMenu();
});

// --- Room save
saveRoom.addEventListener("click", () => {
  const v = (roomInput.value || "").trim();
  if (!v) return;
  setRoom(v);
  closeModal(roomModal);
});

roomModal.querySelector(".modal__overlay").addEventListener("click", () => {
  // не закрываем, пока не введут
});

$("openReview").addEventListener("click", () => {
  if (!ensureRoom()) return;
  openModal(reviewModal, "openReview");
});
$("openMenu").addEventListener("click", () => {
  if (!ensureRoom()) return;
  openModal(menuModal, "openMenu");
});
$("openContact").addEventListener("click", () => {
  if (!ensureRoom()) return;
  openModal(contactModal, "openContact");
});

// --- Close buttons
document.addEventListener("click", (e) => {
  const key = e.target?.getAttribute?.("data-close");
  if (!key) return;
  if (key === "review") closeModal(reviewModal);
  if (key === "menu") closeModal(menuModal);
  if (key === "contact") closeModal(contactModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(reviewModal);
    closeModal(menuModal);
    closeModal(contactModal);
    langMenu.classList.remove("is-open");
  }
});

// --- Stars
function renderStars() {
  const box = $("stars");
  box.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "star" + (i <= rating ? " is-on" : "");
    b.textContent = "★";
    b.addEventListener("click", () => {
      rating = i;
      renderStars();
    });
    box.appendChild(b);
  }
}

function toast(el, msg) {
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-show"), 2400);
}

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || "Request failed");
  return data;
}

// --- Send review
$("sendReview").addEventListener("click", async () => {
  const tr = T[lang];
  const room = getRoom();
  if (!room) return toast($("reviewToast"), tr.needRoom);
  if (!rating) return toast($("reviewToast"), tr.needStars);

  const name = ($("nameInput").value || "").trim();
  const phone = ($("phoneInput").value || "").trim();
  const text = ($("textInput").value || "").trim();

  if (!name) return toast($("reviewToast"), tr.needName);
  if (!text) return toast($("reviewToast"), tr.needText);

  try {
    $("sendReview").disabled = true;
    await postJSON(`${API_BASE}/api/review`, {
      lang,
      room,
      rating,
      name,
      phone: phone || null,
      text,
      client_ts: new Date().toISOString(),
    });
    toast($("reviewToast"), tr.sent);
    $("textInput").value = "";
    closeModal(reviewModal);
  } catch (e) {
    toast($("reviewToast"), tr.fail);
  } finally {
    $("sendReview").disabled = false;
  }
});

// --- Menu render
function moneyUZS(n) {
  try { return new Intl.NumberFormat("ru-RU").format(n) + " сум"; }
  catch { return `${n} сум`; }
}

function renderMenu() {
  const cats = $("menuCats");
  const list = $("menuList");
  const data = window.MENU_DATA || [];

  if (!activeCat) activeCat = data[0]?.id || null;

  cats.innerHTML = "";
  for (const c of data) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (c.id === activeCat ? " is-active" : "");
    b.textContent = (c.i18n?.[lang] || c.i18n?.ru || "Category");
    b.addEventListener("click", () => {
      activeCat = c.id;
      renderMenu();
    });
    cats.appendChild(b);
  }

  const cat = data.find(x => x.id === activeCat) || data[0];
  list.innerHTML = "";

  (cat?.items || []).forEach(it => {
    const el = document.createElement("div");
    el.className = "item";
    const name = it.i18n?.[lang] || it.i18n?.ru || "";
    const desc = it.desc?.[lang] || it.desc?.ru || "";
    el.innerHTML = `
      <div class="item__row">
        <div>
          <div class="item__name">${escapeHtml(name)}</div>
          <div class="item__desc">${escapeHtml(desc)}</div>
        </div>
        <div class="item__price">${moneyUZS(it.price || 0)}</div>
      </div>
    `;
    list.appendChild(el);
  });
}

function escapeHtml(s){
  return String(s||"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// INIT
setTexts();
renderStars();
renderMenu();
ensureRoom();


// --- Premium micro-motion (very subtle)
(function premiumMotion() {
  const glow = document.querySelector(".glow");
  const cards = document.querySelectorAll(".card");

  if (!glow || !cards.length) return;

  let raf = 0;
  window.addEventListener("deviceorientation", (e) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (e.gamma || 0) / 45; // left-right
    const y = (e.beta || 0) / 45;  // front-back

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) scale(1.02)`;
      cards.forEach((c, i) => {
        const k = (i % 3) - 1;
        c.style.transform = `translate3d(${x * (2 + k)}px, ${y * (2 - k)}px, 0)`;
      });
    });
  }, { passive: true });
})();

$("changeRoom").addEventListener("click", () => {
  openModal(roomModal);
  roomInput.focus();
});
