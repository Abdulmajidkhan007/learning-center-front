# Mobil ko'rinish tekshiruvi

`src/features` va `src/shared/ui` bo'yicha kichik ekranda muammo beradigan
joylar ro'yxati. Faqat ro'yxat — hech biri hali tuzatilmagan.

## 1. `overflow-x-auto` o'ramisiz jadvallar

Topilmadi. `src/shared/ui/DataTable.tsx` va `src/shared/ui/AttendanceTable.tsx:64`
jadvallari allaqachon `overflow-x-auto` bilan o'ralgan, feature darajasidagi
jadvallar (`EntityTable`, `SimpleTable`, `InvoiceTable`, `GroupLevelTable`)
o'sha umumiy o'ramdan foydalanadi.

## 2. Qattiq piksel kengliklar (`w-[...]`, `min-w-[...]`)

- `src/features/leads/pages/LeadsPage.tsx:113` — `min-w-[1040px]` Kanban
  panjarasida, kichik ekranda ustunlar torayolmaydi — Lidlar sahifasi
  (Kanban doskasi)

## 3. `sm:`/`md:`/`lg:` variantsiz ko'p ustunli grid/flex

- `src/features/leads/pages/LeadsPage.tsx:113` — `grid-cols-4` breakpoint
  variantisiz, telefon kengligida ham 4 ustun bo'lib chiqadi — Lidlar
  sahifasi (Kanban doskasi)

## 4. Balandligi cheklanmagan modal oynalar

Topilmadi. Umumiy `src/shared/ui/Modal.tsx:38` `max-h-[85vh] overflow-y-auto`
qo'llaydi, barcha feature modallari (`StartLessonModal`, `BranchFormModal`,
`GroupLevelFormModal`, `LeadFormModal`, `StudentDetailModal`,
`OrganizationFormModal`, `NewInvoiceModal`, `AssignStudentsModal`,
`EntityFormModal`) shu komponent ustiga qurilgan.

## 5. Barmoq uchun kichik tugmalar (44px dan kichik)

- `src/shared/ui/buttonClasses.ts:25` — `Button` `size="sm"`: `min-h-9`
  (36px) — Admin, To'lovlar, Lidlar, Darajalar, Davomat, Pagination va h.k.
  ko'p sahifadagi asboblar qatori/amal tugmalari
- `src/shared/ui/IconButton.tsx:18` — `size-9` (36px) ikonkali tugma —
  Admin, Darajalar, To'lovlar, Super-admin jadvallaridagi orqaga/tahrirlash/
  o'chirish/biriktirish amallari
- `src/shared/ui/AttendanceCell.tsx:50` — `size-9` (36px) davomat holatini
  almashtiruvchi asosiy tugma — Davomat belgilash sahifasi
- `src/shared/ui/AttendanceCell.tsx:64` — `size-4` (16px) burchakdagi sabab
  tugmasi — Davomat sahifasi
- `src/shared/ui/SegmentedControl.tsx:44` — `px-3 py-1.5 text-xs`
  (~30px balandlik) segment tugmalari — O'qituvchi paneli, Davomat, O'quvchi
  paneli, Kirish sahifasidagi oy/kun/tema/til filtrlari
- `src/features/teacher/components/GroupTabs.tsx:40` — `px-4 py-2`
  (~34px balandlik) guruh-tab tugmalari — O'qituvchi paneli
- `src/features/admin/components/AdminSidebar.tsx:97` — `px-3.5 py-1.5
  text-xs` (~30px balandlik) mobil bo'lim-tab tugmalari (`lg:hidden` tasma)
  — Admin dashboard, mobil ko'rinish

## 6. Bir xil breakpoint'da qarama-qarshi klasslar

- `src/features/admin/pages/AdminDashboardPage.tsx:153` — `<Select
  className="w-auto">` bazaviy `inputClasses` dagi breakpoint'siz `w-full`
  (`src/shared/ui/inputClasses.ts:10`) bilan to'qnashadi, qaysi biri
  yutishi CSS tartibiga qolib ketadi — Admin dashboard (guruhlar tabidagi
  status filtri)

---

Jami: 1-toifa — 0, 2-toifa — 1, 3-toifa — 1, 4-toifa — 0, 5-toifa — 7,
6-toifa — 1.
