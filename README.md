# Alex Carter Studio

Statikus, kétnyelvű (EN / HU) portfólió-weboldal. Nincs build-lépés, nincs függőség —
a fájlok úgy kerülnek ki a szerverre, ahogy vannak.

---

## 1. Publikálás — GitHub → Vercel

### GitHub

> **Fontos: parancssorból tölts fel, ne a GitHub webes „Add file → Upload files"
> felületén.** A webes feltöltő a mappákat gyakran „lapítja": az `assets/` mappa
> tartalma a repó gyökerébe kerül, és az oldal összes fotója eltűnik. Pontosan ez
> történt az első telepítésnél. A `git` parancsok megőrzik a szerkezetet.

```bash
cd alex-carter-studio
git init
git add .
git commit -m "Alex Carter Studio"
git branch -M main
git remote add origin https://github.com/FELHASZNALONEV/alex-carter-studio.git
git push -u origin main
```

Feltöltés után ellenőrizd a GitHubon, hogy létezik-e az **`assets/` mappa 15 fájllal**.
Ha a képek a gyökérben sorakoznak, a szerkezet lapítva lett — töröld a repót és
töltsd fel újra a fenti parancsokkal.

Ellenőrzés élesben (mindnek `200`-at kell adnia):

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://A-TE-DOMAINED/assets/alex-figure.avif
```

### Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → válaszd ki a repót
2. **Framework Preset:** `Other`
3. **Build Command:** hagyd üresen · **Output Directory:** hagyd üresen · **Install Command:** hagyd üresen
4. **Deploy**

Ennyi. A `vercel.json` mindent beállít (gyorsítótárazás, biztonsági fejlécek).
Minden `git push` után automatikusan újratelepül.

---

## 2. Élesítés előtt — kötelező lépések

### a) Domain

A canonical és a megosztási képek URL-je már a jelenlegi Vercel-domainre mutat
(`https://alex-carter-portfolio.vercel.app`). **Ha saját domainre váltasz**, cseréld le
3 fájlban — a közösségi megosztáshoz abszolút URL kell:

```bash
grep -rl "alex-carter-portfolio.vercel.app" . --include="*.html" --include="*.xml" --include="*.txt" \
  | xargs sed -i '' 's|https://alex-carter-portfolio\.vercel\.app|https://A-TE-DOMAINED.hu|g'
```

Érintett fájlok: `index.html` (canonical, og:url, og:image, twitter:image),
`sitemap.xml`, `robots.txt`.

A `vercel.json` tartalmaz egy biztonsági átirányítást is: ha az `assets/` mappa
valaha újra lapítva kerülne fel, a `/assets/<fájl>` kérések automatikusan a gyökérből
szolgálódnak ki, így az oldal nem törik el.

### b) Elérhetőségek

| Hol | Jelenleg | Teendő |
|---|---|---|
| `index.html` — kapcsolat + mobilmenü | `hello@alexcarter.studio` | valós e-mail |
| `script.js` — `contact.mailto` kulcs | ugyanaz, magyar levélsablonban | ugyanaz |
| `index.html` — Instagram | `@alexcarter.studio` (sima szöveg) | ha van fiók, tedd linkké |

Az Instagram szándékosan **nem link**: nem akartam egy `#`-re mutató holt linket, sem
kitalált URL-t, ami esetleg valaki más fiókjára visz.

---

## 3. Fájlszerkezet

```
index.html          az oldal (angol szöveg a jelölésben)
style.css           teljes stílusrendszer, tokenekkel
script.js           navigáció · nyelvváltás · animációk
404.html            saját hibaoldal
assets/             fotók — AVIF + JPEG/PNG tartalék
favicon.svg .ico    „AC" monogram
apple-touch-icon.png · icon-192.png · icon-512.png
og.jpg              1200×630 megosztási kép
site.webmanifest · robots.txt · sitemap.xml · vercel.json
```

Helyi előnézet:

```bash
python3 -m http.server 4321
```

---

## 4. Szöveg szerkesztése

**Angol:** közvetlenül az `index.html`-ben.

**Magyar:** a `script.js` tetején lévő `HU` szótárban. Minden elem, ami fordítható,
egy attribútummal van megjelölve:

| Attribútum | Mit cserél |
|---|---|
| `data-i18n` | szöveg |
| `data-i18n-html` | jelölést is tartalmazó szöveg (`<br>`, `<em>`) |
| `data-i18n-alt` | kép alt szövege |
| `data-i18n-aria` | `aria-label` |
| `data-i18n-href` | link (a magyar levélsablon) |

Ha új szöveget veszel fel: adj neki `data-i18n="valami.kulcs"` attribútumot, és tedd be
ugyanazt a kulcsot a `HU` szótárba. Ha a kulcs hiányzik, az elem egyszerűen angolul marad
— nem törik el semmi.

Az angol szöveget a szkript betöltéskor lementi, ezért a visszaváltás veszteségmentes;
nincs második szótár, amit szinkronban kellene tartani.

---

## 5. Amit tudni érdemes

**Képek.** Minden fotó AVIF-ben megy ki (kb. negyede a JPEG-nek), JPEG/PNG tartalékkal a
régebbi böngészőknek. **Ha új képet készítesz: a szélesség és a magasság is legyen páros
szám.** Az Apple AVIF-kódolója páratlan méretnél olyan fájlt ad, amit a Chrome *üresen*
dekódol — és mivel a fájl formailag érvényes, a `<picture>` tartalék nem lép be. Az oldal
egyszerűen üres helyet mutat. Ez a hiba egyszer már előfordult a fejlesztés során.

**Portfólió-képek hiányoznak.** A három esettanulmány (*The Hoxton Morning*,
*After Hours / Soho*, *Form & Motion*) nem kész fotóanyag, hanem **koncepció-tervek**:
fénykulcs, képsorrend és felvételi jegyzetek, CSS-ben megrajzolt fénytáblákkal. Ezt a
munka-szekció fejléce nyíltan ki is mondja. Amint van valódi fotóanyag, a képek
egy az egyben behelyezhetők a `.plate__field` helyekre.

**Animációk.** A GSAP CDN-ről töltődik. Ha nem érhető el, vagy a látogató csökkentett
mozgást kért, az oldal teljes tartalommal, animációk nélkül jelenik meg — ez tesztelve van.

**SEO és a két nyelv.** A nyelvváltás JavaScripttel történik, egyetlen URL-en. A keresők
így az angol változatot indexelik. Ha a magyar tartalmat is indexeltetni szeretnéd, ahhoz
külön URL kell (pl. `/hu/`) — az már nagyobb átalakítás.

**Eredeti képfájlok.** A gyökérben lévő nagy `.png` fájlok (`ujfigura.png`, `portre.png`
stb.) a nyers forrásképek. A telepített csomagban nincsenek benne, mert az oldal nem
hivatkozik rájuk — de érdemes megőrizni őket, ha később újra kell vágni a képeket.
