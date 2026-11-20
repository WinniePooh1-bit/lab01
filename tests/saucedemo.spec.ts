import { test, expect, type Page } from '@playwright/test';

const SITE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

/**
 * Login үйлдлийг нэг helper-д төвлөрүүлэв.
 * Inventory жагсаалт гарсан эсэхийг шалгахаас гадна нэвтрэлт татгалзсан
 * тохиолдолд SauceDemo-ийн бодит error message-ийг ил гаргана.
 */
async function login(page: Page): Promise<void> {
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });

  // Хэрэглэгчид харагдах placeholder болон role-д тулгуурласан locator.
  await page.getByPlaceholder('Username').fill(USERNAME);
  await page.getByPlaceholder('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();

  const inventory = page.locator('.inventory_list');
  const loginError = page.getByTestId('error');

  // Амжилттай login эсвэл алдааны аль нэг төлөвт хүрэхийг хүлээнэ.
  await expect(inventory.or(loginError)).toBeVisible({ timeout: 20_000 });

  if (await loginError.isVisible()) {
    throw new Error(
      `SauceDemo нэвтрэлтийг татгалзлаа: ${(await loginError.innerText()).trim()}`
    );
  }

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventory).toBeVisible();
}

/**
 * Амжилттай нэвтэрсэн тестийн дараа logout хийж session-ийг цэвэрлэнэ.
 * Нэвтрээгүй үед меню байхгүй тул энэ алхмыг алгасна.
 */
async function logoutIfLoggedIn(page: Page): Promise<void> {
  const menuButton = page.getByRole('button', { name: 'Open Menu' });

  if (!(await menuButton.isVisible().catch(() => false))) {
    return;
  }

  await menuButton.click();

  const logoutLink = page.getByRole('link', { name: 'Logout' });
  await expect(logoutLink).toBeVisible({ timeout: 5_000 });
  await logoutLink.click();

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({
    timeout: 5_000
  });
}

test.afterEach(async ({ page }) => {
  await logoutIfLoggedIn(page);
});

test('зөв мэдээллээр амжилттай нэвтрэх', async ({ page }) => {
  await login(page);

  // Нэвтэрсний дараах бүтээгдэхүүний хэсэг болон жагсаалтыг шалгана.
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('буруу нууц үгээр нэвтрэхэд алдаа харуулах', async ({ page }) => {
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('Username').fill(USERNAME);
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  const loginError = page.getByTestId('error');

  await expect(loginError).toBeVisible();
  await expect(loginError).toContainText(
    'Username and password do not match'
  );

  // Нэвтрэлт амжилтгүй үед хэрэглэгч login form дээрээ үлдэнэ.
  await expect(page).toHaveURL(SITE_URL);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.locator('.inventory_list')).toHaveCount(0);
});

test('нэвтэрсний дараа барааг сагсанд нэмэх', async ({ page }) => {
  await login(page);

  // Sauce Labs Backpack-ийн зориулалтын data-test locator-ийг ашиглана.
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();

  await expect(page.getByText('Your Cart', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Sauce Labs Backpack', { exact: true })
  ).toBeVisible();
});
