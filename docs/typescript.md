# TypeScript in this project

How the types are organised, why they're shaped the way they are, and what to
do when you add a page or an endpoint.

## Compiler setup

Three config files, the standard Vite split:

| File                 | Covers          | Why separate                                                |
| -------------------- | --------------- | ----------------------------------------------------------- |
| `tsconfig.json`      | nothing         | Just references the other two, so `tsc -b` builds both       |
| `tsconfig.app.json`  | `src/`          | Browser libs (`DOM`), `jsx: react-jsx`                       |
| `tsconfig.node.json` | `vite.config.ts`| Node-side config file, no DOM types                          |

Both are `strict`, `noEmit`, and use `moduleResolution: bundler` because Vite —
not `tsc` — does the actual transpiling. `isolatedModules` +
`verbatimModuleSyntax` are on, which is why type-only imports must be written
as `import type { … }` or `import { type X } from …`: Vite compiles each file
alone and can't tell a type import from a value import otherwise.

Type checking is a separate step from linting:

```bash
npm run typecheck   # tsc -b
npm run build       # tsc -b && vite build — build fails on type errors
```

ESLint runs `typescript-eslint`'s non-type-aware preset. Type-aware rules would
need `projectService` and make linting several times slower for rules that
mostly duplicate what `tsc` already reports.

## Where types live

**All backend shapes go in `src/types.ts`.** Not beside the component that
fetches them, not inline in a `useState` generic. There is exactly one
`StudentDto` in this codebase and pages import it.

Almost every field is optional. That isn't laziness — the shapes were
reverse-engineered from the fetch calls (see the `ASSUMPTION` comments in
`AdminDashboard.tsx` and `TeacherDashboard.tsx`), and the real Java DTOs have
never been confirmed. The UI already guards with `?.` and `|| '—'` everywhere;
the types say the same thing instead of promising a field that may not arrive.

**When the real DTOs get confirmed, tighten `src/types.ts` and nothing else.**
Making a field required there will surface every page that assumed otherwise,
which is exactly the point.

Two shapes deliberately stay loose:

- `JwtClaims['role']` is `string`, not a union. A new role added on the backend
  must not break the build; it falls through to the `default` branch in
  `App.tsx` and shows the placeholder screen.
- `AdminRow` (in `AdminDashboard.tsx`) is the union of the four entity DTOs
  plus an index signature, because that page renders Students, Teachers,
  Groups, and Lessons through one generic table and one generic form.

## Patterns

### `authFetch<T>` returns `T | null`

Each page has its own copy of `authFetch` (unchanged from the JS version —
deduplicating them is a separate refactor). The signature is:

```ts
async function authFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T | null>
```

`null` is a real outcome, not a defensive placeholder: some endpoints answer
`200` with a completely empty body, which `res.json()` throws on. Call sites
must handle it — `data?.content || []`, not `data.content`.

Pass the expected shape at the call site:

```ts
const data = await authFetch<Page<AdminRow>>(`${endpoint}?${params}`, session.token)
const list = await authFetch<GroupDto[]>(`${GROUP_ENDPOINT}/groups`, session.token)
```

### Errors in `catch`

TypeScript types `catch` bindings as `unknown`, so `err.message` doesn't
compile. The project-wide form is:

```ts
catch (err) {
    setError(err instanceof Error ? err.message : String(err))
}
```

### Style objects use `satisfies`, never a type annotation

```ts
const s = {
    page: { minHeight: '100vh', display: 'grid' },
    badgePRESENT: { background: color.forestSoft },
} satisfies Record<string, CSSProperties>
```

`satisfies` checks each entry against `CSSProperties` *and* keeps the keys
literal. Two things depend on that:

- `s.pag` is a compile error rather than `undefined` at runtime.
- `AttendancePage` looks styles up dynamically — <code>s[\`badge${status}\`]</code> —
  and that only type-checks because `status` is `AttendanceStatus` and every
  `badge*` key exists.

Writing `const s: Record<string, CSSProperties> = { … }` instead would silently
throw both away.

### Statuses come from one source

```ts
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]
```

The array drives the `<select>` options and the type drives the state map, so
adding a status is a one-line change that the compiler propagates.

## Adding a page

1. Add the DTO to `src/types.ts` with optional fields, plus a one-line comment
   naming the endpoint it comes from.
2. Type props with an explicit `interface XProps`, not inline.
3. Type the state, not the setter: `useState<GroupDto | null>(null)`.
4. Run `npm run typecheck` — `npm run lint` will not catch type errors.
