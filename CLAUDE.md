# CLAUDE.md — loyiha qoidalari

Bu fayl kodga tegadigan har bir kishi (odam yoki agent) uchun. Batafsil
tushuntirishlar `docs/` da; bu yerda faqat **buzilmasligi kerak** bo'lgan
qoidalar.

## Buyruqlar

```bash
npm run dev
npm run typecheck     # tsc -b
npm test              # vitest run
npm run lint          # eslint .
npm run build         # tsc -b && vite build
```

Topshirishdan oldin to'rttasi ham o'tishi shart:
`npm run typecheck && npm run lint && npm test && npm run build`

## Arxitektura qoidalari

1. **Qatlam yo'nalishi: `app → features → shared`.** `shared` hech qachon
   `features`/`app` dan import qilmaydi. Bo'limlar bir-biridan import
   qilmaydi — umumiy narsa `shared` ga chiqariladi.
2. **Sahifalar mantiq saqlamaydi.** HTTP → `api/`, holat va so'rovlar →
   `hooks/`, ko'rinish → `components/`. `pages/` faqat yig'adi.
3. **Bitta fayl ~250 qatordan oshmasin.** Oshsa — mantiqni hook'ka, ko'rinishni
   komponentga ajrating.
4. **Yangi `fetch` yozilmaydi.** Faqat `shared/api/httpClient.ts` dagi
   `apiFetch`. U `credentials: 'include'`, `Authorization` va bo'sh tanali
   `200` javoblarni to'g'ri boshqaradi.
5. **Server ma'lumoti `useState` da saqlanmaydi** — TanStack Query.
   Mutatsiyadan keyin `invalidateQueries`, qo'lda `setState` emas.
6. **Query kalitlari** faqat `shared/api/queryKeys.ts` dan.
7. **DTO tiplari** faqat `shared/types/` da. Ular `goodman113/learning_center`
   dagi haqiqiy Java record'laridan olingan — o'zgartirishdan oldin o'sha
   repo bilan solishtiring.

## Stil qoidalari

8. **Inline `style` obyektlari ishlatilmaydi** — faqat Tailwind klasslari.
9. **Komponentda hex rang yozilmaydi.** Semantik tokenlar: `bg-surface`,
   `text-fg-muted`, `border-border-base`. Yangi rang kerak bo'lsa —
   `src/styles/index.css` ga (`:root` + `.dark` + `@theme inline`).
10. **Har bir yangi ekran dark rejimda tekshiriladi.** Tema `<html class="dark">`
    orqali ishlaydi, `prefers-color-scheme` orqali emas.
11. `tailwind.config.js` yaratilmaydi — Tailwind 4 da sozlama CSS ichida.
12. `shared/ui/*.tsx` faqat komponent eksport qiladi. Konstanta/funksiya
    alohida `.ts` faylga (Fast Refresh buzilmasin).

## Til

13. **Kod izohlari — o'zbekcha.** Izoh "nima qilinyapti" emas, **nega shunday**
    qilinganini tushuntirsin.
14. **Commit xabarlari — inglizcha** (loyihada shunday).
15. **UI matni kodga yozilmaydi.** Faqat `t('kalit')`. Yangi matn: avval
    `locales/uz.ts` ga (haqiqat manbai), keyin `ru.ts` va `en.ts` ga —
    unutilsa `tsc` xato beradi.
16. **Backenddan kelgan matn tarjima qilinmaydi** (ism, guruh nomi, server
    xatosi) — u qanday kelsa shunday ko'rsatiladi.

## Xavfsizlik

17. **Kalit, token, parol kodga yozilmaydi.** Loyihada `.env` ishlatilmaydi.
18. **Access token faqat React state'da**, `localStorage` da emas. Uzoq
    muddatli kirish — httpOnly refresh cookie orqali.
19. `shared/lib/jwt.ts` imzoni **tekshirmaydi**. U faqat UI'ni kerakli panelga
    yo'naltirish uchun. Xavfsizlik qarori backendda.

## Testlar

20. Mantiq qo'shilsa yoki xato tuzatilsa — test yoziladi.
21. Test tekshirayotgan fayl yonida turadi (`format.ts` → `format.test.ts`).
22. Element rol/matn bo'yicha topiladi (`getByRole`, `getByLabelText`),
    `data-testid` bo'yicha emas. Tailwind klasslari test qilinmaydi.

## Deploy

24. **`/api` productionda frontend xizmatining proxysi orqali uzatiladi**
    (`Caddyfile`), kodga absolyut backend URL yozilmaydi — refresh cookie
    same-site bo'lib qolishi kerak. Backendga ochiq domen berilmaydi.
25. **SPA fallback shart:** `/*` → `/index.html`. Busiz `/attendance` ni
    yangilaganda 404 chiqadi.
26. `src/demo/` faqat demo build uchun (`npm run build:demo`) — production
    bundle'ga tushmaydi va unga bog'liqlik qo'shilmaydi.

## Git ish tartibi

Asl repo: `nurulloh-coder-dev/learning-center-front`, asosiy branch — **`N`**.
Ish esa fork'da: `Abdulmajidkhan007/learning-center-front`.

**Nega fork:** asl repo boshqa odamniki va unga Claude GitHub app o'rnatilmagan
(o'rnatish uchun repoda admin huquqi kerak). Bundan tashqari fork'da agentda
asl repoga yozish huquqi umuman bo'lmaydi — eng yomon holatda o'z fork'ingizda
keraksiz branch paydo bo'ladi, xolos.

```
agent/<qisqa-nom>      masalan: agent/payments, agent/super-admin
```

Bitta uzun "hamma narsa" branchi EMAS: uzoq yashagan branch qancha kutsa,
konflikt ehtimoli shuncha oshadi. Bitta ish tugadi — PR, merge, keyingisi
yangi branchdan.

Ish boshlashdan oldin **doim** asl repodan yangilanishni oling:

```bash
git fetch https://github.com/nurulloh-coder-dev/learning-center-front N
git checkout -b agent/<nom> FETCH_HEAD
```

(Asl repo ochiq, shuning uchun o'qish uchun app ham, huquq ham kerak emas.)

Ish tugagach fork'ga push qilinadi va odam PR ochadi:

```
https://github.com/nurulloh-coder-dev/learning-center-front/compare/N...Abdulmajidkhan007:agent/<nom>
```

PR — har commit uchun emas, **tugagan ish uchun**. `N` ga to'g'ridan-to'g'ri
push hech qachon qilinmaydi.

### Konfliktdan qochish

Uch kishi bir vaqtda ishlaganda eng ko'p to'qnashadigan joylar:

1. **`src/shared/i18n/locales/*.ts`** — hamma yangi kalit qo'shadi va hammasi
   faylning bir joyiga tushadi. Kalitni **o'z bo'liming blokiga** qo'ying
   (`// --- to'lovlar ---` kabi), faylning oxiriga emas.
2. **`src/shared/types/index.ts`** — DTO qo'shganda ham shunday: mavjud
   bloklarga tegmang, yangisini alohida qo'shing.
3. **`shared/ui/`** — umumiy komponentni o'zgartirish hammaga ta'sir qiladi.
   Tegishdan oldin kelishing.

Qolgan hamma narsa `features/<bo'lim>/` ichida — u yerda har kim o'z
papkasida ishlagani uchun to'qnashuv bo'lmaydi. Shuning uchun **yangi ish
imkon qadar o'z bo'lim papkasida** yozilsin.

### Asl repoda to'g'ridan-to'g'ri ishlash

Buning uchun repo egasi Claude GitHub app'ni o'sha repoga o'rnatishi kerak
(GitHub → repo → Settings → GitHub Apps → Claude → Configure). O'rnatilgach
oqim soddalashadi: fork kerak bo'lmaydi, branch to'g'ridan-to'g'ri asl
repoda ochiladi. `N` ga push qilmaslik qoidasi o'zgarmaydi.

## Hujjatlar

23. Imkoniyat qo'shilsa yoki sezilarli o'zgarsa — **o'sha commitning o'zida**
    `README.md` va tegishli `docs/` fayli yangilanadi.

## Hozirgi holat (qisqacha)

Tayyor va ulangan: kirish, admin paneli (o'quvchi/o'qituvchi/guruh/dars CRUD,
guruhga o'quvchi qo'shish va chiqarish), o'qituvchi paneli va davomat,
o'quvchi paneli, sozlamalar, **to'lovlar** (`/payments`), **super-admin**
(tashkilotlar va filiallar).

Backend bilan bog'liq ochiq savollar va so'rovlar —
[`docs/backend-api-request.md`](docs/backend-api-request.md), topilgan
xatolar — [`docs/backend-notes.md`](docs/backend-notes.md). Yangi ish
boshlashdan oldin shu ikkisiga qarang: ko'p ekran aynan o'sha bandlar
tuzatilmagani uchun cheklangan.

## Hali yechilmagan narsalar

- Teacher paneldagi KPI kartalar, uy vazifasi, guruh progressi va ballar —
  backendda endpoint yo'q, ular `PendingBackend` bilan bo'sh turibdi.
- Sozlamalardagi **markaz** bloki bo'sh: uni ulash uchun `/auth/me`
  foydalanuvchining filiali (`branchId`) ni qaytarishi kerak — hozir
  qaytarmaydi. Profil va parol bloklari esa ulangan va ishlaydi.
- Tashkilot yaratilganda super-admin avtomatik yaratilmaydi — backend uni
  qo'lda qo'shadi, forma buni ochiq aytadi.
- Tashkilotni o'chirish yo'q: backendda `OrganizationService.delete` bo'sh
  metod, lekin 204 qaytaradi — tugma qo'ysak yolg'on bo'lardi.
- Filial qaysi tashkilotga tegishli ekani ko'rinmaydi: `BranchDto` da
  `organization` izohga olingan.
- Avtomatik parol generatsiyasi ishlamaydi: `Generator.generatePassword()`
  ochiq matnni emas, hash'ni qaytaradi — parolni hech kim bilolmaydi.
- Davomatdagi "sabab" matni serverga yuborilmaydi —
  `AttendanceStudentCreateDto` da maydon yo'q.
- `GET /group/groups` faqat `{id, name}` qaytaradi, shuning uchun
  o'qituvchi panelidagi toq/juft filtri proyeksiyaga `dayType` qo'shilmaguncha
  yashirin turadi.
- Backendda tuzatilishi kerak bo'lgan narsalar — `docs/backend-notes.md`.
- Davomat "guruh bo'yicha" filtri mijozda bajariladi, chunki backendda
  bunday endpoint yo'q (`useAttendanceRecords`).
- `Dockerfile` build qilib sinalmagan (bu muhitda Docker demoni yo'q edi);
  `Caddyfile` haqiqiy `dist/` ustida tekshirilgan.
