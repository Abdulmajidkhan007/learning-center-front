# Stillar: Tailwind 4 va tema

## Sozlama qayerda

`tailwind.config.js` **yo'q** — Tailwind 4 da sozlama CSS ichida:
[`src/styles/index.css`](../src/styles/index.css).

Vite plagini (`@tailwindcss/vite`) `vite.config.ts` ga ulangan, PostCSS
konfiguratsiyasi kerak emas.

## Ranglar qanday ishlaydi

Uch qavat:

1. `:root` — light rejim qiymatlari (`--surface: #faf6ee`)
2. `.dark` — dark rejim qiymatlari (`--surface: #16171b`)
3. `@theme inline` — CSS o'zgaruvchisini Tailwind utility'siga ulaydi
   (`--color-surface: var(--surface)` → `bg-surface`, `text-surface`, …)

`inline` so'zi muhim: utility qiymatni nusxalab olmaydi, o'zgaruvchiga
**havola** qiladi. Shuning uchun `<html>` ga `dark` klassi qo'shilishi bilan
butun sahifa qayta bo'yaladi — JS ishtirokisiz.

### Yangi rang qo'shish

```css
:root  { --info: #2f6fb0; }
.dark  { --info: #7fb2e0; }

@theme inline {
  --color-info: var(--info);
}
```

Shundan keyin `bg-info`, `text-info`, `border-info` o'zi ishlaydi.

**Komponentda hex kod yozmang.** Agar kerakli semantik rang yo'q bo'lsa,
uni yuqoridagidek qo'shing.

## Dark rejim

`prefers-color-scheme` emas, `<html class="dark">` ishlatiladi — foydalanuvchi
tizim sozlamasidan qat'i nazar temani tanlay olishi kerak.

Boshqaruv: [`src/app/providers/ThemeProvider.tsx`](../src/app/providers/ThemeProvider.tsx).
Tanlov `localStorage` dagi `clc-theme` kalitida. Saqlangan tanlov bo'lmasa
tizim sozlamasi olinadi.

Almashtirgich — `<ThemeToggle />`, har bir ekranning sarlavhasida bor.

### Dark rejimni tekshirish

Har bir yangi ekran uchun:

1. `npm run dev`, tepadagi oy/quyosh tugmasini bosing.
2. Matn fonga singib ketmaganini tekshiring (ayniqsa `text-fg-faint`).
3. To'q fonda to'yingan ranglar "yonib" ketadi — shuning uchun `.dark` da
   ochroq variantlar berilgan (`--accent`, `--success`, `--danger`).

## Nomlash

Semantik nom ishlating, rang nomini emas: `bg-surface-card`, `text-fg-muted`,
`border-border-base`. `bg-yellow-400` kabi qattiq ranglar dark rejimda
buziladi.

| Token guruhi                         | Nima uchun                          |
| ------------------------------------ | ----------------------------------- |
| `surface`, `surface-card`, `surface-muted`, `surface-hover` | fonlar |
| `fg`, `fg-muted`, `fg-faint`, `fg-inverted` | matn         |
| `border-base`, `border-strong`       | chegaralar                          |
| `brand`, `accent`, `success`, `danger`, `warning`, `purple` | urg'u va holat |
| `*-soft`                             | shu rangning och foni (nishon uchun)|
| `*-fg`                               | shu soft fon ustidagi matn rangi    |

## Inline `style` ishlatilmaydi

Ilgari har sahifada 100+ qatorli `const s = { … }` obyekti bor edi. Ular
Tailwind klasslariga ko'chirildi: dark rejim, `:hover`, media so'rovlar va
kod takrorlanishi shu bilan yechildi.
