import { test, expect, type Page } from '@playwright/test';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

/**
 * SauceDemo-д зөв хэрэглэгчийн мэдээллээр нэвтэрнэ.
 * Тест бүр өөрийн Page fixture-тэй тул browser context тусгаарлагдана.
 */
async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(USERNAME);
  await page.getByPlaceholder('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  // Нэвтрэлт амжилттай бол inventory хуудас руу шилжсэн байна.
  await expect(page).toHaveURL(/inventory\.html$/);
}

/**
 * Амжилттай нэвтэрсэн тестийн дараа сессийг цэвэрлэнэ.
 * Нэвтрэлт амжилтгүй болсон үед меню байхгүй тул logout-г алгасна.
 */
async function logoutIfLoggedIn(page: Page): Promise<void> {
  const menuButton = page.getByRole('button', { name: 'Open Menu' });

  if (await menuButton.isVisible().catch(() => false)) {
    await menuButton.click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/');
  }
}

test.afterEach(async ({ page }) => {
  await logoutIfLoggedIn(page);
});

test('зөв мэдээллээр амжилттай нэвтрэх', async ({ page }) => {
  await login(page);

  // Бүтээгдэхүүний жагсаалт нээгдсэнийг URL болон heading-ээр батална.
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('буруу нууц үгээр нэвтрэхэд алдаа харуулах', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(USERNAME);
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  // data-test="error" элементийг testIdAttribute тохиргоогоор олно.
  await expect(page.getByTestId('error')).toContainText(
    'Username and password do not match'
  );

  // Алдаатай нэвтрэлт inventory хуудас руу шилжүүлээгүйг шалгана.
  await expect(page).toHaveURL('/');
  await expect(page.getByPlaceholder('Username')).toBeVisible();
});

test('нэвтэрсний дараа барааг сагсанд нэмэх', async ({ page }) => {
  await login(page);

  // Тодорхой барааны test id-г ашиглан Add to cart товчийг сонгоно.
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // Сагсны тэмдэглэгээ 1 болсон эсэхийг шалгана.
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();

  // Cart хуудас болон сонгосон бараа харагдаж буйг батална.
  await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
  await expect(
    page.getByText('Sauce Labs Backpack', { exact: true })
  ).toBeVisible();
});
