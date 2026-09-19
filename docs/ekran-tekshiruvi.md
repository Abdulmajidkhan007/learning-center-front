# Ekran tekshiruvi (UI/UX Audit Report)

Loyiha bo'ylab barcha barcha 4 ta rol (**Administrator**, **Teacher**, **Student**, **Super admin**), ikki xil ekran hajmi (**Desktop** va **Phone - 390px**), hamda ikki xil tema (**Light** va **Dark**) bo'yicha o'tkazilgan vizual va funksional tekshiruv natijalari.

---

## Topilgan muammolar ro'yxati

### 1. Davomat jadvalida talaba rasmlari (avatar) yo'qligi
* **Ekran:** `/attendance` (Davomat)
* **Rol:** Administrator, Teacher
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** Davomat jadvalida talabalarning faqat ismi ko'rsatilgan, rasm/avatar aks etmaydi. Telefonda tezkor vizual tanib olish uchun o'qituvchiga rasm juda zarur.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/01_attendance_table_phone.png`

---

### 2. Davomatda sabab kiritish dialogining tor va siqilganligi
* **Ekran:** `/attendance` (Davomat -> Sabab modal oynasi)
* **Rol:** Administrator, Teacher
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Telefonda darsga kelmaganlik sababini kiritish oynasi o'ta tor va padding kamligi sababli matn kiritish va bosish noqulay.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/02_attendance_reason_modal_phone.png`

---

### 3. Davomat sarlavhasidagi sana formatining noqulayligi
* **Ekran:** `/attendance` (Davomat)
* **Rol:** Administrator, Teacher
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** Davomat tanlagichida va jadval sarlavhasida sanalar lokallashtirilmagan raqamli yoki ISO formatda ko'rinadi (`2025-03-15`), `15-mart, 2025` kabi o'qilishi qulay o'zbekcha format ishlatilmagan.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/01_attendance_table_phone.png`

---

### 4. Davomat sahifasi filtrlari orasidagi ortiqcha bo'shliq
* **Ekran:** `/attendance` (Davomat)
* **Rol:** Administrator, Teacher
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda sana, guruh va mavzu kiritish maydonlari vertikal joylashganda ularning orasida ortiqcha katta bo'shliq (`gap-6`) bor, bu asosiy jadvalni pastga surib yuboradi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/01_attendance_table_phone.png`

---

### 5. O'qituvchi panelidagi talaba qatorlari bosish maydonining kichikligi
* **Ekran:** Dashboard (`/`)
* **Rol:** Teacher
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda o'qituvchi guruhidagi talabalar ro'yxatida har bir talaba qatori balandligi 20px bo'lib, barmoq bilan bosish uchun o'ta kichik (<44px).
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/03_teacher_dashboard_phone.png`

---

### 6. "Darsni boshlash" modali mobilda siqilganligi
* **Ekran:** Dashboard (`/`)
* **Rol:** Teacher
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Telefonda "Darsni boshlash" tugmasi bosilganda ochiladigan modal oyna chetlari bilan yopishib qoladi va kirish maydoni torayib ketadi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/04_start_lesson_modal_phone.png`

---

### 7. O'qituvchiga guruh biriktirilmagandagi bo'sh holat tushunarsizligi
* **Ekran:** Dashboard (`/`)
* **Rol:** Teacher
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** O'qituvchiga hali hech qanday guruh biriktirilmagan bo'lsa, ekranda faqat umumiy bo'sh holat ko'rinadi va kimga murojaat qilish bo'yicha ko'rsatma berilmaydi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/03_teacher_dashboard_phone.png`

---

### 8. Talaba panelidagi akkordeon sarlavhalari mobilda o'ta kichikligi
* **Ekran:** Dashboard (`/`)
* **Rol:** Student
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Talaba bosh sahifasidagi bo'limlar ("Guruhim va davomat", "Ma'lumotlarim", "Sozlamalar") sarlavha balandligi mobil ekranda bor-yo'g'i 28px ni tashkil qiladi, barmoq bilan bosish o'ta qiyin.
* **Daraja:** **Jiddiy (serious)**
* **Skrinshot:** `docs/screenshots/05_student_dashboard_phone_light.png`

---

### 9. Talaba to'lovlarida summa formati ajratgichsizligi
* **Ekran:** Dashboard (`/` -> To'lovlar bo'limi)
* **Rol:** Student
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** Talabaning to'lov summalari yaxlit xom raqam sifatida ko'rsatiladi (`500000`), probel bilan ajratilgan valyuta formati (`500 000 so'm`) ishlatilmagan.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/05_student_dashboard_phone_light.png`

---

### 10. Dark modeda talaba davomat foizi nishoni ko'rinmasligi
* **Ekran:** Dashboard (`/`)
* **Rol:** Student
* **Ekran hajmi:** Phone, Desktop
* **Tema:** Dark
* **Muammo:** Qorong'i rejimda talabaning davomat foizi nishoni (badge) to'q fon va to'q matn rangiga ega bo'lib qoladi, natijada foiz ko'rsatkichini o'qib bo'lmaydi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/05_student_dashboard_phone_dark.png`

---

### 11. To'lovlar sahifasida qidiruv va filtrlar mobilda sig'masligi
* **Ekran:** `/payments` (To'lovlar)
* **Rol:** Administrator, Teacher, Super admin
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda to'lovlar qidiruvi va holat bo'yicha filter dropdown tugmasi yonma-yon sig'masdan konteyner chetiga chiqib ketadi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/06_payments_page_phone.png`

---

### 12. Invoyslar jadvalida gorizontal surish indikatori yo'qligi
* **Ekran:** `/payments` (To'lovlar)
* **Rol:** Administrator, Super admin
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda invoyslar jadvali o'ng tomonga suriladi, lekin foydalanuvchiga jadval surilishini bildiruvchi soyali yoki vizual ko'rsatkich yo'q.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/06_payments_page_phone.png`

---

### 13. "To'lov qo'shish" modalida summa kiritish formati ko'rinmasligi
* **Ekran:** `/payments` -> To'lov qo'shish modali
* **Rol:** Administrator
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** To'lov qo'shish modalida summa kiritilayotganda kiritilgan raqam real vaqtda ajratgichlar bilan ko'rsatilmaydi (`1000000` o'rniga `1 000 000 so'm`), bu xatolik xavfini oshiradi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/07_add_payment_modal_phone.png`

---

### 14. Admin tab tasmasi mobilda chetdan qirqilishi va visual hint yo'qligi
* **Ekran:** Dashboard (`/`)
* **Rol:** Administrator
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda eng yuqoridagi tab tasmasi ("Talabalar", "O'qituvchilar", "Guruhlar"...) o'ng chetidan qirqilib qoladi, scrollbar yashirilgani sababli davomi borligi bilinmaydi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/08_admin_tab_strip_phone.png`

---

### 15. Jadval paginatsiyasi mobilda bir nechta qatorga buzilib tushishi
* **Ekran:** Dashboard (`/`)
* **Rol:** Administrator, Super admin
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda jadval ostidagi sahifalash (Pagination) tugmalari va "Keyingi"/"Oldingi" yozuvlari sig'masdan 2-3 qatorga bo'linib ketadi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/08_admin_tab_strip_phone.png`

---

### 16. Super Admin panelida tarjima qilinmagan xom matn
* **Ekran:** Dashboard (`/`)
* **Rol:** Super admin
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** Super admin panelida tashkilot doimiy xom domeni (`cornerstone.uz`) kontekstsiz va tarjima qilinmagan kalit kabi matn ko'rinishida chiqarilmoqda.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/13_super_admin_dashboard_desktop.png`

---

### 17. Talaba tafsilotlari modali mobilda juda tig'izligi
* **Ekran:** Dashboard (`/` -> Talaba qatorini bosganda)
* **Rol:** Administrator
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Talaba tafsilotlari modalida talabaning telefon raqami, balansi, guruhi va davomat tarixi bir-biriga juda yaqin joylashgan, ajratuvchi chiziqlar yo'q.
* **Daraja:** **Jiddiy (serious)**
* **Skrinshot:** `docs/screenshots/09_student_detail_modal_phone.png`

---

### 18. Guruh bosqichlari narxi valyuta formatida emasligi
* **Ekran:** `/group-levels` (Bosqichlar)
* **Rol:** Administrator, Super admin
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** Guruh bosqichlari narxlari jadvalda o'qilishi qiyin bo'lgan tekis raqam holatida (`600000`) berilgan, `600 000 so'm` formati ishlatilmagan.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/10_group_levels_desktop.png`

---

### 19. "Bosqich qo'shish" modalidagi label'lar dark modeda xira ko'rinishi
* **Ekran:** `/group-levels` -> Bosqich qo'shish modali
* **Rol:** Administrator, Super admin
* **Ekran hajmi:** Phone, Desktop
* **Tema:** Dark
* **Muammo:** Qorong'i rejimda modal ichidagi forma maydonlari sarlavhalari (label) xira kulrang bo'lib, to'q fon bilan kontrasti past.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/11_group_level_modal_dark.png`

---

### 20. Lidlar Kanban ustunlari va kartalar mobilda sig'masligi
* **Ekran:** `/leads` (Lidlar)
* **Rol:** Administrator, Super admin
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Mobil ekranda Kanban ustunlari vertikal taxlanganda, ustun sarlavhasidagi lidlar soni va harakat tugmalari bir-birining ustiga tushib qoladi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/12_leads_kanban_phone.png`

---

### 21. Lid kartalarini telefonda ko'chirish (Drag & Drop) noqulayligi
* **Ekran:** `/leads` (Lidlar)
* **Rol:** Administrator, Super admin
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Telefonda lid kartasini bir ustundan boshqasiga sudrab o'tkazish barmoq bilan ishlaganda noqulay, kartada holatni almashtiruvchi oddiy menyu/dropdown mavjud emas.
* **Daraja:** **Jiddiy (serious)**
* **Skrinshot:** `docs/screenshots/12_leads_kanban_phone.png`

---

### 22. 404 sahifasi Dark modeda fondan ajralib turmasligi
* **Ekran:** `/unknown-404` (Xatolik sahifasi)
* **Rol:** Barcha rollar
* **Ekran hajmi:** Phone, Desktop
* **Tema:** Dark
* **Muammo:** Sahifa topilmadi (404) illustratsiyasi va foni qorong'i rejimda tana foni bilan bir xil bo'lib, vizual chegara va karta ko'rinishini yo'qotadi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/14_404_page_dark.png`

---

### 23. Qidiruv natijasi bo'sh bo'lganda filtrni tozalash tugmasi yo'qligi
* **Ekran:** Dashboard, `/payments`, `/leads`
* **Rol:** Administrator, Teacher, Super admin
* **Ekran hajmi:** Phone, Desktop
* **Muammo:** Qidiruv yoki filter bo'yicha hech narsa topilmaganda "Ma’lumot topilmadi" xabari chiqadi, lekin filtrni bir bosishda tozalash ("Filtrni tozalash") tugmasi taqdim etilmagan.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/06_payments_page_phone.png`

---

### 24. Sozlamalar sahifasidagi "Chiqish" tugmasi balandligi mobilda kichikligi
* **Ekran:** `/settings` (Sozlamalar)
* **Rol:** Barcha rollar
* **Ekran hajmi:** Phone (390px)
* **Muammo:** Sozlamalar sahifasidagi tizimdan chiqish ("Chiqish") tugmasi balandligi telefonda 36px bo'lib, mobil sensorli ekran standartlariga (44px+) to'liq javob bermaydi.
* **Daraja:** **Kichik (minor)**
* **Skrinshot:** `docs/screenshots/15_settings_phone.png`

---

## Xulosa

Jami **24 ta muammo** aniqlandi:
- **3 ta Jiddiy (serious)**
- **21 ta Kichik (minor)**

Ushbu ro'yxat bo'yicha tuzatish ishlarini rejalashtirish va vazifalarni taqsimlash mumkin.
