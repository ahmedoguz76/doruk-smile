(function () {
  "use strict";

  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduced() { return mqReduce.matches; }

  /* ---------- Yıl ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Header durumu + ilerleme çubuğu + mobil CTA ---------- */
  var header = document.getElementById("siteHeader");
  var scrollBar = document.getElementById("scrollBar");
  var mobileCta = document.getElementById("mobileCta");
  var hero = document.getElementById("hero");

  function setCtaVisible(show) {
    if (!mobileCta) return;
    mobileCta.classList.toggle("show", show);
    mobileCta.setAttribute("aria-hidden", String(!show));
    // Gizliyken içindeki linkler odak/etkileşim almasın
    if ("inert" in HTMLElement.prototype) mobileCta.inert = !show;
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (header) header.classList.toggle("scrolled", y > 40);

    if (scrollBar) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
    }

    if (mobileCta) {
      var trigger = hero ? hero.offsetHeight - 120 : 240;
      setCtaVisible(y > trigger);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil menü (erişilebilir) ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var lastFocusBeforeMenu = null;

  function menuFocusables() {
    return mobileNav
      ? Array.prototype.slice.call(
          mobileNav.querySelectorAll('a[href], button:not([disabled])')
        )
      : [];
  }

  function setMenu(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle("open", open);
    if ("inert" in HTMLElement.prototype) mobileNav.inert = !open;
    mobileNav.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";

    if (menuToggle) {
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    }

    if (open) {
      lastFocusBeforeMenu = document.activeElement;
      var f = menuFocusables();
      if (f.length) f[0].focus();
    } else {
      // Menü her zaman hamburger butonundan açıldığı için odak oraya döner
      var back = (menuToggle && menuToggle.offsetParent !== null) ? menuToggle
                 : (lastFocusBeforeMenu && lastFocusBeforeMenu.focus ? lastFocusBeforeMenu : null);
      if (back) back.focus();
      lastFocusBeforeMenu = null;
    }
  }

  if (menuToggle && mobileNav) {
    // Başlangıçta kapalı: odak alınamaz
    if ("inert" in HTMLElement.prototype) mobileNav.inert = true;
    mobileNav.setAttribute("aria-hidden", "true");

    menuToggle.addEventListener("click", function () {
      setMenu(!mobileNav.classList.contains("open"));
    });

    mobileNav.querySelectorAll("a[data-nav]").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (!mobileNav.classList.contains("open")) return;
      if (e.key === "Escape") {
        setMenu(false);
        return;
      }
      // Basit odak tuzağı
      if (e.key === "Tab") {
        var f = menuFocusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* Viewport genişleyince (mobil menü kırılım noktası aşılınca) menüyü sıfırla */
  var mqDesktop = window.matchMedia("(min-width: 901px)");
  function syncMenuToViewport() {
    if (mqDesktop.matches && mobileNav && mobileNav.classList.contains("open")) {
      setMenu(false);
    }
  }
  if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", syncMenuToViewport);
  else if (mqDesktop.addListener) mqDesktop.addListener(syncMenuToViewport);
  window.addEventListener("resize", function () {
    onScroll();
    syncMenuToViewport();
  }, { passive: true });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- *
   * Görünürlük garantisi CSS'te: JS hiç çalışmasa/başarısız olsa bile
   * .reveal öğeleri kısa bir gecikmeyle kendiliğinden görünür (failsafe).  */
  var revealEls = Array.prototype.filter.call(
    document.querySelectorAll(".reveal"),
    function (el) { return !el.closest(".hero-content"); }
  );
  if ("IntersectionObserver" in window && !reduced()) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });

    var vh = window.innerHeight;
    revealEls.forEach(function (el) {
      // Yalnızca ekranın belirgin şekilde altındaki öğeleri gizle
      if (el.getBoundingClientRect().top > vh * 0.92) {
        el.classList.add("reveal-pending");
      } else {
        el.classList.add("in");
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  var heroReveals = Array.prototype.slice.call(document.querySelectorAll(".hero-content .reveal"));
  if (!reduced()) heroReveals.forEach(function (el) { el.classList.add("reveal-pending"); });
  function revealHero() {
    heroReveals.forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.remove("reveal-pending");
        el.classList.add("in");
      }, reduced() ? 0 : 120 + i * 110);
    });
  }
  if (document.readyState === "complete") revealHero();
  else window.addEventListener("load", revealHero);
  // Emniyet: 2 sn içinde herhangi bir sebeple açılmayan hero öğelerini göster
  window.setTimeout(function () {
    heroReveals.forEach(function (el) { el.classList.remove("reveal-pending"); });
  }, 2000);

  /* ---------- Akordeon (Tedaviler + SSS) — progressive enhancement ----------
   * JS yoksa paneller CSS ile açık kalır ve okunur. JS varsa daraltır.        */
  var openAccordions = [];

  function initAccordion(itemSelector, triggerSelector, panelSelector, idPrefix) {
    var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));
    items.forEach(function (item, i) {
      var trigger = item.querySelector(triggerSelector);
      var panel = item.querySelector(panelSelector);
      if (!trigger || !panel) return;

      var pid = idPrefix + "-panel-" + (i + 1);
      var tid = idPrefix + "-trigger-" + (i + 1);
      panel.id = pid;
      trigger.id = tid;
      trigger.setAttribute("aria-controls", pid);
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", tid);

      // JS aktif: paneli daralt
      panel.classList.add("panel-collapsible");
      panel.style.maxHeight = "0px";
      item.setAttribute("data-open", "false");

      function openPanel() {
        item.setAttribute("data-open", "true");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
        if (openAccordions.indexOf(panel) === -1) openAccordions.push(panel);
      }
      function closePanel() {
        item.setAttribute("data-open", "false");
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = "0px";
        var k = openAccordions.indexOf(panel);
        if (k !== -1) openAccordions.splice(k, 1);
      }

      trigger.addEventListener("click", function () {
        var isOpen = item.getAttribute("data-open") === "true";
        items.forEach(function (other) {
          var op = other.querySelector(panelSelector);
          var ot = other.querySelector(triggerSelector);
          if (other !== item && op && ot) {
            other.setAttribute("data-open", "false");
            ot.setAttribute("aria-expanded", "false");
            op.style.maxHeight = "0px";
            var kk = openAccordions.indexOf(op);
            if (kk !== -1) openAccordions.splice(kk, 1);
          }
        });
        if (isOpen) closePanel(); else openPanel();
      });

      item._bfOpen = openPanel;
    });
    return items;
  }

  initAccordion(".treatment-item", ".treatment-trigger", ".treatment-panel", "tedavi");
  initAccordion(".faq-item", ".faq-trigger", ".faq-panel", "sss");

  // Açık panellerin yüksekliği viewport/font değişince yeniden hesaplansın
  var resizeRaf = null;
  window.addEventListener("resize", function () {
    if (resizeRaf) return;
    resizeRaf = window.requestAnimationFrame(function () {
      resizeRaf = null;
      openAccordions.forEach(function (p) {
        p.style.maxHeight = "none";
        var h = p.scrollHeight;
        p.style.maxHeight = h + "px";
      });
    });
  }, { passive: true });

  /* ---------- Deep-link: #tedavi-N ile ilgili tedaviyi aç ---------- *
   * Hash doğrudan querySelector'a verilmez (geçersiz hash çökertmesin).    */
  (function handleTreatmentHash() {
    var raw = window.location.hash || "";
    if (!/^#[A-Za-z][\w-]*$/.test(raw)) return; // güvenli ID biçimi değilse yok say
    var target = document.getElementById(raw.slice(1));
    if (!target || !target.classList.contains("treatment-item")) return;
    window.setTimeout(function () {
      if (typeof target._bfOpen === "function") target._bfOpen();
      try {
        target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
      } catch (e) {
        target.scrollIntoView();
      }
    }, 200);
  })();

  /* ---------- Doktor fotoğrafı yüklenemezse baş harf fallback'i ---------- *
   * (inline onerror kaldırıldı — CSP uyumu)                                 */
  document.querySelectorAll(".doctor-media img").forEach(function (img) {
    function fail() {
      var m = img.closest(".doctor-media");
      if (m) m.classList.add("img-fallback");
    }
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  /* ---------- Öncesi / Sonrası: sürükle + klavye ---------- */
  var frame = document.getElementById("compareFrame");
  var beforeWrap = document.getElementById("compareBeforeWrap");
  var handle = document.getElementById("compareHandle");

  if (frame && beforeWrap && handle) {
    var dragging = false;
    var current = 50;

    function apply(pct) {
      current = Math.min(Math.max(pct, 0), 100);
      beforeWrap.style.clipPath = "inset(0 " + (100 - current) + "% 0 0)";
      handle.style.left = current + "%";
      frame.setAttribute("aria-valuenow", String(Math.round(current)));
      frame.setAttribute("aria-valuetext", "%" + Math.round(current));
    }
    function setFromClientX(clientX) {
      var rect = frame.getBoundingClientRect();
      apply(((clientX - rect.left) / rect.width) * 100);
    }
    function start() { dragging = true; frame.classList.add("dragging"); }
    function move(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(clientX);
    }
    function end() { dragging = false; frame.classList.remove("dragging"); }

    frame.addEventListener("mousedown", function (e) { start(); setFromClientX(e.clientX); });
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    frame.addEventListener("touchstart", function (e) { start(); setFromClientX(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);

    frame.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 10 : 2;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") { apply(current - step); e.preventDefault(); }
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") { apply(current + step); e.preventDefault(); }
      else if (e.key === "Home") { apply(0); e.preventDefault(); }
      else if (e.key === "End") { apply(100); e.preventDefault(); }
    });

    apply(50);

    if ("IntersectionObserver" in window && !reduced()) {
      var compareIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            apply(62);
            window.setTimeout(function () { apply(50); }, 120);
            compareIO.unobserve(frame);
          }
        });
      }, { threshold: 0.4 });
      compareIO.observe(frame);
    }
  }

  /* ---------- Size en yakın şube (branch finder) ---------- *
   * İki şubenin koordinatları doğrulanana kadar (data-verified="true" + her
   * iki şubede geçerli data-lat/data-lng) konum izni İSTENMEZ. Manuel modda
   * yalnızca "yol tarifi" ve "randevu" linkleri sunulur.
   * Kullanıcının konumu Google'a URL ile gönderilmez; yalnızca tarayıcı
   * belleğinde kuş uçuşu mesafe hesabı için kullanılır ve hiçbir yere
   * kaydedilmez.                                                            */
  (function initBranchFinder() {
    var list = document.getElementById("bfList");
    if (!list) return;

    var branches = Array.prototype.slice.call(list.querySelectorAll(".bf-branch"));
    var locateBtn = document.getElementById("bfLocate");
    var statusEl = document.getElementById("bfStatus");

    function toNum(v) {
      if (v == null || v === "") return null;
      var n = Number(v);
      return isFinite(n) ? n : null;
    }
    function branchCoords(b) {
      var lat = toNum(b.getAttribute("data-lat"));
      var lng = toNum(b.getAttribute("data-lng"));
      if (lat === null || lng === null) return null;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
      return { lat: lat, lng: lng };
    }
    function mapsSearchUrl(addr, placeId) {
      var u = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addr);
      if (placeId) u += "&query_place_id=" + encodeURIComponent(placeId);
      return u;
    }
    function mapsDirUrl(addr, placeId) {
      // Başlangıç konumu GÖNDERİLMEZ — Google kendi tarafında çözer.
      var u = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(addr) + "&travelmode=driving";
      if (placeId) u += "&destination_place_id=" + encodeURIComponent(placeId);
      return u;
    }
    function waUrl(number, text) {
      return "https://wa.me/" + encodeURIComponent(number) + "?text=" + encodeURIComponent(text);
    }
    function fmtDist(km) {
      // Kuş uçuşu yaklaşık mesafe — Türkçe biçim. 1 km altı: metre.
      if (km < 1) {
        var m = Math.max(50, Math.round(km * 1000 / 50) * 50);
        return "Yaklaşık " + m.toLocaleString("tr-TR") + " m";
      }
      return "Yaklaşık " + km.toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + " km";
    }
    function haversineKm(lat1, lon1, lat2, lon2) {
      var R = 6371, toRad = Math.PI / 180;
      var dLat = (lat2 - lat1) * toRad, dLon = (lon2 - lon1) * toRad;
      var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
    }
    function setStatus(msg, tone) {
      if (!statusEl) return;
      statusEl.textContent = msg || "";
      if (tone) statusEl.setAttribute("data-tone", tone);
      else statusEl.removeAttribute("data-tone");
    }

    // Tüm şubelerin link hedeflerini kur (konum gerekmez)
    branches.forEach(function (b) {
      var addr = b.getAttribute("data-address") || "";
      var placeId = b.getAttribute("data-place-id") || "";
      var waNum = b.getAttribute("data-wa") || "";
      var waText = b.getAttribute("data-wa-text") || "";
      var mapsLink = b.querySelector(".bf-maps");
      var waLink = b.querySelector(".bf-wa");
      if (mapsLink) {
        // "Yol Tarifi Al" gerçekten directions açar
        mapsLink.href = /tarifi/i.test(mapsLink.textContent || "")
          ? mapsDirUrl(addr, placeId)
          : mapsSearchUrl(addr, placeId);
        mapsLink.setAttribute("rel", "noopener noreferrer");
        mapsLink.setAttribute("target", "_blank");
      }
      if (waLink && waNum) {
        waLink.href = waUrl(waNum, waText);
        waLink.setAttribute("rel", "noopener noreferrer");
        waLink.setAttribute("target", "_blank");
      }
    });

    var verifiedFlag = list.getAttribute("data-verified") === "true";
    var allHaveCoords = branches.length > 1 && branches.every(function (b) { return branchCoords(b) !== null; });
    var canLocate = verifiedFlag && allHaveCoords && ("geolocation" in navigator);

    if (!canLocate) {
      // Manuel fallback — konum izni istenmez
      if (locateBtn) locateBtn.hidden = true;
      setStatus("Şubelerimizi aşağıda görüntüleyin ve size uygun olan için yol tarifi alın.");
      return;
    }

    // Aktif mod: buton görünür. Konum izni SADECE butona tıklanınca istenir.
    setStatus("Konumunuza göre sıralamak için yukarıdaki butona basabilirsiniz.");

    function onLocated(pos) {
      var uLat = pos.coords.latitude, uLng = pos.coords.longitude;
      var rows = branches.map(function (b) {
        var c = branchCoords(b);
        return { el: b, km: haversineKm(uLat, uLng, c.lat, c.lng) };
      });
      rows.sort(function (a, b) { return a.km - b.km; });
      rows.forEach(function (row, i) {
        list.appendChild(row.el);
        var distEl = row.el.querySelector(".bf-dist");
        if (distEl) {
          distEl.textContent = fmtDist(row.km);
          distEl.hidden = false;
        }
        var label = row.el.querySelector(".bf-nearest");
        row.el.classList.toggle("is-nearest", i === 0);
        if (label) label.hidden = i !== 0;
      });
      setStatus("Konumunuza göre en yakın şubeniz belirlendi.");
    }

    function onError(err) {
      var msg = "Konumunuza erişemedik. Aşağıdan size uygun şubeyi seçebilirsiniz.";
      if (err && err.code === 1) msg = "Konum izni verilmedi. Aşağıdan size uygun şubeyi seçebilirsiniz.";
      else if (err && err.code === 3) msg = "Konum belirlenemedi (zaman aşımı). Aşağıdan size uygun şubeyi seçebilirsiniz.";
      setStatus(msg, "error");
    }

    if (locateBtn) {
      locateBtn.hidden = false;
      locateBtn.addEventListener("click", function () {
        setStatus("Konumunuz alınıyor…");
        navigator.geolocation.getCurrentPosition(onLocated, onError, {
          enableHighAccuracy: false, timeout: 10000, maximumAge: 0
        });
      });
    }
  })();

})();
