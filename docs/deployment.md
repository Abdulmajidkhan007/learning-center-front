# Deploy

Frontend statik (`dist/` — HTML + JS + CSS), backend esa alohida Spring Boot
ilovasi. Shu ikkisini qanday joylashtirish — pastda.

## Avval: ikkita narsa hal qilinishi kerak

Bular platformadan qat'i nazar kerak, va e'tibordan chetda qolsa deploy
qilingandan keyin "nega ishlamayapti" degan savol tug'iladi.

### 1. `/api` ni kim uzatadi

Dev rejimda `/api` ni Vite proxysi `localhost:8080` ga uzatadi
(`vite.config.ts`). **Productionda Vite yo'q** — statik hosting `/api/v1/...`
so'rovini o'zining fayl tizimida qidiradi va 404 qaytaradi.

Ikki yo'l bor:

| Yo'l | Nima qilinadi | Baho |
| --- | --- | --- |
| **Hosting proxysi** | `/api/*` → backend, `status = 200` | **Tavsiya etiladi** — kod o'zgarmaydi, cookie muammosi yo'q |
| Absolyut URL | Kodda `https://api.../api/v1/...` yoziladi | CORS + cross-site cookie muammosini olib keladi |

Netlify uchun tayyor sozlama `netlify.toml` da (izohli holda turibdi —
backend manzili ma'lum bo'lgach yoqing).

### 2. httpOnly cookie va "same-site" qoidasi

Auth shunday ishlaydi: access token React state'da, uzoq muddatli kirish esa
**httpOnly refresh cookie** orqali (`credentials: 'include'`). Bu to'g'ri
yechim, lekin cookie'lar domenga bog'liq:

- `app.netlify.app` + `api.onrender.com` → **turli domenlar**, ya'ni cross-site.
  Cookie `SameSite=None; Secure` bo'lishi shart, va Safari (ITP) hamda Brave
  uni baribir bloklashi mumkin. Foydalanuvchi har safar qaytadan kirishga
  majbur bo'ladi.
- `app.example.uz` + `api.example.uz` → **bitta asosiy domen**, ya'ni same-site.
  Oddiy `SameSite=Lax` yetarli. CORS kerak (`Access-Control-Allow-Credentials: true`
  va aniq `Origin`, `*` emas).
- Hosting proxysi (yuqoridagi 1-yo'l) → brauzer uchun **bitta origin**.
  Cookie ham, CORS ham muammo emas.

**Xulosa: demo bosqichida proxy, productionda o'z domeningiz ostida
`app.` va `api.` subdomenlari.**

## Tavsiya

### Hozir — sheriklarga ko'rsatish uchun

| Qism | Qayerda | Nega |
| --- | --- | --- |
| Frontend | **Netlify** yoki **Cloudflare Pages** | Bepul, CDN, GitHub'ga push qilsangiz o'zi deploy qiladi. Statik fayllarni o'zimiz hostlashning ma'nosi yo'q |
| Backend + DB | **Railway** yoki kichik **VPS** | Pastga qarang |

Backendsiz ham ko'rsatish kerak bo'lsa — `npm run build:demo` soxta ma'lumot
bilan ishlaydigan bitta HTML fayl beradi (`dist-demo/cornerstone-demo.html`),
uni istalgan joyga tashlash mumkin.

### Spring Boot uchun PaaS haqida ochiq gap

Sherigingiz aytgan Render/Railway maslahati **Node.js** uchun yozilgan. Java
uchun farqlar bor va ular sezilarli:

- **Xotira.** Bo'sh Node ilovasi ~50 MB, Spring Boot esa JVM bilan birga
  ~300–500 MB oladi. Bepul tariflardagi 512 MB — chegarada ishlash demakdir.
- **Sovuq start.** Bepul tarifda xizmat harakatsizlikdan keyin uxlaydi.
  Node bir necha soniyada uyg'onadi, Spring Boot esa 30–60 soniya.
  Demo ko'rsatayotganda birinchi bosgan odam yarim daqiqa kutadi.
- **Ma'lumotlar bazasi.** Bepul Postgres tariflarining muddati bor.

Shuning uchun Java uchun: **Railway** (uxlamaydi, Postgres yonida) yoki
to'g'ridan-to'g'ri VPS. Render'ning bepul tarifi Java uchun noqulay.

> Bepul tariflarning shartlari tez-tez o'zgaradi — yakuniy qaror oldidan
> platformaning joriy narx sahifasini tekshiring.

### Production — VPS

Sherigingiz haq: sizning biznes modelingiz (hosting va texnik xizmat)
uchun VPS'dan boshlash to'g'ri. **Hetzner CX22** (~€4/oy, 2 vCPU / 4 GB) yoki
**DigitalOcean** ($6/oy). Frankfurt/Nürnberg → Toshkent kechikishi qoniqarli.

Server ichida Docker Compose:

```
caddy      → HTTPS sertifikatini o'zi oladi va yangilaydi
spring     → backend (JAR yoki Docker image)
postgres   → volume bilan, kunlik pg_dump
```

Frontend baribir Netlify/Cloudflare'da qolsin — bepul CDN'ni VPS'ning
Nginx'i bilan almashtirishning foydasi yo'q. Yoki hammasi bitta serverda
bo'lsin desangiz, Caddy statik fayllarni ham beradi va `/api` ni backendga
uzatadi:

```caddyfile
app.example.uz {
    root * /srv/frontend
    file_server
    try_files {path} /index.html      # SPA fallback
    handle /api/* {
        reverse_proxy spring:8080
    }
}
```

Bu variantda cookie ham, CORS ham muammo emas — hammasi bitta origin.

## Frontend deploy qadamlari

1. Build: `npm run build` → `dist/`
2. Statik hostingga `dist/` ni bering (Netlify'da `publish = "dist"`).
3. **SPA fallback shart:** `/*` → `/index.html` (200). Busiz `/attendance`
   ni yangilaganda 404 chiqadi. `netlify.toml` da bor.
4. `/api/*` proxysini yoqing (backend manzili bilan).

Muhit o'zgaruvchilari kerak emas — loyihada `.env` ishlatilmaydi.

## Backend tomonidan kerak bo'ladigan narsalar

Frontend ishlashi uchun backendda:

- `Set-Cookie` da `HttpOnly; Secure; SameSite=Lax` (proxy yoki bitta domen
  ishlatilsa). Alohida domenlar bo'lsa — `SameSite=None; Secure`.
- Proxy ishlatilmasa CORS: aniq `Origin`, `Access-Control-Allow-Credentials: true`.
- `POST /api/v1/auth/refresh-token` cookie bo'lmasa **401** qaytarsin —
  frontend buni "kirilmagan" deb tushunadi va login sahifasini ko'rsatadi.
- Sog'liq tekshiruvi uchun endpoint (`/actuator/health`) — platformalar shuni
  so'raydi.

Kichik serverda JVM'ga chegara qo'ying, aks holda konteyner o'ldiriladi:

```
JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75
```

## Hali qilinmagan

- CI yo'q. Sozlanganda ishga tushadigan buyruq:
  `npm run typecheck && npm run lint && npm test && npm run build`
- Backend manzili ma'lum emas, shuning uchun `netlify.toml` dagi proxy
  bloki izohda turibdi.
