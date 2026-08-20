# CLAUDE.md — loyiha qoidalari

Kodga tegadigan har kim uchun (odam yoki agent). Bu yerda faqat **qoidalar
va xarita**. "Nega shunday" — [`docs/ARXITEKTURA-TARIXI.md`](docs/ARXITEKTURA-TARIXI.md),
u faqat kerak bo'lganda o'qiladi.

## Buyruqlar

```bash
npm install
npm run dev           # http://localhost:5173, `/api` → localhost:8080
npm run typecheck     # tsc -b
npm run lint          # eslint .
npm test              # vitest run
npm run build         # tsc -b && vite build → dist/
npm run test:watch    # vitest, kuzatuv rejimi
npm run test:coverage # qamrov hisoboti
npm run build:demo    # backendsiz demo → dist-demo/
npm run preview       # tayyor dist/ ni lokal ko'rish
```

**Topshirishdan oldin to'rttasi ham o'tishi shart:**

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

CI (`.github/workflows/ci.yml`) aynan shu to'rttasini ishga tushiradi,
boshqa hech narsani — "menda ishlayapti, CI'da yiqilyapti" bo'lmasligi uchun.

## Ish tartibi

Asl repo: `nurulloh-coder-dev/learning-center-front`, asosiy branch — **`N`**.
Ish fork'da: `Abdulmajidkhan007/learning-center-front`.

```bash
git fetch https://github.com/nurulloh-coder-dev/learning-center-front N
git checkout -b agent/<qisqa-nom> FETCH_HEAD
```

- Branch nomi: `agent/<bo'lim>` — `agent/payments`, `agent/leads`.
  Agent sessiyasiga tayin branch berilgan bo'lsa, o'shanisi ishlatiladi.
- **`N` ga to'g'ridan-to'g'ri push QILINMAYDI.** PR — har commit uchun emas,
  tugagan ish uchun.
- Bitta uzun "hamma narsa" branchi ochilmaydi — uzoq yashagan branch qancha
  kutsa, konflikt shuncha oshadi.
- Commit xabarlari — **inglizcha** (loyihada shunday). Kod izohlari —
  **o'zbekcha**.
- PR havolasi:
  `https://github.com/nurulloh-coder-dev/learning-center-front/compare/N...Abdulmajidkhan007:agent/<nom>`

### Konflikt chiqadigan uch joy

1. `src/shared/i18n/locales/` — kalitni **o'z bo'liming fayliga** qo'y.
2. `src/shared/types/index.ts` — mavjud bloklarga tegma, yangisini qo'sh.
3. `src/shared/ui/` — hammaga ta'sir qiladi, tegishdan oldin kelish.

Qolgan hamma narsa `features/<bo'lim>/` ichida — u yerda to'qnashuv bo'lmaydi.
Shuning uchun yangi ish **imkon qadar o'z bo'lim papkasida** yozilsin.

---

## Arxitektura qoidalari

1. **Qatlam yo'nalishi: `app → features → shared`.** `shared` `features`/`app`
   dan import QILMAYDI; bo'limlar bir-biridan import QILMAYDI.
   *Sabab: bo'lim qayta yozilsa qolgan kodga tegilmasin.*
2. **Sahifalar mantiq saqlamaydi.** HTTP → `api/`, so'rov va holat →
   `hooks/`, ko'rinish → `components/`. `pages/` faqat yig'adi.
   *Sabab: mantiq DOM'siz test qilinadi.*
3. **Bitta fayl ~250 qatordan oshmasin.** Oshsa — mantiqni hook'ka,
   ko'rinishni komponentga ajrat.
4. **Yangi `fetch` yozilmaydi.** Faqat `src/shared/api/httpClient.ts` dagi
   `apiFetch`. *Sabab: u `credentials: 'include'`, `Authorization`,
   `Accept-Language` va bo'sh tanali `200` javoblarni to'g'ri boshqaradi.*
5. **Server ma'lumoti `useState` da saqlanmaydi** — TanStack Query.
   Mutatsiyadan keyin `invalidateQueries`, qo'lda `setState` EMAS.
6. **Query kalitlari** faqat `src/shared/api/queryKeys.ts` dan.
   *Sabab: kalit satrini qo'lda yozish — invalidatsiya xatolarining manbai.*
7. **DTO tiplari** faqat `src/shared/types/` da. Manba —
   `nurulloh-coder-dev/learning-center` (branch `N`) dagi Java record'lari.
   O'zgartirishdan oldin o'sha repo bilan solishtiring. Eski
   `goodman113/learning_center` ga qaralmaydi.
8. **`shared/ui/` ga faqat ikki yoki undan ko'p bo'lim ishlatadigan narsa**
   qo'shiladi. `shared/ui/*.tsx` faqat komponent eksport qilsin — konstanta
   va funksiya alohida `.ts` faylga (`inputClasses.ts` kabi).
   *Sabab: aks holda Fast Refresh buziladi.*

## Stil qoidalari

9. **Inline `style` obyektlari ishlatilmaydi** — faqat Tailwind klasslari.
10. **Komponentda hex rang yozilmaydi.** Semantik tokenlar: `bg-surface`,
    `text-fg-muted`, `border-border-base`. Yangi rang — `src/styles/index.css`
    ga (`:root` + `.dark` + `@theme inline`).
11. **`tailwind.config.js` yaratilmaydi** — Tailwind 4 da sozlama CSS ichida.
12. **Har bir yangi ekran dark rejimda tekshiriladi.** Tema
    `<html class="dark">` orqali ishlaydi, `prefers-color-scheme` orqali emas.
13. Bir xil breakpoint'da qarama-qarshi Tailwind klasslari yozilmaydi
    (`w-full` ustiga `w-auto`) — qaysi biri yutishi CSS tartibiga qolib
    ketadi. `sm:` kabi aniqroq variant ishlating.

## Til qoidalari

14. **UI matni kodga yozilmaydi.** Faqat `t('kalit')`. Yangi matn: avval
    `src/shared/i18n/locales/uz/<bo'lim>.ts` (haqiqat manbai), keyin `ru/` va
    `en/` dagi **o'sha nomli** faylga.
    *Unutilsa `tsc` qaysi faylda ekanini aytadi.*
15. **Backenddan kelgan matn tarjima QILINMAYDI** (ism, guruh nomi, server
    xatosi) — qanday kelsa shunday ko'rsatiladi.
16. **Kod izohlari — o'zbekcha.** Izoh "nima qilinyapti" emas, **nega shunday**
    qilinganini tushuntirsin.

## Xavfsizlik

17. **Kalit, token, parol kodga, hujjatga yoki chatga yozilmaydi.** Loyihada
    `.env` ishlatilmaydi. Repoda kalit ko'rsangiz — darhol ayting.
18. **Access token faqat React state'da**, `localStorage` da EMAS. Uzoq
    muddatli kirish — httpOnly refresh cookie orqali.
19. `src/shared/lib/jwt.ts` imzoni **tekshirmaydi** — u faqat UI'ni kerakli
    panelga yo'naltirish uchun. Xavfsizlik qarori backendda.
20. **Kodga absolyut backend URL yozilmaydi.** Production'da `/api` ni
    frontend xizmatining o'zi uzatadi (`Caddyfile`) — refresh cookie
    same-site bo'lib qolishi kerak.
21. **Buzuvchi yoki qaytarib bo'lmaydigan amaldan OLDIN so'raladi:**
    ma'lumot o'chirish, migratsiya, ommaviy yozuv, force push, tashqi
    xizmatga yuborish, deploy.
22. **Mavjud xatti-harakat "yo'l-yo'lakay" o'zgartirilmaydi.** Vazifadan
    tashqari refaktoring qilinmaydi — taklif qilib qo'yiladi.
23. **Tekshirilmagan narsa "ishlaydi" deyilmaydi.** Nimani tekshira
    olmaganingizni ochiq ayting.

## Testlar

24. Mantiq qo'shilsa yoki xato tuzatilsa — test yoziladi.
25. Test tekshirayotgan fayl yonida turadi (`format.ts` → `format.test.ts`).
26. Element rol/matn bo'yicha topiladi (`getByRole`, `getByLabelText`),
    `data-testid` bo'yicha EMAS. Tailwind klasslari test QILINMAYDI.

## Deploy

27. **SPA fallback shart:** `/*` → `/index.html`. Busiz `/attendance` ni
    yangilaganda 404 chiqadi.
28. `src/demo/` faqat demo build uchun (`npm run build:demo`) — production
    bundle'ga tushmaydi va unga bog'liqlik qo'shilmaydi.

## Hujjatlar

29. Imkoniyat qo'shilsa yoki sezilarli o'zgarsa — **o'sha commitning o'zida**
    `README.md` va tegishli `docs/` fayli yangilanadi.

---

## Xarita — qayerda nima turadi

```
src/
  main.tsx                    kirish nuqtasi
  app/
    App.tsx                   provider'lar + marshrutlar
    ErrorBoundary.tsx
    providers/                AppProviders, AuthProvider, ThemeProvider,
                              LocaleProvider (+ *-context.ts, use*.ts)
    routes/                   AppRoutes, RoleDashboard, NotFoundPage
  features/<bo'lim>/          auth admin teacher attendance payments
                              settings student super-admin
    api/                      endpoint chaqiruvlari; React'ni bilmaydi
    hooks/                    useQuery/useMutation va holat mantiqi
    components/               shu bo'limga xos komponentlar
    lib/                      shu bo'limning sof funksiyalari
    config/                   deklarativ jadval/forma sozlamasi (faqat admin)
    pages/                    ekran — faqat yig'adi
  shared/
    api/                      httpClient(apiFetch), ApiError, queryKeys,
                              requestLocale
    ui/                       AppShell, Button, Modal, Panel, Input, Select,
                              Pagination, Badge, icons, inputClasses.ts …
    lib/                      format, jwt, cn
    i18n/                     translate, useT, locales/{uz,ru,en}/<bo'lim>.ts
    types/index.ts            backend DTO tiplari (bitta fayl)
  styles/index.css            Tailwind + rang tokenlari + dark rejim
  test/                       setup.ts, renderWithProviders.tsx
  demo/                       backendsiz demo (production'ga tushmaydi)
```

Ildizda: `Dockerfile` + `Caddyfile` (production, `/api` proxysi),
`railway.json`, `netlify.toml` (muqobil), `vite.config.ts` (+ test sozlamasi),
`vite.demo.config.ts`, `eslint.config.js`, `tsconfig.app.json`.

### Marshrutlar

`/` → rolga qarab dashboard · `/attendance` · `/payments` · `/settings`
(`src/app/routes/AppRoutes.tsx`). **Diqqat:** hozir marshrutlarda rol
tekshiruvi YO'Q — faqat `RoleDashboard` rolga qaraydi.

## Ma'lum chetlanishlar

Bular allaqachon topilgan, qayta "kashf qilish" shart emas:

- `src/shared/ui/ThemeToggle.tsx:1` — `shared` dan `app` ga import
  (1-qoidaning buzilishi).
- `src/features/teacher/pages/TeacherDashboardPage.tsx:7` va
  `src/features/student/pages/StudentDashboardPage.tsx:5` — bo'limlararo
  import.
- `src/features/teacher/components/RosterList.tsx` — hech qayerdan import
  qilinmagan.
- `src/demo/mockApi.ts` (384 qator) va `src/shared/types/index.ts`
  (256 qator) — 3-qoidadan oshgan.
- Uchta jadval komponenti bir xil `<th>`/`<td>` klasslarini takrorlaydi:
  `admin/components/EntityTable.tsx`, `payments/components/InvoiceTable.tsx`,
  `super-admin/components/SimpleTable.tsx`.

## Hujjatlar

| Fayl | Nima haqida |
| --- | --- |
| [docs/ARXITEKTURA-TARIXI.md](docs/ARXITEKTURA-TARIXI.md) | Nega shunday qilingan + loyihaning hozirgi holati |
| [docs/architecture.md](docs/architecture.md) | Qatlamlar, yangi bo'lim qo'shish |
| [docs/styling.md](docs/styling.md) | Tailwind 4, rang tokenlari, dark rejim |
| [docs/state-management.md](docs/state-management.md) | TanStack Query qoidalari |
| [docs/typescript.md](docs/typescript.md) | TS sozlamalari va tip qoidalari |
| [docs/i18n.md](docs/i18n.md) | Uch tillilik: yangi matn qo'shish |
| [docs/testing.md](docs/testing.md) | Testlarni yozish va ishga tushirish |
| [docs/deployment.md](docs/deployment.md) | Railway, `/api` proxysi, cookie masalasi |
| [docs/backend-notes.md](docs/backend-notes.md) | Backend jamoasiga: topilgan xatolar |
| [docs/backend-api-request.md](docs/backend-api-request.md) | Backend jamoasiga: kerakli API'lar |
