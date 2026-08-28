/* =========================================================================
   ALEX CARTER STUDIO — behaviour
   1. navigation (sticky state, mobile menu, current section)
   2. hero entrance — the signature spin
   3. project 02 — pinned light sequence
   4. project 03 — kinetic type drift
   5. restrained section reveals
   Everything degrades to a fully readable static page.
   ========================================================================= */
(function () {
  'use strict';

  var root   = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqSmall = window.matchMedia('(max-width: 767px)');

  /* Never leave the hero hidden: whatever happens below, reveal it. */
  function revealHero() { root.removeAttribute('data-intro'); }
  var heroSafety = window.setTimeout(revealHero, 2600);

  /* ---------------------------------------------------------------- 1. NAV */
  (function nav() {
    var bar     = document.getElementById('nav');
    var toggle  = document.getElementById('navToggle');
    var menu    = document.getElementById('mobileMenu');
    var links   = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
    var lastFocus = null;

    /* sticky background once we leave the hero's first screen */
    var onScroll = function () {
      if (bar) bar.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* mobile menu */
    function setMenu(open) {
      if (!menu || !toggle) return;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        lastFocus = document.activeElement;
        var first = menu.querySelector('a');
        if (first) first.focus();
      } else if (lastFocus) {
        lastFocus.focus();
        lastFocus = null;
      }
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
      });
    }
    if (menu) {
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) setMenu(false);
      });
      /* keep tab focus inside the open menu */
      menu.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = menu.querySelectorAll('a, button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false);
    });
    mqSmall.addEventListener('change', function (e) { if (!e.matches) setMenu(false); });

    /* current section in the nav */
    if ('IntersectionObserver' in window && links.length) {
      var targets = links
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      targets.forEach(function (t) { io.observe(t); });
    }
  })();


  /* ------------------------------------------------------ 1b. LANGUAGE
     English lives in the markup (so no-JS visitors get a complete page);
     Hungarian lives here. The English copy is snapshotted on boot, which
     makes switching back lossless instead of needing a second dictionary. */
  (function language() {
    var STORE = 'ac-lang';
    var root  = document.documentElement;
    var btns  = document.querySelectorAll('[data-lang]');
    if (!btns.length) return;

    var HU = {
      'skip': 'Ugrás a válogatott munkákhoz',
      'nav.work': 'Munkák', 'nav.about': 'Rólam', 'nav.services': 'Szolgáltatások',
      'nav.contact': 'Kapcsolat', 'nav.currently': 'Jelenleg', 'nav.menu': 'Menü',
      'nav.primary': 'Fő navigáció', 'nav.mobile': 'Mobil navigáció',
      'cta.start': 'Projekt indítása', 'cta.work': 'Válogatott munkák',

      'hero.role': 'Fotográfus <span class="amp">&amp;</span> vizuális&nbsp;rendező',
      'hero.statement': 'Olyan képeket készítek, amelyektől egy márka olyan hellyé válik, ahová az emberek vágynak.',
      'hero.scroll': 'Görgess',
      'rail.based': 'Bázis', 'rail.since': 'Fotózik', 'rail.since.v': '2021 óta',
      'rail.fields': 'Területek', 'rail.fields.v': 'Vendéglátás · Lifestyle · Divat',

      'work.eyebrow': 'Válogatott munkák',
      'work.title': 'Három koncepció.',
      'work.lede1': 'Ebből a munkából nem sok történik kamerával a kézben. Sokkal korábban dől el: milyen érzést kell keltenie egy helynek — és onnan visszafelé haladva jönnek a képek, amelyek ezt bizonyítják.',
      'work.lede2': 'Alább három saját kezdeményezésű koncepció: a fénykulcs, a sorrend, és az az egyetlen döntés, ami összetartja a sorozatot.',
      'work.note': 'Koncepciófejlesztés — hangulattáblák és felvételi jegyzetek, nem kész fotóanyag.',

      'spec.role': 'Szerep', 'spec.light': 'Fénykulcs',
      'lbl.problem': 'A probléma', 'lbl.decision': 'A döntés',

      'p01.cat': 'Butikhotel / Lifestyle',
      'p01.role': 'Fotó és vizuális rendezés',
      'p01.light': 'Északi ablak, 07:10 – 09:30',
      'p01.frames.k': 'Képkockák', 'p01.frames.v': 'Hat, sorrendben',
      'p01.concept': 'Csendes reggel egy mai londoni butikhotelben.',
      'p01.problem': 'A hotelfotó szobát ad el. Reggelt szinte soha. Minden bevetve, összehajtva és megvilágítva, egy órával azelőtt, hogy bárki tényleg felébredne.',
      'p01.decision': 'A cselekvések <em>közötti</em> pillanatokat fotózni. A szünetet, mielőtt felemelik a csészét; a lepedőt, amely még őrzi a formát. Senki nem játssza el a vendéglátást.',
      'p01.cap1': 'Ablakfény egy vetetlen ágyon. Még senki a képben.',
      'p01.cap2': 'Gőz a kávé fölött, ellenfényben. Csak kezek.',
      'p01.cap3': 'Vászon, egyszer hajtva, meleg árnyék előtt.',
      'p01.cap4': 'Vendég vág át a lobbin, félig árnyékban.',
      'p01.cap5': 'Rézcsap, víz, egy másodperc, amiben nem történik semmi.',
      'p01.cap6': 'A szoba az ajtóból. Az ajtókeret benne marad.',
      'sheet.hint': 'Kontaktmásolat — görgess oldalra',

      'p02.cat': 'Étterem / éjszakai editorial',
      'p02.role': 'Fotó és kreatív rendezés',
      'p02.light': 'Meleg gyakorlati fény → utcai nátrium',
      'p02.runs.k': 'Idősáv',
      'p02.concept': 'Egy sohói étterem útja a vacsorától a késő estébe.',
      'p02.problem': 'Az éttermi fotó ételeket dokumentál. Azt szinte soha nem mutatja meg, hogyan szól a terem tizenegykor — pedig valójában mindenki ezt foglalja le.',
      'p02.decision': 'Ne az alanyokat fotózzuk, hanem a tükröződéseket. Üveg, króm, nedves járda — a terem a legtöbb képen kétszer jelenik meg, és sosem egészen ugyanúgy.',
      'p02.cap1': 'Az utolsó nappali fény az első gyertya mellett.',
      'p02.cap2': 'A kiadópult munka közben, az ablakban tükröződve.',
      'p02.cap3': 'Króm, páralecsapódás, egy nyúló kéz.',
      'p02.cap4': 'A terem, megkettőzve az üvegben.',
      'p02.cap5': 'Kint az utca. Nátriumfény és eső.',

      'p03.kinetic': 'Fordulat közben.',
      'p03.cat': 'Divat / Editorial',
      'p03.role': 'Fotó és art direction',
      'p03.light': 'Kemény déli fény, betonvisszaverődés',
      'p03.setup.k': 'Felállás', 'p03.setup.v': 'Egy fal, egy fényforrás',
      'p03.concept': 'Minimalista, független divatkampány mozgásra és sziluettre építve.',
      'p03.problem': 'A mozgás rendszerint a ruhát viszi el. Az anyag ellágyul, vele a forma is, és a végén marad egy hangulat, amit senki nem tud megvenni.',
      'p03.decision': 'A test maradjon éles, csak az anyag mosódjon el. Egy fal, egy fényforrás, semmi stylist-trükk — így a képek között a mozgás a különbség, semmi más.',
      'p03.cap1': 'Kabát fordulat közben. A test éles, az alja elmosódik.',
      'p03.cap2': 'Sziluett a betonon. A negatív tér dolgozik.',
      'p03.cap3': 'Szél, negyed másodpercre megállítva.',

      'street.eyebrow': 'Természetes emberi pillanatok',
      'street.title': 'Amit keresek, többnyire<br> abban a fél másodpercben történik,<br> mielőtt valaki elrendezné<br> magát.',
      'street.body': 'Ezért fotózom sokat, maradok csendben, és tartom fent a gépet a várt képek között is. Ami végül a falra kerül, azt általában senki nem vette észre, hogy elkészült.',
      'street.cred': 'Clerkenwell, eső után · 35mm',

      'about.eyebrow': 'Rólam',
      'about.title': 'Egy szép fotót könnyű megcsodálni, és könnyű elfelejteni.',
      'about.p1': '2021-ben kezdtem fotózni Londonban — előbb utcán, aztán portrékkal, főleg azért, mert így volt okom a nap megfelelő szakában kint lenni a városban.',
      'about.p2': 'A kereskedelmi munka a vendéglátáson keresztül érkezett, és valahol ott csendben megváltozott a feladat. Egyetlen jó képet könnyű elkészíteni és könnyű elveszíteni. Egy hely érzetén az változtat, ha a képek egyetértenek egymással.',
      'about.p3': 'Így a munka korábban kezdődik: eldönteni, mi érdemel figyelmet. Honnan jön a fény, hogyan mozognak az emberek a térben, melyik három részletre emlékszik valaki egy hét múlva — aztán gondoskodni róla, hogy negyven kép ugyanazt mondja.',
      'about.p4': 'Ahol lehet, természetes fényt használok. Inkább várok húsz percet, hogy jó legyen a szoba, mint hogy utólag javítsam.',
      'about.cred': 'Tetőterasz, City of London · utolsó fény',

      'services.eyebrow': 'Szolgáltatások',
      'services.title': 'Amiért felkérnek',
      'svc1.name': 'Márka-<br>fotográfia',
      'svc1.desc': 'Nem egy fotózás, hanem egy készlet. Elég kép, egyetlen vizuális nyelven, hogy kiszolgáljon egy weboldal-újratervezést, egy szezonnyi kampányt és egy évnyi közösségi médiát anélkül, hogy a sorozat szétesne.',
      'svc2.name': 'Vendéglátás- és<br>lifestyle-kampányok',
      'svc2.desc': 'Szobák, ételek, emberek és utca egyetlen helyként kezelve. Egy teljes napon át fotózva, hogy a fény vigye a történetet, ne mondjon ellent neki minden harmadik képnél.',
      'svc3.name': 'Kreatív<br>rendezés',
      'svc3.desc': 'Koncepció, referenciák, helyszín, fénykulcs, képlista, sorrend. Néha én fotózom le. Néha az a hasznos, ha eldöntöm, mi kerül képre és milyen sorrendben.',

      'focus.title': 'Amit most keresek',
      'focus.i1': 'Butikhotelek és független vendéglátás',
      'focus.i2': 'Éttermek és bárok, amelyeknek van saját nézőpontjuk',
      'focus.i3': 'Divat- és lifestyle-márkák, kis szériákban',
      'focus.i4': 'Utazási megbízások Európa-szerte',
      'focus.i5': 'Ügynökségek, akiknek koncepciót tartó ember kell, nem csak képlista-végrehajtó',
      'focus.counter.k': 'Kevésbé hasznos:',
      'focus.counter.v': 'alkalmi portréfotók, rendezvény-dokumentálás, és bármi, aminek péntekre kész kell lennie.',

      'contact.title': 'Mondd el,<br> milyen <em>érzést</em><br> keresel.',
      'contact.lede': 'A hasznos első üzenet rövid: mi a hely, mikor nyit vagy indul, és milyen érzést céloztok. A többit kitaláljuk.',
      'contact.maillabel': 'Írj a stúdiónak',
      'contact.mailto': 'mailto:hello@alexcarter.studio?subject=Projekt%20megkeres%C3%A9s&body=Mi%20a%20hely%3A%0AMikor%3A%0AMilyen%20%C3%A9rz%C3%A9st%20keresel%3A%0A',
      'contact.travel.k': 'Utazás', 'contact.travel.v': 'Egyesült Királyság és Európa',

      'foot.note': 'Fotográfus és vizuális rendező · London',
      'foot.top': 'Vissza a tetejére',

      'alt.figure': 'Alex Carter teljes alakban, kamerával a kézben, hátulról érkező meleg, alacsony napfényben.',
      'alt.street': 'Alex Carter egy golden retrieverrel sétál egy esőtől nedves londoni utcán, mögötte fekete taxi és viktoriánus lámpaoszlop.',
      'alt.portrait': 'Alex Carter portréja egy stúdióablak mellett, összefont karral.',
      'alt.rooftop': 'Alex Carter egy tetőn a londoni City fölött alkonyatkor, kamerával a kezében.',
      'alt.studio': 'Alex Carter egy stúdióasztalnak dőlve, nagy ipari ablak mellett.',

      '__title': 'Alex Carter — Fotográfus és vizuális rendező, London',
      '__desc': 'Alex Carter fotográfus és vizuális rendező Londonban: butikhotelek, vendéglátás, lifestyle és divat. Koncepció, fénykulcs, sorrend — képek, amelyektől egy hely olyanná válik, ahol az emberek lenni akarnak.'
    };

    var FIELDS = [
      ['data-i18n',      'textContent'],
      ['data-i18n-html', 'innerHTML'],
      ['data-i18n-alt',  'alt'],
      ['data-i18n-aria', 'aria-label'],
      ['data-i18n-href', 'href']
    ];

    var meta = document.querySelector('meta[name="description"]');
    var EN = {};

    /* keep the original English so switching back needs no second dictionary */
    FIELDS.forEach(function (f) {
      document.querySelectorAll('[' + f[0] + ']').forEach(function (el) {
        var key = el.getAttribute(f[0]);
        EN[f[0] + '|' + key] = (f[1] === 'aria-label' || f[1] === 'href')
          ? el.getAttribute(f[1])
          : el[f[1]];
      });
    });
    EN.__title = document.title;
    EN.__desc  = meta ? meta.getAttribute('content') : '';

    var current = 'en';

    function apply(lang) {
      var hu = lang === 'hu';
      FIELDS.forEach(function (f) {
        document.querySelectorAll('[' + f[0] + ']').forEach(function (el) {
          var key = el.getAttribute(f[0]);
          var val = hu ? HU[key] : EN[f[0] + '|' + key];
          if (val == null) return;
          if (f[1] === 'aria-label' || f[1] === 'href') el.setAttribute(f[1], val);
          else el[f[1]] = val;
        });
      });

      document.title = (hu ? HU.__title : EN.__title) || document.title;
      if (meta) meta.setAttribute('content', (hu ? HU.__desc : EN.__desc) || '');
      root.setAttribute('lang', hu ? 'hu' : 'en');

      btns.forEach(function (b) {
        var on = b.getAttribute('data-lang') === lang;
        b.setAttribute('aria-pressed', String(on));
        b.classList.toggle('is-active', on);
      });

      current = lang;
      try { localStorage.setItem(STORE, lang); } catch (e) {}

      /* Hungarian copy is longer — every scroll trigger's start/end moved. */
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }

    /* ő and ű live in the latin-ext subset, which the browser only fetches
       once the page actually contains them. Warm it before the first switch
       so those two letters don't flash in a fallback face. */
    var warmed = false;
    function warmFonts() {
      if (warmed || !document.fonts || !document.fonts.load) return;
      warmed = true;
      ['80px "Instrument Serif"', 'italic 80px "Instrument Serif"', '500 16px "Archivo"']
        .forEach(function (f) { document.fonts.load(f, 'őűŐŰ'); });
    }

    btns.forEach(function (b) {
      b.addEventListener('pointerenter', warmFonts);
      b.addEventListener('focus', warmFonts);
      b.addEventListener('click', function () {
        var lang = b.getAttribute('data-lang');
        if (lang === current) return;
        warmFonts();
        apply(lang);
      });
    });

    var saved;
    try { saved = localStorage.getItem(STORE); } catch (e) {}
    if (!saved && (navigator.language || '').toLowerCase().indexOf('hu') === 0) saved = 'hu';
    if (saved === 'hu') { warmFonts(); apply('hu'); }
  })();

  /* ------------------------------------------------- animation entry point */
  function boot() {
    var gsap = window.gsap;

    /* No GSAP, or the visitor asked for less motion: show the finished page. */
    if (!gsap || reduce.matches) { revealHero(); return; }

    window.clearTimeout(heroSafety);
    var ST = window.ScrollTrigger;
    if (ST) gsap.registerPlugin(ST);

    /* -------------------------------------------- 2. HERO — signature spin */
    (function heroIntro() {
      var fig   = document.getElementById('heroFigure');
      var words = document.querySelectorAll('[data-intro-word]');
      var items = document.querySelectorAll('[data-intro-item]');
      var rail  = document.querySelector('.hero__rail');
      if (!fig) { revealHero(); return; }

      var small = mqSmall.matches;
      var spin  = small ? -180 : -300;   /* lighter travel on phones */
      var from  = {
        rotation: spin,
        scale:    small ? 0.78 : 0.65,
        y:        small ? 44 : 80,
        x:        small ? 0 : 42,
        opacity:  0
      };

      /* Establish the start frame as inline style, then hand control to GSAP
         so the CSS pre-state can be dropped without a flash. */
      gsap.set(fig, from);
      gsap.set(fig, { filter: 'blur(' + (small ? 6 : 12) + 'px)' });
      gsap.set(words, { opacity: 0, clipPath: 'inset(0 0 108% 0)' });
      gsap.set(items, { opacity: 0, y: 18 });
      gsap.set(rail,  { opacity: 0 });
      revealHero();

      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* the figure: fast in, long settle */
      tl.to(fig, {
        rotation: 0, scale: 1, y: 0, x: 0, opacity: 1,
        duration: small ? 0.95 : 1.15,
        ease: 'expo.out'
      }, 0.10);

      /* movement reads as movement — blur clears as it decelerates */
      tl.to(fig, {
        filter: 'blur(0px)',
        duration: small ? 0.6 : 0.75,
        ease: 'power2.out'
      }, 0.14);

      /* type resolves into the same composition as the figure lands */
      tl.to(words, {
        opacity: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.9,
        stagger: 0.11,
        ease: 'power4.out'
      }, 0.75);

      tl.to(items, {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.14
      }, 1.05);

      tl.to(rail, { opacity: 1, duration: 0.6 }, 1.35);

      /* drop the transform hints once the entrance is over */
      tl.add(function () {
        gsap.set(fig, { clearProps: 'filter,willChange' });
      });

      /* Safety net: if the ticker is stalled while the page is genuinely on
         screen, snap to the finished composition rather than leave it blank.
         A backgrounded tab is left alone — it plays properly once focused. */
      function armGuard() {
        if (document.hidden) return;
        window.setTimeout(function () {
          if (!document.hidden && tl.progress() === 0) tl.progress(1);
        }, 4000);
      }
      armGuard();
      document.addEventListener('visibilitychange', function onVis() {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onVis);
        armGuard();
      });
    })();

    if (!ST) return;

    /* ------------------------------ 2b. HERO FIGURE — spins on scroll
       The entrance timeline owns .hero__figure's transform, so the
       scroll-linked turn is applied to the .hero__stage wrapper instead.
       Two elements, two transforms — they compose instead of fighting.
       One full revolution across the hero's exit, so the figure lands
       upright again rather than stopping at an arbitrary angle. */
    (function figureScrollSpin() {
      var stage = document.querySelector('.hero__stage');
      var hero  = document.querySelector('.hero');
      if (!stage || !hero) return;

      var small = mqSmall.matches;

      /* power2.in, not linear: almost no rotation while the headline is
         still being read, then the turn resolves as the figure leaves the
         frame. A linear 360 parks the figure upside-down mid-hero, which
         reads as a tumble rather than a deliberate exit. */
      gsap.fromTo(stage,
        { rotation: 0, scale: 1 },
        {
          rotation: small ? 180 : 360,
          scale: small ? 0.92 : 0.86,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });
    })();

    /* --------------------------------- 3. PROJECT 02 — pinned light sequence */
    (function sequence() {
      var seq = document.getElementById('seq');
      if (!seq) return;

      var frames = seq.querySelectorAll('.seq__frame');
      var caps   = seq.querySelectorAll('.seq__caps li');
      var clock  = document.getElementById('seqClock');
      var bar    = document.getElementById('seqBar');
      var times  = ['21:10', '22:05', '22:40', '23:30', '00:50'];
      if (frames.length < 2) return;

      seq.classList.add('seq--live');

      var current = -1;
      function show(i) {
        if (i === current) return;
        current = i;
        for (var f = 0; f < frames.length; f++) frames[f].classList.toggle('is-active', f === i);
        for (var c = 0; c < caps.length; c++) caps[c].classList.toggle('is-active', c === i);
        if (clock) clock.textContent = times[i] || times[0];
        if (bar) bar.style.width = ((i + 1) / frames.length * 100) + '%';
      }
      show(0);

      ST.create({
        trigger: seq,
        start: 'top top',
        end: '+=' + (frames.length * 62) + '%',
        pin: '.seq__viewport',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var i = Math.floor(self.progress * frames.length);
          show(Math.max(0, Math.min(frames.length - 1, i)));
        }
      });
    })();

    /* ------------------------------------- 4. PROJECT 03 — kinetic type drift */
    (function kinetic() {
      var main = document.querySelector('.kinetic__main');
      var echo = document.querySelector('.kinetic__echo');
      var sect = document.querySelector('.project--03');
      if (!main || !sect) return;

      var link = { trigger: sect, start: 'top bottom', end: 'bottom top', scrub: 0.7 };
      /* small range — the word must never lose its first letter off the edge */
      gsap.fromTo(main, { xPercent: 3 }, { xPercent: -3, ease: 'none', scrollTrigger: link });
      if (echo) gsap.fromTo(echo, { xPercent: 6 }, { xPercent: -7, ease: 'none', scrollTrigger: link });
    })();

    /* ------------------------------------------- 5. RESTRAINED TITLE REVEALS */
    (function reveals() {
      var titles = document.querySelectorAll(
        '.work__title, .street__title, .about__title, .services__title, .focus__title, .contact__title'
      );
      titles.forEach(function (el) {
        gsap.fromTo(el,
          { clipPath: 'inset(0 0 102% 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0 0% 0)', opacity: 1,
            duration: 1.0, ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
      });
    })();

    /* layout settles after webfonts land */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ST.refresh(); });
    }
    window.addEventListener('load', function () { ST.refresh(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
