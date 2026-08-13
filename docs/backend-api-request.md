# Frontenddan backendga: kerakli API'lar

Bu ro'yxat "nima yozamiz?" degan savolga javob. Har bandda **qaysi ekran
kutayotgani**, **taklif qilinayotgan imzo** va **nega aynan shunday** yozilgan.

Xatolar va xavfsizlik masalalari alohida faylda:
[`backend-notes.md`](backend-notes.md).

Ustuvorlik:

| Belgi | Ma'nosi |
| --- | --- |
| **P0** | Busiz frontend ishlay olmaydi yoki noto'g'ri ishlaydi |
| **P1** | Ekran tayyor, faqat ma'lumot yo'q — bo'sh holat ko'rsatib turibmiz |
| **P2** | Keyingi bosqich, hozir shoshilinch emas |

---

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
