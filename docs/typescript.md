# TypeScript

## Sozlama

Uchta konfiguratsiya fayli (Vite'ning standart bo'linishi):

| Fayl                 | Nimani qamraydi  | Nega alohida                          |
| -------------------- | ---------------- | ------------------------------------- |
| `tsconfig.json`      | hech nima        | Faqat qolgan ikkitasiga havola        |
| `tsconfig.app.json`  | `src/`           | Brauzer tiplari (`DOM`), `jsx: react-jsx` |
| `tsconfig.node.json` | `vite.config.ts` | Node muhiti, `types: ["node"]`        |

Ikkalasi ham `strict` va `noEmit` — transpilyatsiyani Vite qiladi, `tsc`
faqat tekshiradi.

`isolatedModules` + `verbatimModuleSyntax` yoqilgan: Vite har faylni alohida
kompilyatsiya qiladi va tip-import qayerda ekanini bilmaydi. Shuning uchun
tiplar **doim** `import type { … }` bilan keltiriladi.

```bash
npm run typecheck   # tsc -b
npm run build       # tsc -b && vite build — tip xatosi build'ni to'xtatadi
```

ESLint tipga bog'liq bo'lmagan (tez) presetda ishlaydi: type-aware qoidalar
`projectService` talab qiladi va lintni bir necha barobar sekinlashtiradi,
tiplarni esa `tsc` allaqachon tekshiryapti.

### TypeScript 7

TS 7 chiqqan va `tsc` bilan ishlaydi, lekin `typescript-eslint` uni hali
qo'llab-quvvatlamaydi (lint umuman ishga tushmaydi). Shu sabab loyiha
TS 6 da qoldi. `typescript-eslint` TS 7 ni qo'llagach o'tish mumkin.

## `@/` aliasi

```ts
import { Button } from '@/shared/ui'
```

`../../../` yozilmaydi. Alias ikki joyda e'lon qilingan va ular mos
bo'lishi shart: `vite.config.ts` (`resolve.alias`) va `tsconfig.app.json`
(`paths`).

## Tiplar qayerda

**Backend DTO'lari — `src/shared/types/`.** Bitta `StudentDto` bor, hamma
shuni import qiladi.

Shakllar backend repo'sidagi haqiqiy Java record'laridan olingan
(dastlab `goodman113/learning_center`, 2026-08-13; joriy manba —
`nurulloh-coder-dev/learning-center@N`). Ilgari ular `fetch` chaqiruvlaridan
taxmin qilingan edi; farq chiqqan uchta joy tuzatildi:

| Frontend taxmin qilgan | Haqiqatda |
| --- | --- |
| `UserDto.imgUrl` | `UserDto.imageUrl` |
| `TimeTableDto.days: WeekDay[]` | `TimeTableDto.dayType: 'ODD' \| 'EVEN'` |
| `LessonDto.lessonNumber: number` | `lessonNumber: string` |

Maydonlar baribir optional: Java record'i `null` qaytarmasligini
kafolatlamaydi.

**Shakl o'zgarsa — faqat shu papka o'zgaradi**, qaysi sahifa noto'g'ri
taxmin qilgan bo'lsa kompilyator o'zi ko'rsatadi.

Bo'limga xos tiplar (masalan `AdminRow`) o'sha bo'lim ichida
(`features/admin/types.ts`).

## Ataylab bo'sh qoldirilgan joylar

- `JwtClaims['role']` — union emas, oddiy `string`. Backend yangi rol qo'shsa
  build yiqilmasligi, foydalanuvchi tushunarli xabar ko'rishi kerak.
- `AdminRow` — to'rtta DTO maydonlarining birlashmasi + indeks imzosi, chunki
  admin jadvali to'rt xil entity'ni bitta generik jadvalda ko'rsatadi.

## Naqshlar

### `apiFetch<T>` `T | null` qaytaradi

`null` — haqiqiy holat: ba'zi endpoint'lar `200` qaytarib, tanani bo'sh
qoldiradi (`res.json()` bunda xato beradi). Shuning uchun:

```ts
const data = await apiFetch<Page<AdminRow>>('/student', { token, params })
const rows = data?.content ?? []     // `data.content` emas
```

### `catch` dagi xato — `unknown`

```ts
catch (err) {
    setError(errorMessage(err))     // shared/api dagi yordamchi
}
```

### `as const` bilan ro'yxat va tip

```ts
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]
```

Massiv `<select>` variantlarini beradi, tip esa state'ni himoya qiladi —
yangi status qo'shish bir qatorlik o'zgarish bo'ladi va kompilyator uni
kerakli joylarga tarqatadi (masalan `STATUS_TONE` xaritasi).

## Yangi kod yozganda

1. Props uchun ochiq `interface XProps`, inline emas.
2. State tipini bering: `useState<GroupDto | null>(null)`.
3. `any` ishlatilmaydi. Noma'lum shakl uchun `unknown` + chegarada tor cast.
4. `npm run typecheck` ni ishga tushiring — `npm run lint` tip xatosini
   ko'rmaydi.
