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

Asl repo: `nurulloh-coder-dev/learning-center-front` (asosiy branch — `N`).
Ish esa fork'da olib boriladi: `Abdulmajidkhan007/learning-center-front`.

**Nega fork, collaborator huquqi bor bo'lsa ham:** kodni ko'p hollarda agent
yozadi. Fork'da ishlanganda agentda asl repo'ga yozish huquqi umuman
bo'lmaydi — eng yomon holatda o'z fork'ingizda keraksiz branch paydo
bo'ladi, xolos. Har bir o'zgarish PR orqali odam ko'zidan o'tadi va asl
repo tarixiga tasodifan tegib bo'lmaydi.

Tartib:

1. Har bir mantiqiy ish uchun alohida branch (`feature/...`).
2. Ish tugagach fork'ga push qilinadi.
3. Odam PR ochadi va merge qiladi:
   `https://github.com/nurulloh-coder-dev/learning-center-front/compare/N...Abdulmajidkhan007:<branch>`
4. PR merge bo'lgach fork asl repo bilan sinxronlanadi (pastga qarang).

**PR — har commit uchun emas, tugagan ish uchun.**

### Fork'ni sinxronlash

Asl repo oldinga ketsa, ish boshlashdan oldin:

```bash
git remote add upstream https://github.com/nurulloh-coder-dev/learning-center-front.git   # bir marta
git fetch upstream
git checkout N
git merge upstream/N
git push origin N
```

(GitHub'da "Sync fork" tugmasi ham shuni qiladi.)

## Hujjatlar

23. Imkoniyat qo'shilsa yoki sezilarli o'zgarsa — **o'sha commitning o'zida**
    `README.md` va tegishli `docs/` fayli yangilanadi.

## Hali yechilmagan narsalar

- Teacher paneldagi KPI kartalar, uy vazifasi, guruh progressi va ballar —
  backendda endpoint yo'q, ular `PendingBackend` bilan bo'sh turibdi.
- Sozlamalardagi profil, parol va markaz bloklari ham shunday (forma tayyor,
  yuborish o'chirilgan).
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
