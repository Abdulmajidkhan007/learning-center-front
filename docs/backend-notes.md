# Backend uchun eslatmalar (goodman113 ga)

Frontend `goodman113/learning_center` repo'siga qarab moslashtirildi
(2026-08-13 holati, commit `476284f`). Shu jarayonda topilgan narsalar.

Tartib — **shoshilinchligi bo'yicha**.

---

## 1. 🔴 Kalitlar ochiq repoda yotibdi

**Fayl:** `src/main/resources/application.yaml`

Oddiy matnda saqlangan va GitHub'da ochiq turibdi:

- `aws.s3.access-key` va `aws.s3.secret-key`
- `jwt.access.token.secretKey` va `jwt.refresh.token.secretKey`
- `spring.datasource.password`

**Nega shoshilinch:** bot'lar GitHub'ni doimiy skanerlab, ochiq AWS
kalitlarini daqiqalar ichida topadi. Topilgan kalit bilan sizning
hisobingizda server ishga tushiriladi va to'lov sizga yoziladi. JWT secret
esa undan ham yomon — u bilan istalgan odam o'ziga `SUPER_ADMIN` roli bilan
haqiqiy token yasay oladi va tizimga kira oladi.

**Nima qilish kerak (shu tartibda):**

1. AWS konsolida o'sha IAM kalitini **deactivate → delete**, yangisini yarating.
2. AWS Billing va CloudTrail'ni tekshiring — allaqachon ishlatilgan bo'lishi mumkin.
3. Ikkala JWT secret'ini yangisiga almashtiring (hamma qaytadan kiradi — normal).
4. Baza parolini almashtiring.
5. Hammasini muhit o'zgaruvchisiga chiqaring:

```yaml
aws:
  s3:
    access-key: ${AWS_ACCESS_KEY}
    secret-key: ${AWS_SECRET_KEY}
jwt:
  access:
    token:
      secretKey: ${JWT_ACCESS_SECRET}
  refresh:
    token:
      secretKey: ${JWT_REFRESH_SECRET}
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
```

> Faqat commit'dan o'chirish **yetarli emas** — kalitlar git tarixida qoladi.
> Almashtirish majburiy; tarixni tozalash (`git filter-repo`) esa ixtiyoriy.

---

## 2. 🔴 `/api/v1/user/**` autentifikatsiyasiz ochiq

**Fayl:** `src/main/java/.../config/SecurityConfig.java`

```java
private final String[] WHITE_LIST = new String[]{
        "/api/v1/auth/**",
        "/api/v1/user/**",   // ← shu qator
        ...
```

`UserController` da to'liq CRUD bor: `GET` (barcha foydalanuvchilar),
`GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}`.

Loyihada `@PreAuthorize` **umuman ishlatilmagan** (butun `src/main/java` da
0 ta), ya'ni `@EnableMethodSecurity` hech narsa qilmayapti.

**Natija:** internetdagi istalgan odam token'siz barcha foydalanuvchilar
ro'yxatini olishi, yangi foydalanuvchi yaratishi va istalganini o'chirishi
mumkin.

**Tuzatish:** `WHITE_LIST` dan `/api/v1/user/**` ni olib tashlang. Ro'yxatda
faqat `/api/v1/auth/**` (login/refresh) va swagger qolsin. Keyin rolga
bog'liq joylarga `@PreAuthorize("hasRole('ADMINISTRATOR')")` qo'shilsa
yaxshi bo'lardi.

---

## 3. 🔴 Token muddati: soniya va millisekund aralashib ketgan

**Fayllar:** `config/JwtUtils.java:90`, `application.yaml`

```java
long expiryTimeStamp = System.currentTimeMillis() + (expirySeconds * 1000);
```

Kod qiymatni **soniya** deb qabul qiladi. `application.yaml` da esa
millisekundda yozilgan:

| | Yozilgan | Kod tushunadi | Mo'ljallangan (ehtimol) |
| --- | --- | --- | --- |
| `jwt.access.token.expire.date` | `900000` | **~10 kun** | 15 daqiqa |
| `jwt.refresh.token.expire.date` | `604800000` | **~19 yil** | 7 kun |

Yana: `AuthService.setRefreshCookie` da `.maxAge(refreshTokenExpiration)` —
`ResponseCookie.maxAge` ham **soniya** kutadi, ya'ni cookie ham ~19 yil.

**Nega muhim:** access token qisqa umrli bo'lishining butun ma'nosi shunda —
u sizib chiqsa zarar kichik bo'lsin. 10 kunlik token'ni bekor qilishning
iloji yo'q (stateless JWT).

**Tuzatish:** yaml'da soniyada yozing:

```yaml
jwt:
  access:
    token:
      expire:
        date: 900        # 15 daqiqa
  refresh:
    token:
      expire:
        date: 604800     # 7 kun
```

---

## 4. 🟠 Parol o'zgartirish hech qachon ishlamaydi

**Fayl:** `service/AuthService.java`

```java
if (request.confirmPassword().equals(request.newPassword())) {
    throw RestException.restThrow(ErrorType.PASSWORDS_DO_NOT_MATCH);
}
```

Shart **teskari**: parollar mos kelganda "passwords do not match" xatosi
otiladi. Ya'ni to'g'ri to'ldirilgan forma har doim rad etiladi.

**Tuzatish:** `if (!request.confirmPassword().equals(request.newPassword()))`.

Frontend bu endpoint'ga allaqachon ulangan (Sozlamalar → Parol) va to'g'ri
ma'lumot yuboradi — shart tuzatilishi bilan ishlab ketadi.

---

## 4b. 🟠 `/student/phone` ham himoyalanishi kerak

`GET /student/phone?phone=...` istalgan raqam bo'yicha o'quvchi kartasini
qaytaradi. Frontend undan faqat kirgan foydalanuvchining O'Z raqami bilan
foydalanadi, lekin backendda tekshiruv yo'q — ya'ni bir o'quvchi boshqasining
ma'lumotini so'rasa ham oladi.

2-banddagi `@PreAuthorize` masalasi hal bo'lganda shu endpoint ham
"o'zi yoki xodim" qoidasiga bo'ysunishi kerak.

## 5. 🟢 Kichik so'rov: `GroupNameProjection` ga `dayType`

**Fayl:** `projection/GroupNameProjection.java`

```java
public interface GroupNameProjection {
    String getId();
    String getName();
}
```

`GET /group/groups` (o'qituvchining guruhlari) shu proyeksiyani qaytaradi.
O'qituvchi panelida "toq kunlar / juft kunlar" filtri bor, lekin u
ishlashi uchun har bir guruhning `dayType` i kerak — hozir esa u faqat
`/group/groupInfo` dan, bittalab keladi.

**So'rov:** proyeksiyaga bitta metod qo'shsangiz:

```java
DayType getTimeTableDayType();   // yoki @Value("#{target.timeTable.dayType}")
```

Frontend tomonda hech narsa o'zgartirish kerak emas — `dayType` optional
qilib yozilgan, kelishi bilan filtr o'zi paydo bo'ladi.

---

## 6. 🟢 Railway uchun env o'zgaruvchilari

Railway'ning `DATABASE_URL` i `postgresql://…` ko'rinishida, Spring esa
`jdbc:postgresql://…` kutadi — to'g'ridan-to'g'ri ulasa **ishlamaydi**.
Shunday yozing:

```
SPRING_DATASOURCE_URL       = jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
SPRING_DATASOURCE_USERNAME  = ${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD  = ${{Postgres.PGPASSWORD}}
SERVER_ADDRESS              = ::
SPRING_APPLICATION_FRONTURL = https://<frontend-domeni>
JAVA_TOOL_OPTIONS           = -XX:MaxRAMPercentage=75
```

`SERVER_ADDRESS=::` **shart**: Railway'ning ichki tarmog'i IPv6, Spring esa
sukut bo'yicha faqat IPv4 tinglaydi va frontend proxysi unga yeta olmaydi.

Backendga **ochiq domen bermang** — frontend `/api` ni ichki tarmoq orqali
o'zi uzatadi (frontend repo'sidagi `Caddyfile`). Shunda refresh cookie
same-site bo'lib qoladi va CORS umuman kerak bo'lmaydi.

---

## 7. 🟢 Cookie sozlamasi (proxy o'rnatilgach)

**Fayl:** `service/AuthService.java` → `setRefreshCookie`

Hozir `sameSite("None")`. Frontend proxy orqali ishlaganda hammasi bitta
origin bo'ladi, shuning uchun `Lax` ga o'tkazish mumkin — bu Safari va
Brave'dagi uchinchi tomon cookie bloklashidan butunlay qutqaradi.

---

## Kelajakda kerak bo'ladigan endpoint'lar

Frontendda ekran tayyor, lekin ma'lumot yo'q (hozir "endpoint yo'q" deb
turibdi):

| Ekran | Nima kerak |
| --- | --- |
| O'qituvchi paneli — KPI kartalar | Guruh bo'yicha: faol / yangi / ketgan / xavf ostida / kelmagan / qizil / qora ro'yxat |
| O'qituvchi paneli — uy vazifasi | Dars bo'yicha bajargan va bajarmaganlar soni |
| Admin — guruhga o'quvchi biriktirish | `POST /group/{id}/students` yoki shunga o'xshash |
| **O'quvchi paneli — davomat** | `GET /attendance/student/{studentId}` — hozir `GET /attendance` butun markazning yozuvlarini qaytaradi, ya'ni o'quvchiga uni berish boshqalarning ma'lumotini ochib qo'yish demak |
| **O'quvchi paneli — guruhim** | O'quvchi id si bo'yicha guruhini qaytaradigan endpoint |
| Sozlamalar — markaz sozlamalari | Markaz nomi, logotip, ish vaqti, dam olish kunlari |

Ballar (`82`, `100`) ham reference dizaynda bor edi — hozir backendda
faqat davomat statuslari bor (`PRESENT/ABSENT/LATE/EXCUSED`).

---

## Tasdiqlangan narsalar (frontend shularga moslandi)

- `POST /auth/login` va `/auth/refresh-token` — httpOnly `refresh_token`
  cookie qo'yadi, tanada `{token, expiry}` qaytaradi ✅
- `GET /auth/me`, `POST /auth/change-password` — mavjud, ulandi ✅
- `StudentCreateDto{userCreateDto, parentPhone}`,
  `StudentUpdateDto{user, parentPhone}`, `TeacherCreateDto{user}` ✅
- `/student/count` va `/lesson/count` → `{count: N}`,
  `/group/count` → sof son (ikkalasi ham qo'llab-quvvatlanadi)
- `UserDto.imageUrl` — frontendda `imgUrl` deb yozilgan edi, tuzatildi
- `TimeTableDto.dayType` (ODD/EVEN) — frontendda kunlar ro'yxati deb
  taxmin qilingan edi, tuzatildi
- `LessonDto.lessonNumber` — **String**, frontendda son deb yozilgan edi,
  tuzatildi
