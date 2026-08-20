# Arxitektura tarixi — "nega shunday qilingan"

`CLAUDE.md` faqat qoidalarni aytadi. Bu fayl **sabablarini** saqlaydi:
qoidani buzmoqchi bo'lsangiz, avval shu yerdan uning narxini o'qing.

Uni har sessiyada o'qish shart emas. Kerak bo'lgan bandnigina oching.

---

## 1. Nega bitta `apiFetch`, har sahifada `fetch` emas

Boshida har sahifaning o'z `authFetch` nusxasi bor edi — uchta nusxa,
uchtasida ham bir xil xato ehtimoli. Ikkita nozik joy borligi uchun bu
qimmatga tushdi:

- `credentials: 'include'` — refresh token httpOnly cookie'da. Bitta
  nusxada unutilsa, o'sha ekran sababsiz 401 beradi.
- Ba'zi endpoint'lar **200 qaytarib tanani bo'sh qoldiradi** (204 ham emas).
  `res.json()` bunda xato beradi. Shuning uchun `apiFetch` avval matn
  o'qiydi, keyin parse qiladi.

Xato javobining ikki xil shakli ham shu yerda birlashtirilgan
(`src/shared/api/httpClient.ts:83`): odatiy
`{ timestamp, errorCode, message, path }` va validatsiya xaritasi
`{ "phone": "must not be blank" }`. Ikkinchisi o'qilmasa forma
"Request failed (400)" deb turaverardi.

## 2. Nega token faqat React state'da

`localStorage` dagi token — XSS uchun tayyor o'lja. Uzoq muddatli kirish
httpOnly refresh cookie orqali: sahifa ochilganda `AuthProvider`
`/auth/refresh-token` ga POST yuboradi va yangi access token oladi
(`src/app/providers/AuthProvider.tsx:17`).

Narxi: sahifa yangilanganda bir so'rov kutiladi. Shuning uchun
`AppRoutes` `isRestoring` tugamaguncha `null` qaytaradi — aks holda
kirgan foydalanuvchi bir lahza login ekranini ko'rib qoladi.

## 3. Nega JWT imzosi tekshirilmaydi

`src/shared/lib/jwt.ts` payload'ni imzosiz ochadi. Bu ataylab: mijozda
imzo tekshirishning **hech qanday** xavfsizlik qiymati yo'q — kalit
brauzerda bo'lishi mumkin emas. Undan faqat "qaysi panelni ko'rsatay"
degan savolga javob olinadi. Haqiqiy avtorizatsiya — backendda.

Muhim: hozir backendda `@PreAuthorize` yo'q (`docs/backend-notes.md`,
1-band), ya'ni bu tayanch hali bo'sh. Frontenddagi rol tekshiruvi —
qulaylik, himoya emas.

## 4. Nega production'da `/api` ni frontend xizmati uzatadi

Refresh token httpOnly cookie'da yuboriladi. Frontend va backend turli
domenlarda bo'lsa, bu **cross-site** cookie bo'lib qoladi:
`SameSite=None` talab qilinadi va Safari/Brave uni baribir bloklaydi.

Railway'da bu ayniqsa yomon: `up.railway.app` Public Suffix List'da,
ya'ni ikki Railway subdomeni brauzer uchun **butunlay boshqa sayt**.

Proxy bilan brauzer uchun hammasi bitta origin: cookie oddiy
`SameSite=Lax` bo'lib qolaveradi va CORS umuman kerak bo'lmaydi.
Shuning uchun ildizda `Dockerfile` + `Caddyfile` bor va kodda absolyut
backend URL yozilmaydi.

## 5. Production 403 sagasi — nima o'rganildi

Deploydan keyin login `Request failed (403)`, tana bo'sh edi. GET'lar
o'tardi, faqat POST yiqilardi.

Sabab: brauzer **POST** so'rovida `Origin` sarlavhasini **same-origin
bo'lganda ham** yuboradi (GET da yubormaydi). Spring'ning CORS filtri
`allowedOrigins` ro'yxatida faqat `http://localhost:5173` ni ko'radi va
so'rovni controller'gacha yetkazmasdan 403 bilan rad etadi.

Ikki marta chalg'itgan narsa:

1. Backend jamoasi `FRONT_URL` ni qo'shgandi — lekin
   `application.yaml` ning **izohga olingan** yuqori yarmiga. Ishlaydigan
   qism 47-qatordan boshlanadi va u yerda hali `localhost:5173` turibdi.
2. Deploy qilinayotgan repo almashgan: `goodman113/learning_center` emas,
   **`nurulloh-coder-dev/learning-center`** (branch `N`, paket
   `org.example.crm`). Eski repoga qarab turib "o'zgarmabdi" degan
   noto'g'ri xulosa chiqarilgandi.

Xulosa: "tuzatdik" degan gapni **ishlaydigan** konfiguratsiya bilan
solishtirmasdan qabul qilmang, va qaysi repo/branch deploy bo'layotganini
aniq biling.

## 6. Nega tarjimalar bo'lim-bo'lim fayllarga bo'lingan

Avval barcha o'zbekcha kalitlar bitta katta faylda edi. Uch kishi bir vaqtda ishlaganda har
PR o'sha faylga tegardi va har safar konflikt chiqardi.

Endi `src/shared/i18n/locales/uz/payments.ts`,
`src/shared/i18n/locales/uz/superAdmin.ts` … — turli
bo'limlarga tegilsa to'qnashuv bo'lmaydi.

`uz` — haqiqat manbai: `TranslationKey = keyof typeof uz`. `ru`/`en`
fayllari `Record<XKeys, string>` deb yozilgani uchun kalit unutilsa
`tsc` **qaysi faylda** ekanini aytadi. Qo'shimcha qatlam sifatida
`src/shared/i18n/locales/locales.test.ts` ortiqcha kalit, bo'sh matn va mos kelmagan
o'rin egallovchilarni ushlaydi.

## 7. Nega Redux emas

Ilovadagi holatning deyarli hammasi — server ma'lumoti. Unga kerak
bo'lgani: kesh, "yuklanmoqda", xato, qayta so'rash, invalidatsiya.
TanStack Query shuni beradi; Redux'da bularning hammasi qo'lda yoziladi.

Chinakam mijoz holati (tema, til, sessiya, forma qoralamasi) juda kam —
ular kontekst yoki `useState` bilan yetarli.

## 8. Nega demo alohida config bilan

`npm run build:demo` backendsiz, bitta HTML fayl chiqaradi — dizaynni
ko'rsatish uchun. U asosiy `vite.config.ts` ga **tegmaydi**: demo kodi
production bundle'ga tushishi mumkin bo'lgan har qanday yo'l xavf.
Tekshirildi: `src/main.tsx` va `src/app/App.tsx` `src/demo/` ni bilmaydi.

Demo'da bir marta jiddiy xato bo'lgan: `json(null, 204)` — 204 javob
tana ko'tara olmaydi, brauzer Response yasashdan bosh tortadi va ikkala
DELETE oqimi jimgina buzilgandi. Shundan `noContent()` yordamchisi
paydo bo'ldi.

## 9. Nega fork'da ishlanadi

Asl repo `nurulloh-coder-dev/learning-center-front` boshqa odamniki va
unga Claude GitHub app o'rnatilmagan (o'rnatish uchun repoda admin
huquqi kerak). Fork'da agentda asl repoga yozish huquqi umuman
bo'lmaydi — eng yomon holatda o'z fork'ingizda keraksiz branch paydo
bo'ladi, xolos.

App o'rnatilsa oqim soddalashadi: fork kerak bo'lmaydi. `N` ga
to'g'ridan-to'g'ri push qilmaslik qoidasi esa o'zgarmaydi.

## 10. Sahifa nega mantiq saqlamaydi

`AdminDashboardPage` bir vaqtlar **974 qator** edi. Mantiq hook'larga,
takrorlanuvchi ko'rinish komponentlarga chiqarilgandan keyin ~230
qatorga tushdi va `useAttendanceDraft` ni DOM'siz test qilish mumkin
bo'ldi. 250 qatorlik chegara — o'sha tajribadan.

---

## Loyihaning hozirgi holati

**Ishlaydi va backendga ulangan:** kirish, admin paneli (o'quvchi /
o'qituvchi / guruh / dars CRUD, guruhga o'quvchi qo'shish va chiqarish),
o'qituvchi paneli va davomat, o'quvchi profili, sozlamalar (til, tema,
profil, parol), to'lovlar (`/payments`, qaytarim bilan), super-admin
(tashkilotlar va filiallar).

**Backend kutayotganlar** — batafsili `docs/backend-notes.md` da:

- Teacher paneldagi KPI kartalar, uy vazifasi, guruh progressi, ballar —
  endpoint yo'q, `PendingBackend` bilan bo'sh turibdi.
- Sozlamalardagi **markaz** bloki: `/auth/me` (`UserDto`) `branchId`
  qaytarmaydi.
- O'quvchi paneli davomat/guruh: "o'zimniki" endpoint'i yo'q.
  `GET /attendance` butun markaz yozuvlarini beradi.
- Davomatdagi "sabab" matni: `AttendanceStudentCreateDto` da maydon yo'q.
- `InvoiceDto` da `type` yo'q, shuning uchun "Turi" ustuni doim bo'sh.
- Avtomatik parol: `Generator.generatePassword()` hash qaytaradi, ochiq
  matnni emas — parolni hech kim bilolmaydi.
- Tashkilot yaratilganda super-admin avtomatik yaratilmaydi.

**Backend tayyor, frontendda qilinishi kerak** (`learning-center@N` da
2026-08-19 da paydo bo'ldi):

- `GET /attendance/group/{groupId}` — davomat filtri hali mijozda.
- `BranchDto.organization` — filial qaysi tashkilotniki, ko'rsatilmayapti.
- `OrganizationService.delete` endi haqiqiy `softDelete` — o'chirish
  tugmasi qo'yilishi mumkin.
- `/api/v1/leads` — Leads bo'limi umuman yozilmagan.

**Sinalmagani:** `Dockerfile` haqiqiy Docker demonida build qilinmagan
(muhitda demon yo'q edi). `Caddyfile` esa haqiqiy `dist/` ustida
tekshirilgan.
