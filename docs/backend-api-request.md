# Frontenddan backendga: kerakli API'lar

Bu ro'yxat "nima yozamiz?" degan savolga javob. Har bandda **qaysi ekran
kutayotgani**, **taklif qilinayotgan imzo** va **nega aynan shunday** yozilgan.

Xatolar va xavfsizlik masalalari alohida faylda:
[`backend-notes.md`](backend-notes.md).

Ikki qismga bo'lingan:

- **A qism — umumiy ulanish.** Bular ayrim ekranga emas, **butun ilovaga**
  tegishli: bularsiz frontend backendga to'g'ri ulanolmaydi.
- **B qism — ayrim ekranlar.** Ekran tayyor, ma'lumot yo'q.

Ustuvorlik:

| Belgi | Ma'nosi |
| --- | --- |
| **P0** | Busiz frontend ishlay olmaydi yoki noto'g'ri ishlaydi |
| **P1** | Ekran tayyor, faqat ma'lumot yo'q — bo'sh holat ko'rsatib turibmiz |
| **P2** | Keyingi bosqich, hozir shoshilinch emas |

---

# A qism — umumiy ulanish

## P0-0. Parol hayot sikli — ✅ hal qilinmoqda (avtomatik generatsiya)

**Backend javobi: parol avtomatik generatsiya qilinadi.** Muammoni to'g'ri
tushunilgan — quyida faqat frontend uchun qolgan savollar.

Muammoning o'zi shunday edi: butun `service/` papkasida `setPassword`
**bitta joyda** chaqiriladi — `AuthService.changePassword` da.
`UserCreateDto(fullName, phone, birthDate, role)` da parol maydoni yo'q,
`UserService.create` esa mapper'dan kelgan entity'ni shundoq saqlaydi.
`User.password` esa `@Column(nullable = false)` — ya'ni panel orqali
o'quvchi qo'shilganda insert **umuman o'tmaydi** va (xato ushlagichi
bo'lmagani uchun) 500 qaytadi.

Avtomatik generatsiya buni yopadi. Frontend uchun uchta savol qoldi:

**1. Generatsiya qilingan parol qayerga boradi?**

Agar u hech qayerga qaytmasa, muammo o'z holicha qoladi: admin o'quvchiga
aytadigan parolni bilmaydi. Ikki ishlaydigan variant bor:

- **Javobda bir marta qaytariladi** — `POST /student` javobiga
  `temporaryPassword` qo'shiladi. Biz uni modalda ko'rsatamiz: nusxa olish
  tugmasi va "bu parol boshqa ko'rsatilmaydi" ogohlantirishi bilan.
- **SMS orqali yuboriladi** — biz shunchaki "parol SMS orqali yuborildi"
  deb yozamiz. SMS integratsiyasi bormi?

Qaysi biri bo'lsa ayting — forma shunga qarab yasaladi.

**2. Parol qanday generatsiya qilinadi?**

Telefon raqami, tug'ilgan sana yoki `12345678` kabi qat'iy qiymat
bo'lmasin — bularning barchasi taxmin qilinadi va bitta odam boshqasining
hisobiga kiradi. Kamida 10-12 belgi, tasodifiy (`SecureRandom`).

**3. Birinchi kirishda parolni almashtirish majburiymi?**

Agar ha bo'lsa, `/auth/me` javobiga yoki token claim'iga
`mustChangePassword: true` qo'shing — biz o'sha foydalanuvchini boshqa
ekranga qo'ymay, to'g'ridan-to'g'ri parol almashtirish formasiga
yo'naltiramiz.

**Yana kerak:** administrator uchun parolni tiklash (eski parolsiz) —
o'quvchi parolini unutsa, hozir hech qanday yo'l yo'q, chunki
`/auth/change-password` eski parolni talab qiladi.

```java
@PostMapping("/user/{id}/reset-password")
@PreAuthorize("hasRole('ADMINISTRATOR')")
public ResponseEntity<TemporaryPasswordDto> resetPassword(@PathVariable String id) { … }
```

## P0-0b. Birinchi administrator — ✅ hal qilinmoqda (organization bilan birga)

**Backend javobi: super-admin organization bilan birga yaratiladi.**

Frontend uchun qolgan savollar:

**1. Birinchi organization o'zi qanday yaratiladi?**

- Ochiq endpoint orqalimi (`POST /organization` — ro'yxatdan o'tish)? Unda
  bizga **ro'yxatdan o'tish ekrani** kerak: markaz nomi, telefon, email +
  super-admin ma'lumotlari. Ayting — yasaymiz.
- Yoki qo'lda / migratsiya orqalimi? Unda ekran kerak emas.

Agar ochiq bo'lsa, u whitelist'ga qo'shilishi va **rate limit** qo'yilishi
kerak — aks holda istalgan kishi cheksiz organization yaratadi.

**2. Super-admin nimani boshqaradi?** Bitta organization ichidagi
filiallarnimi, yoki barcha organization'larnimi? Super-admin paneli shunga
qarab boshqacha bo'ladi.

⚠️ Hozirgi `DataInitializer` dagi parol **kodda ochiq yozilgan** va admin
telefoni `"1"`. Uni productionda yoqmang — faqat `@Profile("dev")` ostida,
parol esa env'dan.

## P0-0c. 🔴 Organization qo'shilsa — ma'lumot ajratilishi SHART

Bu eng muhim band, chunki uni keyin tuzatish qimmatga tushadi.

Model tayyor: `User → Branch → Organization`. Yozishda ham ishlatilyapti —
`GroupService:83` guruhni `currentUser.getBranch()` bilan yaratadi.

**Lekin o'qishda hech qayerda filtr yo'q.** Tekshirdim:

```java
// GroupRepository
@Query(value = "select count(id) from groups where deleted=false", nativeQuery = true)
Optional<Integer> getCount();
```

Guruhlar ro'yxati, o'quvchilar, o'qituvchilar, darslar, to'lovlar — hech
qaysi so'rovda `branch` yoki `organization` sharti yo'q. Hozir bu bilinmaydi,
chunki tizimda bitta markaz bor.

Organization qo'shilishi bilan ahvol shunday bo'ladi: **"A" markaz
administratori "B" markazning o'quvchilarini, telefon raqamlarini va
to'lovlarini ko'radi.** Bitta `GET /student` yetadi.

Buni frontend hal qila olmaydi va qilmasligi ham kerak: mijoz tomonda
filtrlash — ma'lumot allaqachon brauzerga yuborilgani degani.

**Kerak:** har bir ro'yxat so'rovi kirgan foydalanuvchining branch'i
(super-admin uchun — organization'i) bo'yicha filtrlansin. Eng ishonchli
yo'l — Hibernate filtri yoki har so'rovga majburiy shart:

```java
where g.deleted = false and g.branch.id = :branchId
```

`getCount()` kabi native so'rovlar ham unutilmasin — ular filtrdan
o'tmaydi.

Frontend tomondan savol: **`branchId` ni biz yuboramizmi yoki backend
tokendan oladimi?** Tavsiyamiz — **backend tokendan olsin**. Mijoz
yuborsa, uni o'zgartirib boshqa markazning ma'lumotini so'rash mumkin
bo'ladi.

Agar super-admin bir nechta filialni ko'ra olishi kerak bo'lsa, o'shanda
`?branchId=` **ixtiyoriy** parametr bo'lsin va faqat super-admin uchun
ishlasin.

## P0-1. Xatolar uchun yagona javob shakli

Hozir loyihada **bitta ham `@ExceptionHandler` yo'q** (`@RestControllerAdvice`
ham). `RestException` — oddiy `RuntimeException`, uni hech kim ushlamaydi.

Natija: `ErrorType` dagi `HttpStatus` **umuman ishlatilmaydi**. Noto'g'ri parol
ham, topilmagan guruh ham, haqiqiy dastur xatosi ham — hammasi bir xil
**500** bo'lib qaytadi, ichida esa Spring'ning umumiy matni.

Frontend uchun bu eng og'riqli nuqta: foydalanuvchiga "parol xato" deb
aytolmaymiz, chunki uni "server yiqildi" dan ajrata olmaymiz.

**Kerak:**

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RestException.class)
    public ResponseEntity<ApiErrorDto> handle(RestException ex) {
        return ResponseEntity.status(ex.getStatus())
                .body(new ApiErrorDto(ex.getErrorType().name(), messageFor(ex.getErrorType())));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDto> handleValidation(MethodArgumentNotValidException ex) { … }
}

public record ApiErrorDto(String code, String message) {}
```

Ikkita maydonning ikkalasi ham kerak:

- **`code`** — `INVALID_PHONE_NUMBER_OR_PASSWORD` kabi barqaror kalit.
  Frontend shunga qarab qaror qiladi va o'zi **uch tilda** matn ko'rsatadi.
- **`message`** — odam o'qiy oladigan zaxira matn (log va debug uchun).

Muhim: matnni tarjima qilishga urinmang. Til tanlovi mijozda, biz
`code` ni o'zimizning `uz/ru/en` lug'atimizga bog'laymiz.

Validatsiya xatolarida qaysi maydon xato ekani ham kerak — forma o'sha
maydonni qizil qilib ko'rsatadi:

```java
public record ApiErrorDto(String code, String message, Map<String, String> fields) {}
```

---

## P0-2. `@PreAuthorize` — hozir kirgan har kim hamma narsani qila oladi

Butun `src/main/java` da `@PreAuthorize` **0 ta**, `@EnableMethodSecurity`
esa yoqilgan. `/api/v1/user/**` whitelist'dan chiqarilgani yaxshi, lekin
token olgan **o'quvchi** ham hozir `DELETE /user/{id}` yoki
`GET /student` (hamma telefonlar bilan) chaqira oladi.

Frontendda biz panellarni rol bo'yicha yashiramiz, lekin bu **bezak** —
JWT ni qo'lga olgan odam to'g'ridan-to'g'ri API ga boradi. Rol tekshiruvi
backendda bo'lishi shart.

Minimal qamrov: `POST`/`PUT`/`DELETE` — administratorga; ro'yxatlar —
xodimlarga; o'quvchi faqat o'zinikini.

Biz rol bo'yicha UI cheklovlarini shu ish tugagach kiritamiz — hozir
kiritsak, "yashirdik, lekin himoya qilmadik" degan yolg'on xavfsizlik
paydo bo'ladi.

---

## P0-3. `LessonDto` dars nomini qaytarmaydi

Batafsil: `backend-notes.md`, 8-band. Qisqasi — `LessonMapper` da
`lessonName` va `isCompleted` uchun mos maydon yo'q, shuning uchun admin
paneldagi "Darslar" jadvalida ikki ustun **doim bo'sh**.

```java
public record LessonDto(String id, String lessonName, LocalDateTime lessonDate,
                        Boolean isComplete, GroupDto group, TeacherDto teacherDto) {}
```

```java
@Mapping(source = "createdAt", target = "lessonDate")
@Mapping(source = "isCompleted", target = "isComplete")
LessonDto toDto(Lesson lesson);
```

---

## P0-4. `EnrollmentDto` da `id` yo'q — guruhdan chiqarib bo'lmaydi

`DELETE /enrollments/{id}` bor, lekin `EnrollmentDto{studentId, groupId, reason}`
enrollment id sini qaytarmaydi. Frontend o'chirish uchun id ni bilmaydi,
shuning uchun tugma umuman qo'yilmagan.

```java
public record EnrollmentDto(String id, String studentId, String studentFullName,
                            String groupId, String reason) {}
```

`studentFullName` ham qo'shilsa, guruh ro'yxatini ko'rsatish uchun har safar
o'quvchilar ro'yxatini alohida yuklab solishtirishga hojat qolmaydi.

Yana: `DELETE /enrollments/{id}` da `reason` **majburiy** `@RequestParam`.
Uni ixtiyoriy qilsangiz yaxshi — sabab har doim ham bo'lavermaydi.

---

## P0-5. Davomatda "sabab" matni uchun joy yo'q

Interfeys kelishilganidek o'zgardi: bosiladigan kvadrat (yashil = keldi,
bosilsa qizil = kelmadi), burchakdagi tugma esa sabab yozish oynasini
ochadi va statusni `EXCUSED` qiladi.

`AttendanceStudentCreateDto` faqat `studentId` va `status` ni oladi —
sababni yuboradigan joy yo'q. Hozir frontend uni yig'adi, yubormaydi va
foydalanuvchiga "izoh serverda saqlanmaydi" deb ochiq yozib qo'yadi.

```java
public record AttendanceStudentCreateDto(@NotBlank String studentId,
                                         @NotNull AttendanceStatus status,
                                         String reason) {}
```

`AttendanceStudentDto` ga ham qo'shilsin — aks holda eski davomatni ochganda
sabab ko'rinmaydi.

---

## P1-0. Javob shakllari bir xil bo'lsin

Bir xil ma'noli endpoint'lar har xil javob qaytaradi — frontendda har biriga
alohida moslashuv yozishga to'g'ri kelyapti.

**`/count` ikki xil:**

| Endpoint | Javob |
| --- | --- |
| `GET /group/count` | `5` (sof son) |
| `GET /attendance/count` | `5` (sof son) |
| `GET /student/count` | `{"count": 5}` |
| `GET /teacher/count` | `{"count": 5}` |
| `GET /lesson/count` | `{"count": 5}` |

Hozir `shared/api` da ikkalasini ham qabul qiladigan moslashuv bor. Bittasini
tanlang — `{"count": N}` yaxshiroq, chunki keyin maydon qo'shsa bo'ladi.

**Sahifalash parametrlari ham har xil:** `GroupController` `@RequestParam page,
size` oladi, qolganlari `Pageable`. Ikkalasi ham `?page=&size=` bilan
ishlagani uchun hozircha muammo yo'q, lekin bittasiga keltirsangiz yaxshi.

**Muhimrog'i — barqaror tartib yo'q.** Hech qaysi ro'yxatda sukut bo'yicha
`Sort` berilmagan. PostgreSQL `ORDER BY` siz qatorlar tartibini
kafolatlamaydi, ya'ni 1-sahifadagi yozuv 2-sahifada yana chiqishi yoki
umuman tushib qolishi mumkin — jadval "sakraydi".

```java
Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
```

## P1-0b. Refresh cookie'dagi `secure(true)` lokalda va telefonda buzadi

```java
ResponseCookie.from("refresh_token", tokenValue)
        .httpOnly(true).secure(true).path("/").sameSite("Lax")
```

`httpOnly`, `path`, `SameSite=Lax` — hammasi to'g'ri, rahmat. Faqat
`secure(true)` doimiy yoqilgan: brauzer bunday cookie'ni **faqat HTTPS**
da saqlaydi.

- `http://localhost` — Chrome va Firefox istisno qiladi, ishlaydi;
- `http://192.168.x.x:5173` (telefonda yoki boshqa kompyuterda sinash) —
  **cookie umuman saqlanmaydi**. Login o'tadi, sahifa yangilansa
  foydalanuvchi chiqib ketadi. Sababi ko'rinmaydi, chunki xato ham bermaydi.

```java
.secure(cookieSecure)   // ${COOKIE_SECURE:false}, productionda true
```

## P1-0c. Deploy sozlamalari (Railway)

`application.yaml` da `server` bloki umuman yo'q. Railway'da ikkitasi shart:

```yaml
server:
  port: ${PORT:8080}       # Railway PORT ni o'zi beradi
  address: ${SERVER_ADDRESS:0.0.0.0}
```

`SERVER_ADDRESS=::` qilib qo'ying: Railway'ning ichki tarmog'i **IPv6**,
Spring esa sukut bo'yicha faqat IPv4 tinglaydi. Busiz frontend xizmati
`backend.railway.internal` ga **umuman yeta olmaydi** — biz `/api` ni
o'sha manzilga uzatamiz.

Yana `spring-boot-starter-actuator` qo'shilsa, Railway healthcheck uchun
`/actuator/health` bo'ladi (`management.endpoints.web.exposure.include=health`).

Va `frontUrl` env'ga chiqsin — hozir `http://localhost:5173` qattiq yozilgan:

```yaml
frontUrl: ${FRONT_URL:http://localhost:5173}
```

---

# B qism — ayrim ekranlar

## P1-1. O'quvchi paneli — uchta endpoint

Ekranlar tayyor, uchalasi ham hozir bo'sh holat ko'rsatib turibdi.
Uchalasida ham `@CurrentUser` ishlatilsa bo'ladi — `AuthController` da
allaqachon shunday qilingan.

### `GET /api/v1/student/me`

```java
@GetMapping("/me")
public ResponseEntity<StudentDto> me(@CurrentUser User user) { … }
```

Hozir frontend `GET /student/phone?phone=…` dan foydalanyapti. Bu ikki
tomondan yomon: birinchidan, o'z raqamini bilish shart bo'ladi;
ikkinchidan, o'sha endpoint **himoyalanmagan** va istalgan raqam bo'yicha
kartani qaytaradi.

### `GET /api/v1/attendance/me` (yoki `/attendance/student/{studentId}`)

```java
@GetMapping("/me")
public ResponseEntity<List<AttendanceStudentDto>> myAttendance(
        @CurrentUser User user,
        @RequestParam(required = false) LocalDate from,
        @RequestParam(required = false) LocalDate to) { … }
```

Hozirgi `GET /attendance` **butun markaz** davomatini qaytaradi — uni
o'quvchiga berib bo'lmaydi. Mijoz tomonda filtrlash ham yaramaydi: bu
barcha o'quvchilarning ma'lumotini o'quvchining brauzeriga yuklash degani.

Javobda dars sanasi, guruh nomi va status bo'lsa yetadi.

### `GET /api/v1/group/my`

```java
@GetMapping("/my")
public ResponseEntity<List<GroupDto>> myGroups(@CurrentUser User user) { … }
```

O'quvchi o'z guruhining nomi, o'qituvchisi va jadvalini ko'rishi kerak.
Hozir `GET /group/groupInfo?groupId=` bor, lekin o'quvchi o'z guruhining
id sini qayerdandir topishi kerak — u yo'q.

> **Eslatma:** `/group/groups` nomi chalg'ituvchi. U kirgan
> foydalanuvchining guruhlarini qaytaradi (`authenticateAndGetId()`), ya'ni
> administrator uni chaqirsa **bo'sh ro'yxat** keladi. Shuning uchun admin
> panelida sahifalangan `/group` dan foydalanyapmiz. Nomini
> `/group/my-groups` qilsangiz, chalkashlik kamayadi.

---

## P2-1. O'qituvchi paneli — KPI kartalar

Reference dizaynda guruh tepasida kartalar bor, hozir ular `PendingBackend`
bilan bo'sh turibdi. Bitta endpoint yetadi:

```java
@GetMapping("/group/{groupId}/stats")
public ResponseEntity<GroupStatsDto> stats(@PathVariable String groupId) { … }

public record GroupStatsDto(int active, int newThisMonth, int left,
                            int atRisk, int absentToday) {}
```

"Xavf ostida" ni qanday hisoblashni o'zingiz hal qiling (masalan: oxirgi
N darsdan M tasida yo'q). Formulani ayting — biz uni tooltip'da tushuntiramiz.

## P2-2. Uy vazifasi

Kelishilganidek deploy'dan keyinga qoldirildi. Boshlaganda kerak bo'ladi:
dars bo'yicha vazifa, kim topshirgani va bahosi.

## P2-3. Markaz sozlamalari va super-admin (`Branch`)

`BranchController` **yo'q**, `BranchDto`/`BranchCreateDto`/`BranchUpdateDto`
esa uchalasi ham **bo'sh record** (`public record BranchDto() {}`), holbuki
`Branch` entity'sida maydonlar bor: `organization`, `name`, `address`,
`email`, `phone`, `chargeForMonth`, `googlePlaceId`, `latitude`, `longitude`.

Shu sababdan super-admin paneli placeholder bo'lib qolyapti va
Sozlamalardagi "markaz" bloki o'chirilgan.

Kerak: DTO'lar to'ldirilgan holda + oddiy CRUD
(`GET/POST/PUT/DELETE /api/v1/branch`). Shundan keyin super-admin paneli
boshqa tablar bilan bir xil generik jadvalga tushadi.

> Super-admin organization bilan birga yaratiladigan bo'lgani uchun bu band
> endi P2 emas: super-admin kirgach ko'radigan birinchi ekran — aynan
> filiallar ro'yxati. `BranchService` va `BranchRepository` allaqachon bor,
> faqat DTO'lar bo'sh va controller yo'q.

---

## Bularni so'ramaymiz — allaqachon bor, ulash BIZDA

Skanerlash paytida ma'lum bo'ldiki, quyidagilar backendda tayyor, faqat
frontend ulamagan. Bular bizning ro'yxatimizda:

| Endpoint | Qaysi ekran |
| --- | --- |
| `POST /auth/change-password` | Sozlamalar — parolni o'zgartirish |
| `PUT /user/{id}` (`UserUpdateDto`) | Sozlamalar — profil |
| `GET/POST/PUT/DELETE /invoice` | **To'lovlar bo'limi** — hali umuman yo'q |
| `POST /image/upload`, `PUT /image/main/{id}` | Avatar yuklash |

To'lovlar (`Invoice`) to'liq CRUD bo'lib turibdi — sana oralig'i va status
bo'yicha filtr ham bor. Buni yaqin kunda ulaymiz.

Avatar bo'yicha bitta savol: `POST /image/upload` rasmni saqlaydi, lekin
uni **foydalanuvchiga bog'laydigan** yo'l ko'rinmadi. `PUT /image/main/{id}`
nima qilishini ayting yoki `PUT /user/{id}/avatar` qo'shing.
