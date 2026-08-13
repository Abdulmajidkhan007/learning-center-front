# Testlar

## Ishga tushirish

```bash
npm test              # bir marta
npm run test:watch    # kuzatuv rejimi
npm run test:coverage # qamrov hisoboti
```

Stack: **Vitest 4** + **@testing-library/react** + `jsdom`.
Sozlama `vite.config.ts` dagi `test` blokida, umumiy setup —
[`src/test/setup.ts`](../src/test/setup.ts).

## Fayl joylashuvi

Test tekshirayotgan faylning **yonida** turadi:

```
src/shared/lib/format.ts
src/shared/lib/format.test.ts
```

Alohida `__tests__/` papkasi ishlatilmaydi — fayl ko'chirilsa testi ham
birga ko'chsin.

## Nimani test qilamiz

Ustuvorlik tartibi:

1. **Sof funksiyalar** — `format`, `jwt`, forma payload quruvchilari.
   Arzon va tez.
2. **Holat mantiqi** — hooklar (`useAttendanceDraft`) `renderHook` orqali.
3. **Muhim foydalanuvchi oqimlari** — `LoginForm` kabi, Testing Library bilan.

Tailwind klasslari yoki HTML tuzilishi test qilinmaydi — ular tez-tez
o'zgaradi va bunday testlar faqat to'sqinlik qiladi.

## Provider kerak bo'lganda

TanStack Query yoki router ishlatadigan komponentlar uchun:

```tsx
import { renderWithProviders } from '@/test/renderWithProviders'

renderWithProviders(<LoginForm onLoggedIn={vi.fn()} />)
```

U `QueryClientProvider` (retry o'chirilgan) va `MemoryRouter` bilan o'raydi.

## `fetch` ni soxtalashtirish

```ts
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve('{"token":"…"}'),
    json: () => Promise.resolve({ token: '…' }),
}))
```

`text()` shart: `apiFetch` avval matnni o'qiydi (bo'sh tanani ushlash uchun).

Testdan keyin `vi.unstubAllGlobals()` chaqiring.

## Element topish

Rol va matn bo'yicha qidiring, `data-testid` bo'yicha emas:

```ts
screen.getByRole('button', { name: /sign in/i })
screen.getByLabelText(/phone number/i)
screen.findByRole('alert')          // xato xabari uchun
```

Shu sabab `ErrorBox` da `role="alert"`, ikonkali tugmalarda `aria-label` bor —
bu ham skrinriderlar, ham testlar uchun ishlaydi.

## CI

Hozircha CI sozlanmagan. Sozlanganda ishga tushadigan buyruq:

```bash
npm run typecheck && npm run lint && npm test && npm run build
```
