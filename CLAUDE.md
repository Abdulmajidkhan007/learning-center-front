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
7. **DTO tiplari** faqat `shared/types/` da. Backend DTO'si tasdiqlanmaguncha
   maydonlar optional qoladi.

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
14. **UI matnlari, xato xabarlari, commit xabarlari — inglizcha** (loyihada
    shunday).

## Xavfsizlik

15. **Kalit, token, parol kodga yozilmaydi.** Loyihada `.env` ishlatilmaydi.
16. **Access token faqat React state'da**, `localStorage` da emas. Uzoq
    muddatli kirish — httpOnly refresh cookie orqali.
17. `shared/lib/jwt.ts` imzoni **tekshirmaydi**. U faqat UI'ni kerakli panelga
    yo'naltirish uchun. Xavfsizlik qarori backendda.

## Testlar

18. Mantiq qo'shilsa yoki xato tuzatilsa — test yoziladi.
19. Test tekshirayotgan fayl yonida turadi (`format.ts` → `format.test.ts`).
20. Element rol/matn bo'yicha topiladi (`getByRole`, `getByLabelText`),
    `data-testid` bo'yicha emas. Tailwind klasslari test qilinmaydi.

## Deploy

22. **`/api` productionda hosting proxysi orqali uzatiladi**, kodga absolyut
    backend URL yozilmaydi — refresh cookie same-site bo'lib qolishi kerak.
23. **SPA fallback shart:** `/*` → `/index.html`. Busiz `/attendance` ni
    yangilaganda 404 chiqadi.
24. `src/demo/` faqat demo build uchun (`npm run build:demo`) — production
    bundle'ga tushmaydi va unga bog'liqlik qo'shilmaydi.

## Hujjatlar

21. Imkoniyat qo'shilsa yoki sezilarli o'zgarsa — **o'sha commitning o'zida**
    `README.md` va tegishli `docs/` fayli yangilanadi.

## Hali yechilmagan narsalar

- Backend DTO'lari tasdiqlanmagan — `features/admin/config/forms.ts` va
  `shared/types/` dagi shakllar taxminiy.
- Guruhga o'quvchi biriktirish endpoint'i yo'q (`AssignStudentsModal` —
  vaqtinchalik matn).
- Davomat "guruh bo'yicha" filtri mijozda bajariladi, chunki backendda
  bunday endpoint yo'q (`useAttendanceRecords`).
- CI sozlanmagan.
- Backend manzili ma'lum emas — `netlify.toml` dagi `/api` proxysi izohda.
