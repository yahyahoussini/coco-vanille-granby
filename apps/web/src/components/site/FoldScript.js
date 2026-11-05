// A real inline <script> in the <head> of the three public layouts: next/script's beforeInteractive lands at the end of
// <body>, so a page used to paint open and then collapse. What it does cannot wait for React:
//   html.js    set before the first paint, so the clamp of site.css is there from the first frame. Without JavaScript the
//              class never comes: every block shows in full, with no button.
//   measure    a block that would hide less than about a line and a half stays open, with no button.
//   click      « Lire la suite » works before hydration, and after it: this one listener owns the open state, which lives
//              in the DOM (data-open, aria-expanded), so React and the page can never disagree (ReadMore.js renders the
//              button once and never touches those).
//   scroll     the browser scrolled inside the clip (Ctrl+F, a search engine's text fragment): the block opens and the
//              words stay where they are on screen. A scroll event does not bubble, hence the capture.
//   focusin    the keyboard reached a link inside the clip: the block opens, nothing focused sits behind the fade.
// A #anchor inside a block needs no script: site.css opens it (:has(:target)), and the measure then finds that it fits.
// Allowed by the only script policy on the public host, the checkout's ('unsafe-inline', next.config.mjs). Plain old
// JavaScript and no line comment inside: it is sent as it stands on every page.
const SOURCE = `(function (d, w) {
  d.documentElement.classList.add('js');
  function button(box) { return box.querySelector('.read-more'); }
  function set(box, b, open) {
    box.toggleAttribute('data-open', open);
    b.setAttribute('aria-expanded', open);
    b.firstElementChild.textContent = open ? b.dataset.less : b.dataset.more;
  }
  function measure(box) {
    var b = button(box), body = box.querySelector('.clamp-body');
    if (!b || !body || b.getAttribute('aria-expanded') === 'true') return;
    box.removeAttribute('data-open');
    var fits = body.scrollHeight - body.clientHeight <= (parseFloat(getComputedStyle(body).lineHeight) || 26) * 1.5;
    box.toggleAttribute('data-open', fits);
    b.hidden = fits;
  }
  function measureAll() { d.querySelectorAll('[data-clamp]').forEach(measure); }
  w.cocoFold = measure;
  d.addEventListener('DOMContentLoaded', measureAll);
  if (d.fonts) d.fonts.ready.then(measureAll);
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.read-more');
    var box = b && b.closest('[data-clamp]');
    if (!box) return;
    var open = b.getAttribute('aria-expanded') !== 'true', top = b.getBoundingClientRect().top;
    set(box, b, open);
    if (!open) w.scrollBy({ top: b.getBoundingClientRect().top - top, behavior: 'instant' });
  });
  d.addEventListener('scroll', function (e) {
    var body = e.target, box = body.closest && body.classList.contains('clamp-body') && body.closest('[data-clamp]');
    var b = box && button(box), shift = body.scrollTop;
    if (!b || !shift) return;
    set(box, b, true);
    w.scrollBy({ top: shift, behavior: 'instant' });
  }, true);
  d.addEventListener('focusin', function (e) {
    var t = e.target, body = t.closest && t.closest('.clamp-body'), box = body && body.closest('[data-clamp]');
    var b = box && button(box);
    if (b && !box.hasAttribute('data-open') && t.matches(':focus-visible')) set(box, b, true);
  });
})(document, window);`

export function FoldScript() {
  return <script dangerouslySetInnerHTML={{ __html: SOURCE }} />
}
