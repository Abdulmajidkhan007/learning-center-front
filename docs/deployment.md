# Deploy

Frontend statik (`dist/` — HTML + JS + CSS), backend alohida Spring Boot
ilovasi. Tanlangan yo'l: **ikkalasi ham Railway'da**, keyinroq daromadga
chiqqach VPS'ga ko'chirish.

## Avval: nega frontend `/api` ni o'zi uzatadi

Auth shunday ishlaydi: access token React state'da, uzoq muddatli kirish esa
**httpOnly refresh cookie** orqali (`credentials: 'include'`). Cookie'lar
domenga bog'liq, va aynan shu joyda ko'p loyiha qoqiladi:

- Frontend `frontend-xyz.up.railway.app`, backend `backend-abc.up.railway.app`
  bo'lsa — brauzer buni **cross-site** deb hisoblaydi. Cookie
  `SameSite=None; Secure` bo'lishi shart, va Safari (ITP) hamda Brave uni
  baribir bloklaydi. Foydalanuvchi har safar qaytadan login qiladi, sababi
  esa konsolda ko'rinmaydi.
- Frontend `/api` ni o'zi uzatsa — brauzer uchun hammasi **bitta origin**.
  Cookie oddiy `SameSite=Lax` bo'lib qolaveradi, CORS esa umuman kerak emas.

Shuning uchun bu repoda `Dockerfile` + `Caddyfile` bor: frontend xizmati
statik fayllarni beradi va `/api/*` ni backendga uzatadi. Yon foydasi —
backendga umuman ochiq domen kerak emas, u faqat ichki tarmoqda qoladi.

```
brauzer ──HTTPS──> [ Caddy: dist/ + /api proxy ] ──ichki tarmoq──> [ Spring ] ──> [ Postgres ]
                          (ochiq domen)                            (yopiq)         (yopiq)
```

## Railway

Bitta loyiha (project) ichida uchta xizmat:

| Xizmat | Manba | Ochiq domen |
| --- | --- | --- |
| `frontend` | shu repo (Dockerfile o'zi topiladi) | **Ha** |
| `backend` | Java repo | Yo'q — kerak emas |
| `postgres` | Railway plagini | Yo'q |

### 1. Frontend xizmati

Repoga ulang — Railway ildizdagi `Dockerfile` ni o'zi ko'radi. Keyin
**Variables** bo'limiga bittagina o'zgaruvchi qo'shiladi:

```
BACKEND_URL = http://backend.railway.internal:8080
```

`backend` — backend xizmatining nomi (Railway'dagi qanday nomlagan
bo'lsangiz, shu). `PORT` ni Railway o'zi beradi, `Caddyfile` uni o'qiydi.

Keyin **Settings → Networking → Generate Domain**.

### 2. Backend xizmati

Ichki tarmoq (`*.railway.internal`) **IPv6 orqali** ishlaydi. Spring Boot
sukut bo'yicha faqat IPv4 tinglaydi, ya'ni proxy unga yeta olmaydi.
`application.properties` ga:

```properties
server.address=::
server.port=8080

# Railway HTTPS'ni o'zi tugatadi. Bu sozlamasiz Spring so'rovni "http" deb
# biladi va `Secure` cookie'ni qo'ymaydi yoki noto'g'ri redirect yasaydi.
server.forward-headers-strategy=framework
```

Cookie sozlamalari (proxy ishlatilgani uchun `Lax` yetarli):

```properties
server.servlet.session.cookie.same-site=lax
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true
```

Backendga ochiq domen **berilmasin** — u faqat frontend orqali kirilishi
kerak. CORS sozlash ham shart emas.

### 3. Postgres

Railway plaginini qo'shing va `DATABASE_URL` ni backend xizmatiga ulang.
Zaxira nusxa: `pg_dump` ni rejaga qo'ying — Railway'ning avtomatik backup'iga
tayanib qolmang.

### Tekshirish

Deploy'dan keyin:

1. Frontend domenini oching — login sahifasi chiqishi kerak.
2. `/attendance` ni to'g'ridan-to'g'ri oching — 404 bo'lmasin (SPA fallback).
3. Login qiling, keyin sahifani **yangilang** — qayta login so'ralmasin.
   So'ralsa, muammo cookie'da: backend `Set-Cookie` ni qanday
   qo'yayotganini tekshiring.
4. DevTools → Network → `refresh-token` so'rovi `200` qaytarsin.

### Narx haqida

Uchta xizmat ishlaydi, lekin Caddy juda kichik (~10-20 MB xotira) —
asosiy sarf JVM va Postgres'da. Java'ning bepul tariflarda og'irligi
haqida quyida.

## VPS'ga ko'chish (keyinroq)

Xuddi shu `Caddyfile` VPS'da ham ishlaydi — `docker-compose.yml` yozasiz,
xolos:

```yaml
services:
  caddy:
    build: .                    # shu repo
    environment:
      BACKEND_URL: http://spring:8080
      PORT: "80"
    ports: ["80:80", "443:443"]
  spring:
    image: ...
  postgres:
    image: postgres:17
    volumes: ["pgdata:/var/lib/postgresql/data"]
```

Domen ulaganingizda Caddyfile'dagi `:{$PORT}` o'rniga domen nomini yozsangiz,
Caddy HTTPS sertifikatini **o'zi oladi va yangilaydi** (`auto_https off`
qatorini olib tashlang). Boshqa hech narsa o'zgarmaydi — arxitektura o'sha.

Server: **Hetzner CX22** (~€4/oy, 2 vCPU / 4 GB) yoki **DigitalOcean** ($6/oy).
Frankfurt/Nürnberg → Toshkent kechikishi qoniqarli.

## Java haqida ochiq gap

Ko'p joyda uchraydigan "Render/Railway bepul tarifi yetarli" maslahati
**Node.js** uchun yozilgan. Java uchun farqlar sezilarli:

- **Xotira.** Bo'sh Node ilovasi ~50 MB, Spring Boot + JVM ~300–500 MB.
  512 MB — chegarada ishlash demak.
- **Sovuq start.** Harakatsizlikdan keyin uxlaydigan tariflarda Node bir
  necha soniyada, Spring Boot esa 30–60 soniyada uyg'onadi.

Railway uxlatmaydi, shuning uchun Java uchun Render'ning bepul tarifidan
qulayroq. Kichik konteynerda JVM'ni cheklang, aks holda u o'ldiriladi:

```
JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75
```

> Tariflar shartlari tez-tez o'zgaradi — yakuniy qaror oldidan platformaning
> joriy narx sahifasini tekshiring.

## Muqobil: statik hosting (Netlify / Cloudflare Pages)

Frontendni Railway'dan tashqarida saqlash kerak bo'lsa, `netlify.toml`
tayyor: SPA fallback yozilgan, `/api` proxysi esa izohda turibdi (backend
manzili qo'shilishi kerak). Mantiq bir xil — proxy orqali bitta origin.

Bunda `Dockerfile`/`Caddyfile` ishlatilmaydi.

## Muqobil: backend statik fayllarni o'zi bersin

Eng kam harakatli variant — `dist/` ni Spring Boot'ning
`src/main/resources/static/` ichiga qo'yish. Bitta xizmat, bitta origin,
CORS yo'q.

Kamchiligi: frontend va backend **birga** deploy bo'ladi (kichik matn
o'zgarishi uchun ham backend qayta yig'iladi) va SPA fallback uchun
Spring'da alohida controller kerak. Ikki repo alohida rivojlanayotgani
uchun bu yerda tanlanmadi.

## Hozircha qilinmagan

- CI yo'q. Sozlanganda ishga tushadigan buyruq:
  `npm run typecheck && npm run lint && npm test && npm run build`
- `Dockerfile` bu muhitda build qilib sinalmagan (Docker demoni yo'q).
  `Caddyfile` esa haqiqiy `dist/` ustida ishga tushirib tekshirilgan:
  SPA fallback, kesh sarlavhalari, `/api` proxysi va cookie'ning ikki
  tomonga o'tishi.
