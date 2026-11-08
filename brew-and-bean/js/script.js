/* =========================================================
   BREW & BEAN CAFE - script.js
   Topics used: variables, arrays, objects, loops, functions,
   conditions, DOM manipulation, events, timers, Date,
   form validation, localStorage
   ========================================================= */

// ================== DATA ==================
const menuItems = [
  { id: 1,  name: "Espresso",          cat: "coffee",   price: 120, emoji: "☕", desc: "Strong, bold and rich single shot." },
  { id: 2,  name: "Cappuccino",        cat: "coffee",   price: 160, emoji: "☕", desc: "Espresso with silky steamed milk foam." },
  { id: 3,  name: "Iced Cold Coffee",  cat: "coffee",   price: 180, emoji: "🧋", desc: "Chilled, creamy and perfectly sweet." },
  { id: 4,  name: "Caffe Latte",       cat: "coffee",   price: 170, emoji: "🥛", desc: "Smooth espresso blended with warm milk." },
  { id: 5,  name: "Masala Chai",       cat: "tea",      price: 90,  emoji: "🍵", desc: "Desi tea brewed with fresh spices." },
  { id: 6,  name: "Green Tea",         cat: "tea",      price: 100, emoji: "🍃", desc: "Light, refreshing and full of antioxidants." },
  { id: 7,  name: "Veg Club Sandwich", cat: "snacks",   price: 140, emoji: "🥪", desc: "Grilled sandwich with fresh veggies and cheese." },
  { id: 8,  name: "Paneer Wrap",       cat: "snacks",   price: 180, emoji: "🌯", desc: "Spicy paneer tikka rolled in a soft wrap." },
  { id: 9,  name: "Creamy Pasta",      cat: "snacks",   price: 220, emoji: "🍝", desc: "White sauce pasta with herbs and cheese." },
  { id: 10, name: "Choco Brownie",     cat: "desserts", price: 130, emoji: "🍫", desc: "Warm fudgy brownie with chocolate drizzle." },
  { id: 11, name: "Cheesecake Slice",  cat: "desserts", price: 190, emoji: "🍰", desc: "Classic baked cheesecake with berry topping." },
  { id: 12, name: "Blueberry Muffin",  cat: "desserts", price: 110, emoji: "🧁", desc: "Soft muffin loaded with blueberries." }
];

const specials = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  .map((day, i) => ({ day, itemId: [11, 2, 5, 4, 8, 3, 10][i] }));   // one special for each weekday

const quotes = [
  { text: "The best cappuccino in town and the nicest staff!", by: "- Aarav, Student" },
  { text: "My go-to place for work and a perfect brownie.", by: "- Priya, Designer" },
  { text: "Online ordering is so quick, no waiting at all.", by: "- Rohan, Engineer" }
];

const team = [
  { face: "👩‍🍳", name: "Meera", role: "Head Barista" },
  { face: "👨‍🍳", name: "Karan", role: "Pastry Chef" },
  { face: "🧑‍💼", name: "Ananya", role: "Manager" },
  { face: "🧑‍🔧", name: "Dev", role: "Coffee Roaster" }
];

const galleryItems = [
  { emoji: "☕", label: "Fresh Espresso",   bg: "linear-gradient(135deg,#8c4a10,#d98a3d)" },
  { emoji: "🥐", label: "Morning Bakes",    bg: "linear-gradient(135deg,#d98a3d,#f5c77e)" },
  { emoji: "🍰", label: "Cheesecake",       bg: "linear-gradient(135deg,#d6609b,#f7a8c4)" },
  { emoji: "🌿", label: "Cosy Corner",      bg: "linear-gradient(135deg,#2f7d4f,#7bc89a)" },
  { emoji: "🎶", label: "Live Music Night", bg: "linear-gradient(135deg,#5b3df5,#a58bff)" },
  { emoji: "🧋", label: "Iced Coffee",      bg: "linear-gradient(135deg,#3b82f6,#7cc4ff)" },
  { emoji: "📚", label: "Book Club",        bg: "linear-gradient(135deg,#b45309,#f59e0b)" },
  { emoji: "🍫", label: "Choco Brownie",    bg: "linear-gradient(135deg,#4b2a1d,#8b5a3c)" },
  { emoji: "🎂", label: "Birthday Bash",    bg: "linear-gradient(135deg,#ef4444,#fb923c)" }
];

const faqs = [
  { q: "Do you offer home delivery?",       a: "Right now we offer pickup and dine-in. Delivery is coming soon!" },
  { q: "Do you have vegan options?",        a: "Yes! We offer oat and almond milk for all coffee drinks." },
  { q: "Can I book the cafe for a party?",  a: "Absolutely. Send us a message with the subject 'Catering / Events'." },
  { q: "Is there free Wi-Fi?",              a: "Yes, free high-speed Wi-Fi for all our guests." }
];

const COUPONS = { BREW10: 10, STUDENT15: 15 };      // coupon code -> % off

// ================== HELPERS ==================
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const rupee = (n) => "₹" + Math.round(n);

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- cart (saved in localStorage so it works across pages) ----------
function getCart() { return JSON.parse(localStorage.getItem("bbCart")) || {}; }
function saveCart(cart) { localStorage.setItem("bbCart", JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const total = Object.values(getCart()).reduce((a, b) => a + b, 0);
  const badge = $("#cartCount");
  badge.textContent = total;
  badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
}
function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  toast("✅ " + menuItems.find(m => m.id === id).name + " added to order");
}

// ---------- reusable menu card ----------
function itemCard(item) {
  return `
    <article class="item">
      <div class="item-img">${item.emoji}</div>
      <div class="item-body">
        <span class="tag">${item.cat}</span>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="item-foot">
          <span class="price">${rupee(item.price)}</span>
          <button class="add-btn" data-add="${item.id}">+ Add</button>
        </div>
      </div>
    </article>`;
}
// one listener for every "+ Add" button on the page (event delegation)
document.addEventListener("click", (e) => {
  if (e.target.dataset.add) addToCart(Number(e.target.dataset.add));
});

// ================== COMMON (all pages) ==================
$("#year").textContent = new Date().getFullYear();
updateCartCount();

// dark mode (remembered)
const themeBtn = $("#themeToggle");
function applyTheme(dark) { document.body.classList.toggle("dark", dark); themeBtn.textContent = dark ? "☀️" : "🌙"; }
applyTheme(localStorage.getItem("bbTheme") === "dark");
themeBtn.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);
  localStorage.setItem("bbTheme", dark ? "dark" : "light");
});

// mobile menu
$("#menuBtn").addEventListener("click", () => $("#navLinks").classList.toggle("open"));

// open / closed status using the Date object (open 8 AM - 10 PM)
(function () {
  const hour = new Date().getHours();
  const el = $("#openStatus");
  const open = hour >= 8 && hour < 22;
  el.textContent = open ? "🟢 We're open now!" : "🔴 Closed right now (opens 8 AM)";
  el.classList.add(open ? "open" : "closed");
})();

// back to top
window.addEventListener("scroll", () => $("#toTop").classList.toggle("show", scrollY > 450));
$("#toTop").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

// scroll-reveal + animated counters
function runCounter(el) {
  const target = Number(el.dataset.target);
  const step = Math.max(1, Math.ceil(target / 60));
  let n = 0;
  const t = setInterval(() => { n += step; if (n >= target) { n = target; clearInterval(t); } el.textContent = n; }, 25);
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    en.target.querySelectorAll(".counter").forEach(runCounter);
    observer.unobserve(en.target);
  });
}, { threshold: 0.15 });
$$(".reveal, .stats").forEach(el => observer.observe(el));

// ================== HOME PAGE ==================
if ($("#featuredGrid")) {
  // bestsellers = first 3 items picked by id
  [2, 11, 8].forEach(id => $("#featuredGrid").innerHTML += itemCard(menuItems.find(m => m.id === id)));

  // today's special depends on the day of the week
  const today = specials[new Date().getDay()];
  const item = menuItems.find(m => m.id === today.itemId);
  $("#specialDay").textContent = `${today.day}'s Special`;
  $("#specialEmoji").textContent = item.emoji;
  $("#specialName").textContent = item.name;
  $("#specialDesc").textContent = item.desc;
  $("#specialPrice").textContent = rupee(item.price);
  $("#specialBtn").addEventListener("click", () => addToCart(item.id));

  // testimonial slider with auto-rotate
  let q = 0;
  const dots = $("#quoteDots");
  quotes.forEach((_, i) => { dots.innerHTML += `<button data-i="${i}" aria-label="Quote ${i + 1}"></button>`; });
  function showQuote(i) {
    q = i;
    const box = $("#quoteText");
    box.classList.add("fade");
    setTimeout(() => {
      box.textContent = `“${quotes[i].text}”`;
      $("#quoteBy").textContent = quotes[i].by;
      box.classList.remove("fade");
    }, 300);
    $$("#quoteDots button").forEach((b, idx) => b.classList.toggle("on", idx === i));
  }
  dots.addEventListener("click", e => { if (e.target.dataset.i) showQuote(Number(e.target.dataset.i)); });
  showQuote(0);
  setInterval(() => showQuote((q + 1) % quotes.length), 4500);
}

// ================== ABOUT PAGE ==================
if ($("#teamGrid")) {
  team.forEach(m => {
    $("#teamGrid").innerHTML += `<div class="member"><div class="face">${m.face}</div><h3>${m.name}</h3><p>${m.role}</p></div>`;
  });
}

// ================== MENU PAGE (search + filter + sort) ==================
if ($("#menuGrid")) {
  let category = "all";

  function renderMenu() {
    const text = $("#searchBox").value.toLowerCase().trim();
    const sort = $("#sortBox").value;

    let list = menuItems.filter(m =>
      (category === "all" || m.cat === category) &&
      (m.name.toLowerCase().includes(text) || m.desc.toLowerCase().includes(text)));

    if (sort === "low")  list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    $("#menuGrid").innerHTML = list.map(itemCard).join("");
    $("#noResult").hidden = list.length > 0;
  }

  $("#filters").addEventListener("click", e => {
    if (!e.target.dataset.cat) return;
    $$(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    category = e.target.dataset.cat;
    renderMenu();
  });
  $("#searchBox").addEventListener("input", renderMenu);
  $("#sortBox").addEventListener("change", renderMenu);
  renderMenu();
}

// ================== ORDER PAGE (cart + coupon + checkout) ==================
if ($("#cartBox")) {
  let discountPercent = 0;

  function renderCart() {
    const cart = getCart();
    const ids = Object.keys(cart);
    const box = $("#cartBox");

    if (ids.length === 0) {
      box.innerHTML = `<div class="empty"><div class="big">🛒</div><h3>Your order is empty</h3><p>Add something tasty from the menu!</p><br><a href="menu.html" class="btn btn-primary">Browse Menu</a></div>`;
    } else {
      box.innerHTML = "<h3>Items</h3>" + ids.map(id => {
        const item = menuItems.find(m => m.id === Number(id));
        return `
          <div class="cart-row">
            <div class="cart-name">${item.emoji} ${item.name}<small>${rupee(item.price)} each</small></div>
            <div class="qty">
              <button data-act="minus" data-id="${id}">−</button>
              <b>${cart[id]}</b>
              <button data-act="plus" data-id="${id}">+</button>
            </div>
            <b>${rupee(item.price * cart[id])}</b>
            <button class="remove" data-act="remove" data-id="${id}" title="Remove">🗑️</button>
          </div>`;
      }).join("");
    }

    // totals
    let subtotal = 0;
    ids.forEach(id => subtotal += menuItems.find(m => m.id === Number(id)).price * cart[id]);
    const discount = subtotal * discountPercent / 100;
    const gst = (subtotal - discount) * 0.05;
    $("#sSub").textContent = rupee(subtotal);
    $("#sDisc").textContent = "-" + rupee(discount);
    $("#sGst").textContent = rupee(gst);
    $("#sTotal").textContent = rupee(subtotal - discount + gst);
  }

  $("#cartBox").addEventListener("click", e => {
    const act = e.target.dataset.act;
    if (!act) return;
    const id = e.target.dataset.id;
    const cart = getCart();
    if (act === "plus") cart[id]++;
    if (act === "minus") { cart[id]--; if (cart[id] <= 0) delete cart[id]; }
    if (act === "remove") delete cart[id];
    saveCart(cart);
    renderCart();
  });

  $("#applyCoupon").addEventListener("click", () => {
    const code = $("#coupon").value.trim().toUpperCase();
    const msg = $("#couponMsg");
    if (COUPONS[code]) {
      discountPercent = COUPONS[code];
      msg.textContent = `🎉 Coupon applied: ${discountPercent}% off`;
      msg.style.color = "#16a34a";
    } else {
      discountPercent = 0;
      msg.textContent = "❌ Invalid coupon code";
      msg.style.color = "#e5484d";
    }
    renderCart();
  });

  $("#checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#cName").value.trim();
    const phone = $("#cPhone").value.trim();
    let ok = true;
    $("#cNameErr").textContent = ""; $("#cPhoneErr").textContent = "";

    if (Object.keys(getCart()).length === 0) { toast("Your order is empty!"); return; }
    if (name.length < 2) { $("#cNameErr").textContent = "Please enter your name."; ok = false; }
    if (!/^[6-9]\d{9}$/.test(phone)) { $("#cPhoneErr").textContent = "Enter a valid 10-digit mobile number."; ok = false; }
    if (!ok) return;

    const orderNo = "BB" + Math.floor(1000 + Math.random() * 9000);
    $("#orderMsg").textContent = `Thank you ${name}! Your order #${orderNo} (${$("#cType").value}) will be ready in about 15 minutes. Total: ${$("#sTotal").textContent}`;
    $("#orderModal").classList.remove("hidden");
    localStorage.removeItem("bbCart");
    updateCartCount();
    renderCart();
  });

  renderCart();
}

// ================== GALLERY PAGE (lightbox) ==================
if ($("#galleryGrid")) {
  let current = 0;
  galleryItems.forEach((g, i) => {
    $("#galleryGrid").innerHTML += `<div class="g-tile" style="background:${g.bg}" data-i="${i}">${g.emoji}<span>${g.label}</span></div>`;
  });

  function openLightbox(i) {
    current = (i + galleryItems.length) % galleryItems.length;     // wraps around
    const g = galleryItems[current];
    $("#lbContent").style.background = g.bg;
    $("#lbContent").innerHTML = `${g.emoji}<small>${g.label}</small>`;
    $("#lightbox").classList.remove("hidden");
  }
  const closeLightbox = () => $("#lightbox").classList.add("hidden");

  $("#galleryGrid").addEventListener("click", e => {
    const tile = e.target.closest(".g-tile");
    if (tile) openLightbox(Number(tile.dataset.i));
  });
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => openLightbox(current - 1));
  $("#lbNext").addEventListener("click", () => openLightbox(current + 1));
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") closeLightbox(); });
  document.addEventListener("keydown", e => {                       // keyboard support
    if ($("#lightbox").classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(current - 1);
    if (e.key === "ArrowRight") openLightbox(current + 1);
  });
}

// ================== CONTACT PAGE ==================
if ($("#contactForm")) {
  // live character counter
  $("#message").addEventListener("input", () => {
    $("#charCount").textContent = `(${$("#message").value.length}/200)`;
  });

  // FAQ accordion
  faqs.forEach(f => {
    $("#faqList").innerHTML += `<div class="faq"><button class="faq-q">${f.q}</button><div class="faq-a">${f.a}</div></div>`;
  });
  $("#faqList").addEventListener("click", e => {
    if (!e.target.classList.contains("faq-q")) return;
    const box = e.target.parentElement;
    const wasOpen = box.classList.contains("open");
    $$(".faq").forEach(f => f.classList.remove("open"));           // close all
    if (!wasOpen) box.classList.add("open");
  });

  // validation
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const subject = $("#subject").value;
    const message = $("#message").value.trim();
    let ok = true;
    ["nameError", "emailError", "subjectError", "messageError", "formSuccess"].forEach(id => $("#" + id).textContent = "");

    if (name.length < 2) { $("#nameError").textContent = "Please enter your name."; ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("#emailError").textContent = "Please enter a valid email."; ok = false; }
    if (subject === "") { $("#subjectError").textContent = "Please choose a subject."; ok = false; }
    if (message.length < 10) { $("#messageError").textContent = "Message must be at least 10 characters."; ok = false; }

    if (ok) {
      $("#formSuccess").textContent = `Thanks ${name}! We'll reply to ${email} soon. ✅`;
      e.target.reset();
      $("#charCount").textContent = "(0/200)";
    }
  });
}
