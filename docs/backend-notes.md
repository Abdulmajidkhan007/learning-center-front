# Backend uchun eslatmalar (goodman113 ga)

Frontend `goodman113/learning_center` bilan solishtirib tekshiriladi.
Oxirgi tekshiruv: commit `6eacde9`, Spring Boot **4.1.0**.

## Tuzatilganlar ✅

Birinchi ro'yxatdagi narsalar bajarilgani kodda tekshirildi:

| Nima | Holati |
| --- | --- |
| Kalitlar `application.yaml` dan env'ga chiqarildi | ✅ `${DB-URL}`, `${AWS-ACCESS-KEY}`, `${JWT-*-SECRET-KEY}` |
| `/api/v1/user/**` whitelist'dan olib tashlandi | ✅ |
| Token muddati soniyaga keltirildi | ✅ `900` va `604800` |
| Parol o'zgartirishdagi teskari shart | ✅ `!equals(...)` |
| `GroupNameProjection` ga `dayType` | ✅ frontendda filtr o'zi ishlab ketadi |
| Cookie `SameSite=Lax` | ✅ |

> **Eslatma:** kalitlar env'ga chiqarilgani — ularni almashtirish o'rnini
> bosmaydi. Eski AWS va JWT kalitlari git tarixida qolgan va ochiq repoda
> turibdi. Ular hali almashtirilmagan bo'lsa, almashtiring.

---

## Qolgan va yangi topilganlar

### 1. 🔴 Hech qayerda `@PreAuthorize` yo'q — endi eng katta teshik

Butun `src/main/java` da `@PreAuthorize` **0 ta**. `@EnableMethodSecurity`
yoqilgan, lekin unga hech narsa berilmagan.

`/api/v1/user/**` whitelist'dan chiqqani yaxshi, lekin endi qoida shunday:
**kirgan istalgan odam — hamma narsani qila oladi.** Ya'ni o'quvchi rolidagi
foydalanuvchi ham:

- `DELETE /api/v1/user/{id}` — istalgan foydalanuvchini o'chira oladi
- `POST /api/v1/teacher` — o'ziga o'qituvchi yarata oladi
- `GET /api/v1/student` — barcha o'quvchilar ro'yxatini, telefonlari bilan
- `DELETE /api/v1/group/{id}` — guruhni o'chira oladi

Token olish oson: bitta o'quvchi hisobi yetarli.

**Tuzatish** — kamida admin amallariga:

```java
@PreAuthorize("hasRole('ADMINISTRATOR')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable String id) { … }
```

Rollar `Role` enum'ida bor. `hasRole('X')` Spring'da `ROLE_X` authority'sini
kutadi — `CustomUserDetails` da authority qanday yasalayotganini tekshiring,
mos kelmasa `hasAuthority('ADMINISTRATOR')` ishlating.

Minimal qamrov: `POST`, `PUT`, `DELETE` — administratorga; `GET` ro'yxatlar —
xodimlarga; o'quvchi faqat o'zinikini.

### 2. 🟠 `/swagger**` naqshi Spring Boot 4 da ishlamaydi

```java
"/swagger**"
```

Spring Boot 4 (Spring Security 7) `requestMatchers(String…)` uchun
**PathPattern** ishlatadi, eski `AntPathMatcher` ni emas. PathPattern'da
`**` **butun segment** bo'lishi va oxirida turishi kerak.

Ya'ni `/swagger**` bitta segmentli yo'llarga tegishli bo'ladi (`/swagger-ui.html`
kabi), lekin `/swagger-ui/index.html` — ikki segment — **mos kelmaydi** va
401 qaytadi. Swagger UI ochilmay qoladi.

Naqsh umuman parse bo'lmasligi ham mumkin (o'shanda ilova ishga tushmaydi) —
buni deploy'dan oldin lokal ishga tushirib tekshiring.

**Xavfsiz shakl** — aniq yo'llarni sanang:

```java
private final String[] WHITE_LIST = {
        "/api/v1/auth/**",
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html"
};
```

### 3. 🟠 Proyeksiyadagi SpEL jadvali yo'q guruhda yiqiladi

```java
@Value("#{target.timeTable.dayType}")
DayType getDayType();
```

Guruhda `timeTable` `null` bo'lsa (masalan yangi yaratilgan, jadval hali
biriktirilmagan guruh), SpEL `NullPointerException` beradi va **butun
`GET /group/groups` 500 qaytaradi** — bitta guruh sabab o'qituvchining
hamma guruhlari ko'rinmay qoladi.

**Tuzatish** — xavfsiz navigatsiya operatori:

```java
@Value("#{target.timeTable?.dayType}")
DayType getDayType();
```

Frontend `dayType` ni optional deb biladi, `null` kelsa o'sha guruh
toq/juft filtriga tushmaydi — xato bermaydi.

### 4. 🟠 `frontUrl` hamon qattiq yozilgan

```yaml
spring:
  application:
    frontUrl: http://localhost:5173
```

Bu qiymat CORS'da `allowedOrigins` bo'lib ishlatiladi. Productionda
`localhost` qolsa, proxy'siz ishlatilgan har qanday holatda CORS bloklaydi.

```yaml
frontUrl: ${FRONT_URL:http://localhost:5173}
```

(Frontend `/api` ni o'zi uzatgani uchun CORS umuman ishlamaydi, lekin
qiymat baribir to'g'ri bo'lgani ma'qul.)

### 5. 🟠 `/student/phone` ham himoyalanishi kerak

`GET /student/phone?phone=…` istalgan raqam bo'yicha o'quvchi kartasini
qaytaradi. Frontend undan faqat kirgan foydalanuvchining O'Z raqami bilan
foydalanadi (o'quvchi paneli), lekin backendda tekshiruv yo'q.

1-banddagi `@PreAuthorize` ishi qilinganda shu endpoint "o'zi yoki xodim"
qoidasiga bo'ysunsin.

### 6. 🟠 Davomat izohi: `AttendanceStudentCreateDto` da maydon yo'q

Kelishilganidek davomat interfeysi o'zgartirildi: ochiladigan ro'yxat
o'rniga bosiladigan kvadrat (yashil = keldi, bosilsa qizil = kelmadi),
burchagidagi tugma esa **sabab yozish** oynasini ochadi va statusni
`EXCUSED` qilib qo'yadi.

Muammo: `AttendanceStudentCreateDto` faqat `studentId` va `status` ni
oladi — **sabab matnini yuboradigan joy yo'q.** Hozir frontend uni yig'adi,
lekin yubormaydi va foydalanuvchiga "izoh hozircha serverda saqlanmaydi"
deb ochiq yozib qo'yadi.

**So'rov:**

```java
public record AttendanceStudentCreateDto(
        @NotBlank String studentId,
        @NotNull AttendanceStatus status,
        String reason          // ← EXCUSED uchun
) {}
```

`AttendanceStudentDto` ga ham qaytishi kerak, aks holda eski davomatda
sabab ko'rinmaydi.

Yana: `LATE` statusi interfeysdan olib tashlandi (amalda ishlatilmagan).
Enum'da qolaversin — eski yozuvlarda uchraydi va ular ko'rsatilishi kerak.

### 7. 🟠 `EnrollmentDto` da `id` yo'q

Guruhga o'quvchi qo'shish `POST /enrollments` orqali ulandi va ishlaydi.

Lekin **guruhdan chiqarish qilinmadi**: `DELETE /enrollments/{id}` enrollment
id sini talab qiladi, `EnrollmentDto{studentId, groupId, reason}` esa uni
qaytarmaydi. Frontend id ni bilmaydi.

```java
public record EnrollmentDto(String id, String studentId, String groupId, String reason) {}
```

Ism ham qo'shilsa yaxshi bo'lardi (`studentFullName`) — hozir ro'yxatni
ko'rsatish uchun o'quvchilar ro'yxati bilan solishtirishga to'g'ri keladi.

### 8. 🔴 `LessonDto` dars haqidagi asosiy ma'lumotni qaytarmaydi

Admin panelida "Darslar" tabi ulandi (`POST /lesson`, `PUT /lesson/{id}`,
ro'yxat va o'chirish). Ulash paytida uchta muammo chiqdi — uchalasi ham
`LessonMapper` da.

```java
@Mapper(componentModel = "spring", uses = {TeacherMapper.class, GroupMapper.class})
public interface LessonMapper {
    @Mapping(source = "createdAt", target = "lessonDate")
    LessonDto toDto(Lesson lesson);
}
```

`Lesson` entity'sida `lessonName` va `isCompleted` bor, `LessonDto` da esa
`lessonNumber` va `isComplete`. Nomlar mos kelmagani uchun MapStruct ularni
**umuman to'ldirmaydi** (`unmappedTargetPolicy` sukut bo'yicha WARN, ya'ni
kompilyatsiya o'tadi, maydon esa `null` qoladi):

| Maydon | Hozir | Natija |
| --- | --- | --- |
| `lessonNumber` | manba yo'q | doim `null` |
| `isComplete` | entity'da `isCompleted` | doim `null` |
| dars nomi | `lessonName` DTO'da umuman yo'q | foydalanuvchi kiritgan nom qaytmaydi |

Ya'ni `POST /lesson` ga yuborilgan `lessonName` saqlanadi, lekin uni
qaytarib o'qib bo'lmaydi — admin jadvalida va tahrirlash formasida ustun
bo'sh turadi.

**So'rov:**

```java
public record LessonDto(String id, String lessonName, LocalDateTime lessonDate,
                        Boolean isComplete, GroupDto group, TeacherDto teacherDto) {}
```

```java
@Mapping(source = "createdAt", target = "lessonDate")
@Mapping(source = "isCompleted", target = "isComplete")
LessonDto toDto(Lesson lesson);
```

Nom `lessonNumber` bo'lib qolsa ham mayli, muhimi — ichida qiymat bo'lsin;
frontend maydon nomini bir qatorda moslashtiradi. Faqat ayting, chunki
o'qituvchi panelida matn hozir "{{number}}-dars" ko'rinishida — nom kelsa
uni oddiy sarlavhaga almashtiramiz.

Yana: `@Mapper` ga `unmappedTargetPolicy = ReportingPolicy.ERROR` qo'ysangiz,
bunday xatolar kompilyatsiyada tutiladi.

### 9. 🟠 Darsni administrator yaratsa, o'qituvchisiz qoladi

```java
teacherRepository.findTeacherByUser_Id(userService.getCurrentUser().getId())
```

`LessonService.toEntity` o'qituvchini **kirgan foydalanuvchidan** oladi.
Administrator dars yaratsa, uning `Teacher` yozuvi yo'q — `findTeacherByUser_Id`
`null` qaytaradi va dars o'qituvchisiz saqlanadi (`teacher` ustuni
`optional = true`, shuning uchun xato ham bermaydi).

Admin panelida dars yaratish endi bor, ya'ni bu holat amalda uchraydi.
Yechim ikkitadan biri:

- `LessonCreateDto` ga ixtiyoriy `teacherId` qo'shish va berilgan bo'lsa
  o'shani ishlatish (guruhning o'qituvchisi sukut bo'yicha), yoki
- o'qituvchini guruhdan olish: `group.getTeacher()`.

Ikkinchisi soddaroq va deyarli har doim to'g'ri.

### 10. 🟠 `Branch` uchun API yo'q — super-admin paneli shu sababdan qilinmadi

Frontendda super-admin uchun placeholder ekran turibdi. Uni haqiqiy qilish
uchun filiallar (branch) API si kerak, hozir esa:

- `BranchController` **yo'q**;
- `BranchDto`, `BranchCreateDto`, `BranchUpdateDto` — uchalasi ham **bo'sh
  record** (`public record BranchDto() {}`);
- `Branch` entity'sida esa maydonlar bor: `organization`, `name`, `address`,
  `email`, `phone`, `chargeForMonth`, `googlePlaceId`, `latitude`, `longitude`.

Kerak bo'ladigan minimum: `GET/POST/PUT/DELETE /api/v1/branch` va DTO'lar
to'ldirilgan holda. Shundan keyin super-admin paneli boshqa tablar bilan
bir xil generik jadvalga tushadi — frontendda bir kunlik ish.

### 11. 🔴 `InvoiceMapper` da ism va rasm manzili almashib ketgan

`InvoiceMapper.toDtoFromProjection` — `GET /invoice` ro'yxati **aynan shu
yo'ldan** o'tadi (`InvoiceService:36` va `:70`):

```java
new UserDto(
        projection.getStudentUserId(),
        projection.getStudentFullName(),    // ← 2-o'rin: UserDto da bu `imageUrl`
        projection.getStudentImageUrl(),    // ← 3-o'rin: UserDto da bu `fullName`
        projection.getStudentPhone(),
        …
```

`UserDto` esa shunday e'lon qilingan:

```java
public record UserDto(String id, String imageUrl, String fullName,
                      String phone, LocalDate birthDate, Role role) {}
```

Ya'ni to'lovlar ro'yxatida **har bir o'quvchining ismi `imageUrl` maydoniga,
rasm manzili esa `fullName` ga** tushadi. Ikkalasi ham `String` bo'lgani
uchun kompilyator hech narsa demaydi — xato faqat ekranda ko'rinadi.

`GET /invoice/{id}` (bitta yozuv) `toDto` dan o'tadi va u to'g'ri, shuning
uchun ro'yxat bilan kartochka bir-biriga zid ko'rinadi.

**Tuzatish:** ikki qatorni almashtiring. Kelajakda bunday xato bo'lmasligi
uchun `new UserDto(...)` ni nomlangan qurilishga o'tkazing yoki
`UserDto` yasashni bitta yordamchi metodga chiqaring.

`TeacherDto` uchun ham shu proyeksiyada `getTeacherFullName` /
`getTeacherImageUrl` bor — o'sha joyni ham tekshiring.

### 12. 🟡 `ddl-auto: update`

Hozircha ishlaydi, lekin productionda xavfli: ustun o'chirilsa yoki tipi
o'zgarsa Hibernate jimgina noto'g'ri ish qilishi mumkin. Jonli ma'lumot
paydo bo'lgach Flyway yoki Liquibase'ga o'ting, `ddl-auto: validate` bilan.

---

## Railway env o'zgaruvchilari

`application.yaml` dagi nomlar defis bilan (`${DB-URL}`). Spring defisni
pastki chiziqqa aylantirib qidiradi, shuning uchun Railway'da **pastki
chiziq bilan** yozing:

```
DB_URL                  = jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DB_USERNAME             = ${{Postgres.PGUSER}}
DB_PASSWORD             = ${{Postgres.PGPASSWORD}}
AWS_ACCESS_KEY          = <yangi kalit>
AWS_SECRET_KEY          = <yangi kalit>
JWT_ACCESS_SECRET_KEY   = <yangi secret>
JWT_REFRESH_SECRET_KEY  = <yangi secret>
FRONT_URL               = https://<frontend-domeni>
SERVER_ADDRESS          = ::
JAVA_TOOL_OPTIONS       = -XX:MaxRAMPercentage=75
```

Railway'ning tayyor `DATABASE_URL` i `postgresql://…` ko'rinishida —
Spring `jdbc:postgresql://…` kutadi, shuning uchun yuqoridagidek qo'lda
yig'iladi.

`SERVER_ADDRESS=::` **shart**: Railway ichki tarmog'i IPv6, Spring esa
sukut bo'yicha faqat IPv4 tinglaydi va frontend proxysi unga yeta olmaydi.

Backendga **ochiq domen bermang** — frontend `/api` ni ichki tarmoq orqali
uzatadi (frontend repo'sidagi `Caddyfile`). Shunda refresh cookie same-site
bo'lib qoladi va CORS umuman kerak bo'lmaydi.

---

## Kelajakda kerak bo'ladigan endpoint'lar

Kerakli API'lar to'liq imzolari bilan alohida faylga chiqarildi:
[`backend-api-request.md`](backend-api-request.md). Shu fayl "nima
yozamiz?" degan savolga javob beradi — bu yerdagi ro'yxat esa mavjud
kodadagi xatolar haqida.

---

## Frontend moslashtirilgan DTO'lar

Bu shakllar `src/shared/types/index.ts` ga ko'chirilgan. O'zgartirsangiz
ayting — kompilyator qaysi ekranga tegishini o'zi ko'rsatadi.

`UserDto.imageUrl` · `TimeTableDto.dayType` (ODD/EVEN) ·
`LessonDto.lessonNumber` (String) · `GroupDto.level/currentMonth/lessonsCount` ·
`GroupNameProjection` (id, name, dayType) · `AttendanceCreateDto{lessonId, students}`
