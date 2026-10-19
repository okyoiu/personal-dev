// Scroll reveal: [data-reveal] blocks get .is-in once they enter the viewport.
// shortcut: the CSS only hides reveal blocks under .motion, and this file adds
// .is-in; if this file fails to load those blocks stay hidden, so keep it tiny.
const reveal = document.querySelectorAll("[data-reveal]");
if (!document.documentElement.classList.contains("motion") || !("IntersectionObserver" in window)) {
  reveal.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  reveal.forEach((el) => io.observe(el));
}

// Hero switch: who labels the photo, the model or me
const photo = document.querySelector(".hero-photo");
document.querySelectorAll(".switch button").forEach((btn, _, all) => btn.addEventListener("click", () => {
  photo.dataset.labels = btn.dataset.labels;
  all.forEach((b) => b.setAttribute("aria-pressed", b === btn));
}));

// Experience: one box tracks the role being read (hovered, or crossing mid-screen)
const roles = document.querySelector(".xp-roles");
if (roles) {
  const track = roles.querySelector(".track");
  const items = roles.querySelectorAll(".xp-role");
  let active = items[0];
  const lock = (li = active) => {
    active = li;
    track.style.transform = `translateY(${li.offsetTop}px)`;
    track.style.height = `${li.offsetHeight}px`;
    track.firstElementChild.textContent = li.dataset.label;
  };
  items.forEach((li) => li.addEventListener("pointerenter", () => lock(li)));
  if ("IntersectionObserver" in window) {
    const mid = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && lock(e.target)),
      { rootMargin: "-45% 0px -50% 0px" });
    items.forEach((li) => mid.observe(li));
  }
  new ResizeObserver(() => lock()).observe(roles);   // re-measure when fonts load or the width changes
}

// Top bar: a tone step once the page scrolls under it, and the model's box on the tab for where you
// are. Subpages mark their own tab; the home page marks the tab whose section crosses mid-screen.
const nav = document.querySelector(".topnav");
const bar = nav.parentElement;
const navBox = nav.querySelector(".nav-box");
let here = nav.querySelector('[aria-current="page"]');
const mark = (tab = here) => {
  here = tab;
  nav.classList.toggle("has-box", !!tab);
  nav.querySelectorAll("a").forEach((a) => a.classList.toggle("is-here", a === tab));
  if (tab) { navBox.style.setProperty("--x", `${tab.offsetLeft}px`); navBox.style.setProperty("--w", `${tab.offsetWidth}px`); }
};
addEventListener("scroll", () => bar.classList.toggle("is-scrolled", scrollY > 8), { passive: true });
if (!here && "IntersectionObserver" in window) {
  // every top-level section counts, so the hero, "Right now" and the letter clear the box
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) mark(e.target.id ? nav.querySelector(`[data-nav="${e.target.id}"]`) : null);
  }), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main > section").forEach((s) => spy.observe(s));
}
new ResizeObserver(() => mark()).observe(nav);   // re-measure when fonts load or the width changes
