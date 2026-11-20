# Лаборатори №1 — UI автомат тест (Playwright)

**Хичээл:** F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест (2026)  
**Тестлэх веб:** https://www.saucedemo.com/

## Зорилго

Playwright Test болон TypeScript ашиглан SauceDemo вебийн үндсэн үйлдлүүдийг автоматжуулна. Энэ төсөлд амжилттай нэвтрэх, буруу нууц үгээр нэвтрэх, нэвтэрсний дараа барааг сагсанд нэмэх гэсэн гурван тест орсон.

## Орчин бэлдэх ба тест ажиллуулах

Node.js болон npm хувилбарыг шалгана:

```bash
node --version
npm --version
```

Төслийн хавтас дотор:

```bash
npm install
npx playwright install chromium
npx playwright test
```

Ubuntu/WSL дээр browser-ийн системийн хамаарал дутуу бол:

```bash
npx playwright install --with-deps chromium
```

Тестийг browser цонхтой ажиллуулах:

```bash
npx playwright test --headed
```

HTML тайлан нээх:

```bash
npx playwright show-report
```

Trace бичлэгтэй тест ажиллуулах:

```bash
npx playwright test --trace on
```

Тестийн дараа `test-results` хавтаснаас `trace.zip` файлын замыг олж:

```bash
npx playwright show-trace "test-results/<test-folder>/trace.zip"
```

Codegen турших:

```bash
npx playwright codegen https://www.saucedemo.com/
```

Codegen-оор browser дээр login болон cart үйлдэл хийгээд гарсан кодыг `tests/saucedemo.spec.ts` файлтай харьцуулж, бодит ажиглалтыг `notes/codegen-comparison.md` файлд тэмдэглэнэ.

## Тестийн хамрах хүрээ

| № | Тест | Шалгалт |
|---|---|---|
| 1 | Зөв мэдээллээр нэвтрэх | URL inventory хуудас болох, Products гарчиг болон 6 бараа харагдах |
| 2 | Буруу нууц үг | Алдааны мэдэгдэл харагдах, inventory жагсаалт үүсэхгүй байх |
| 3 | Бараа сагсанд нэмэх | Sauce Labs Backpack сонгогдох, cart badge 1 болох, cart хуудсанд бараа харагдах |

Тестүүд тусдаа Playwright Page fixture ашигладаг. `afterEach` hook нь амжилттай нэвтэрсэн тохиолдолд SauceDemo цэсээр Logout хийж тестийн session-ийг цэвэрлэнэ.

## Locator ба XPath

Төслөөр `getByRole`, `getByPlaceholder`, `getByText`, `getByTestId` зэрэг semantic locator-уудыг турших боломжтой. Тестийн тогтвортой байдлыг хангахын тулд SauceDemo-ийн `data-test` атрибут болон бүтээгдэхүүний card-ийн бүтэцтэй locator-уудыг ашигласан. XPath нь DOM-ийн байрлал, бүтцэд хэт хамааралтай болохоор шаардлагагүй үед ашиглаагүй.

## Playwright ба Selenium-ийн харьцуулалт

Selenium болон Playwright хоёулаа Apache 2.0 лицензтэй нээлттэй эхийн хэрэгсэл. Playwright нь auto-wait механизмтай тул элемент үйлдэл хийхэд бэлэн болохыг автоматаар хүлээдэг. Selenium-д explicit wait-ийг тусад нь тохируулах тохиолдол олон. Playwright нь Chromium, Firefox, WebKit-ийг нэг API-аар удирддаг. Selenium нь Java, Python, C#, JavaScript зэрэг олон хэлний өргөн экосистемтэй. Playwright-ийн Codegen нь browser дээр хийсэн үйлдлийг код болгон үүсгэдэг. Trace Viewer нь алхам, DOM snapshot, screenshot болон алдааг шалгахад тустай. Энэ лабораторид auto-wait болон locator-ууд тестийн кодыг ойлгомжтой бичихэд тусалж байна.

## 2026-11-20 локал туршилтын тэмдэглэл

Оюутны ирүүлсэн Playwright HTML report-ийн screenshot-д 3 тестээс 1 нь Passed, 2 нь Failed, Flaky болон Skipped нь 0 гэж харагдсан. Буруу нууц үгийн тест 2.0 секундэд Passed болсон. Амжилттай нэвтрэх тест 35.1 секунд, бараа сагслах тест 35.9 секундэд Failed болсон. Screenshot нь зөвхөн summary хэсгийг харуулж байгаа тул яг аль assertion эсвэл locator алдаа өгснийг батлах боломжгүй; тухайн хоёр тестийн Trace болон алдааны дэлгэрэнгүйг нээж шалгах шаардлагатай.

Энэ хувилбарт login-ийн баталгаажуулалтыг inventory жагсаалт ба login error-ийн аль нэг гарахыг шалгахаар өөрчилж, алдааны мессежийг шууд харуулдаг болгосон. Cart-ийн сонголтыг бүтээгдэхүүний card-аар хязгаарлаж, Logout cleanup-д SauceDemo-ийн menu/logout selector ашигласан. **Эдгээр засварыг GitHub-д хадгалсан боловч шинэ хувилбарын тестийг өөрийн компьютерт дахин ажиллуулж баталгаажуулах хүртэл Passed гэж тэмдэглэхгүй.**

## Нотолгоо

Өөрийн компьютер дээр дараах бодит нотолгоог `evidence/` хавтаст нэмнэ:

- Node.js болон npm хувилбарын terminal screenshot.
- `npx playwright test` командын бүрэн гаралт.
- Амжилттай ажилласан HTML report-ийн screenshot.
- Trace Viewer-ийн screenshot.
- Codegen ашигласан screenshot болон ажиглалтыг `notes/codegen-comparison.md` файлд тэмдэглэсэн байх.

`playwright-report/` нь локал ажиллуулалтаар автоматаар үүснэ. `test-results/` болон `node_modules/`-ийг Git-д оруулахгүй.

## Файлын бүтэц

```text
lab01/
├── .gitignore
├── package.json
├── playwright.config.ts
├── README.md
├── tests/
│   └── saucedemo.spec.ts
├── notes/
│   ├── ai-review-template.md
│   └── codegen-comparison.md
├── evidence/
│   └── README.md
└── reports/
    └── local-run-2026-11-20.md
```

Repository: https://github.com/WinniePooh1-bit/lab01


## Дараагийн туршилтын update — 2026-11-20

Оюутан засварын дараа тестүүд хэвийн болсон гэж мэдээлсэн. Ирүүлсэн Chrome screenshot-д `saucedemo.com/inventory.html` хуудас, `Products` гарчиг болон бүтээгдэхүүний картууд харагдаж байна. Энэ нь амжилттай login-ийн дараах UI нээгдсэнийг харуулна. Харин screenshot-д HTML report-ийн Passed/Failed summary байхгүй тул шинэ run-ийн яг тоон үр дүнг энд зохиомлоор бичээгүй. Өмнөх 1 Passed / 2 Failed гэдэг нь эхний run-ийн үр дүн хэвээр үлдэнэ.
