# Лаборатори №1 — UI автомат тест (Playwright)

**Хичээл:** F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест (2026)  
**Оюутан:** М.Наранбат  
**Оюутны код:** B242270801  
**Тестлэх веб:** https://www.saucedemo.com/

## Зорилго

Playwright Test болон TypeScript ашиглан веб интерфэйсийн үндсэн үйлдлүүдийг автоматжуулна. Төслийн хүрээнд амжилттай нэвтрэх, буруу нууц үгээр нэвтрэх оролдлого, нэвтэрсний дараа барааг сагсанд нэмэх гэсэн гурван тестийг хэрэгжүүлсэн.

## Төслийг өөрийн компьютерт ажиллуулах

Node.js болон npm суусан эсэхийг шалгана:

```bash
node --version
npm --version
```

Төслийн хавтас дотор дараах командыг ажиллуулна:

```bash
npm install
npx playwright install chromium
npx playwright test
```

Тестийг browser цонхтой ажиллуулах:

```bash
npx playwright test --headed
```

HTML тайлан үүсгэж нээх:

```bash
npx playwright show-report
```

Trace бичлэгтэй ажиллуулах:

```bash
npx playwright test --trace on
```

Тестийн ажиллуулалтаас үүссэн `test-results` доторх `trace.zip` файлын замыг ашиглан Trace Viewer нээнэ:

```bash
npx playwright show-trace "test-results/<test-folder>/trace.zip"
```

Codegen турших:

```bash
npx playwright codegen https://www.saucedemo.com/
```

Codegen browser дээр хийсэн үйлдлийг код болгон харуулна. Гарсан кодыг `tests/saucedemo.spec.ts` файлтай харьцуулж, бодит ажиглалтыг `notes/codegen-comparison.md` файлд тэмдэглэнэ.

## Хэрэгжүүлсэн тестүүд

| № | Тестийн нэр | Шалгах зүйл |
|---|---|---|
| 1 | Зөв мэдээллээр амжилттай нэвтрэх | Нэвтэрсний дараа Products хэсэг харагдах, URL inventory хуудас болох |
| 2 | Буруу нууц үгээр нэвтрэх | Алдааны мэдэгдэл харагдах, хэрэглэгч нэвтрээгүй хэвээр байх |
| 3 | Нэвтэрсний дараа барааг сагсанд нэмэх | Sauce Labs Backpack сагсанд нэмэгдэж, сагсны тоо 1 болох, бараа cart хуудсанд харагдах |

Тест бүр Playwright-ийн `Page` fixture-ээр тусдаа browser context ашигладаг тул нэг тестийн нэвтрэлтийн төлөв нөгөөд нөлөөлөхгүй. `afterEach` hook нь амжилттай нэвтэрсэн тестийн төгсгөлд цэсийг нээж Logout хийдэг; нэвтрээгүй тестэд гарах үйлдэл хийх шаардлагагүй.

## Locator сонголт ба XPath

Тестүүдэд `getByRole`, `getByPlaceholder`, `getByText`, `getByTestId` locator ашигласан. Эдгээр нь хэрэглэгчид харагдах role, placeholder, текст болон зориулалтын test attribute-д тулгуурладаг. Ингэснээр DOM-ийн дотоод бүтэц, элементийн байрлалд хэт хамааралтай XPath selector-оос зайлсхийж, тестийг уншихад ойлгомжтой, интерфэйсийн зарим өөрчлөлтөд илүү тэсвэртэй болгоно. XPath-ийг бүрэн хориглохгүй; semantic locator тохирохгүй үед л шаардлагатай эсэхийг нягтална.

## Playwright ба Selenium — харьцуулалтын ажиглалт

Selenium болон Playwright хоёулаа Apache 2.0 лицензтэй, нээлттэй эхийн хэрэгсэл. Playwright нь элемент үйлдэл хийхэд бэлэн болохыг auto-wait механизмаар автоматаар хүлээдэг бол Selenium-д ихэнх тохиолдолд explicit wait-ийг өөрөө тохируулах шаардлагатай. Playwright нь Chromium, Firefox, WebKit browser-уудыг нэг API-аар удирдаж, browser binary-г командаар суулгадаг. Selenium нь Java, Python, C#, JavaScript зэрэг олон хэл болон browser driver-ийн өргөн экосистемтэй. Playwright-ийн Codegen нь browser дээр хийсэн үйлдлийг код болгон гаргаж өгдөг. Trace Viewer нь алхам, DOM snapshot, screenshot болон алдааг эргэн шалгахад тусалдаг. Энэ лабораторийн тестийн жишээнд Playwright-ийн auto-wait болон role/test-id locator-ууд нь тестийн кодыг товч, ойлгомжтой байлгаж байна.

## Орон нутгийн шалгалт ба нотолгоо

Энэ repository-д GitHub Actions workflow ашиглаагүй. Багшийн шаардлагын дагуу тестийг оюутны өөрийн компьютерт суулгасан Node.js болон Playwright орчинд ажиллуулж, тухайн машины бодит гаралтыг нотолгоо болгоно.

Өөрийн компьютер дээр тест амжилттай ажилласны дараа:
1. Терминалын `node --version`, `npm --version` болон `npx playwright test` гаралтын screenshot-ийг `evidence/` хавтаст хадгал.
2. `npx playwright show-report` командаар HTML тайлангаа шалга.
3. Trace Viewer-ийг нээж, тестийн алхам болон DOM snapshot-ийг шалгасан screenshot-ийг хадгал.
4. Генерацлагдсан `playwright-report/` хавтсыг шаардлагатай бол repository-д commit хий.

**Анхаарах нь:** repository-д бодит бус screenshot, зохиомол test result эсвэл өөр компьютерийн version output оруулаагүй. Локал ажиллуулалтын үр дүнг зөвхөн өөрийн компьютер дээр ажиллуулсны дараа нэмнэ.

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
└── evidence/
    └── README.md
```

## GitHub

Repository: https://github.com/WinniePooh1-bit/lab01
