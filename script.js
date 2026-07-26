(function(){
  "use strict";

  /* ---------- Yıl ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: scroll durumu + ilerleme çubuğu ---------- */
  var header = document.getElementById('siteHeader');
  var scrollBar = document.getElementById('scrollBar');

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 40);

    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docH > 0 ? (y / docH) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil menü ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu(){
    if (menuToggle) menuToggle.classList.remove('open');
    if (mobileNav) mobileNav.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function(){
      var isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a[data-nav]').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  /* Hero içeriği ayrı, kademeli bir giriş animasyonu ile yönetiliyor (aşağıda);
     burada tekrar tetiklenmesini önlemek için hariç tutuluyor. */
  var revealEls = Array.prototype.filter.call(
    document.querySelectorAll('.reveal'),
    function(el){ return !el.closest('.hero-content'); }
  );
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* Hero girişini sayfa yüklenir yüklenmez tetikle (kademeli) */
  window.addEventListener('load', function(){
    var heroReveals = document.querySelectorAll('.hero-content .reveal');
    heroReveals.forEach(function(el, i){
      setTimeout(function(){ el.classList.add('in'); }, 150 + i * 130);
    });
  });

  /* ---------- Tedaviler: editoryal akordeon (tek açık) ---------- */
  var treatmentItems = document.querySelectorAll('.treatment-item');
  treatmentItems.forEach(function(item){
    var trigger = item.querySelector('.treatment-trigger');
    var panel = item.querySelector('.treatment-panel');
    trigger.addEventListener('click', function(){
      var isOpen = item.getAttribute('data-open') === 'true';
      treatmentItems.forEach(function(other){
        other.setAttribute('data-open', 'false');
        other.querySelector('.treatment-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- SSS akordeon (tek açık) ---------- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item){
    var trigger = item.querySelector('.faq-trigger');
    var panel = item.querySelector('.faq-panel');
    trigger.addEventListener('click', function(){
      var isOpen = item.getAttribute('data-open') === 'true';
      faqItems.forEach(function(other){
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Öncesi / Sonrası: sürüklenebilir karşılaştırma ---------- */
  var frame = document.querySelector('.compare-frame');
  var beforeWrap = document.getElementById('compareBeforeWrap');
  var handle = document.getElementById('compareHandle');

  if (frame && beforeWrap && handle) {
    var dragging = false;

    function setPosition(clientX){
      var rect = frame.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      var pct = (x / rect.width) * 100;
      beforeWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
    }

    function start(e){
      dragging = true;
      frame.classList.add('dragging');
    }
    function move(e){
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    }
    function end(){ dragging = false; frame.classList.remove('dragging'); }

    frame.addEventListener('mousedown', function(e){ start(); move(e); });
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    frame.addEventListener('touchstart', function(e){ start(); move(e); }, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);

    /* Görünüme girince yumuşak bir tanıtım animasyonu */
    if ('IntersectionObserver' in window) {
      var compareIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            setPosition(frame.getBoundingClientRect().left + frame.getBoundingClientRect().width * 0.5);
            compareIO.unobserve(frame);
          }
        });
      }, { threshold: 0.4 });
      compareIO.observe(frame);
    }
  }

  /* ---------- Aktif nav linkini vurgula ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.main-nav a[data-nav]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('.main-nav a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function(l){ l.style.color = ''; });
          link.style.color = 'var(--ink)';
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function(s){ navIO.observe(s); });
  }

})();
