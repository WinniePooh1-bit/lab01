import { test, expect, type Page } from '@playwright/test';

const SITE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

/**
 * Нэвтрэх үйлдлийг нэг газар төвлөрүүлсэн helper.
 * Амжилттай нэвтэрсэн эсэхийг зөвхөн URL-аар бус inventory жагсаалтаар давхар шалгана.
 * Хэрэв сайт алдааны мессеж харуулбал timeout хүлээлгүй тухайн мессежийг ил гаргана.
 */
async function login(page: Page): Promise<void> {
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });

  await page.locator('[data-test="username"]').fill(USERNAME);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();

  const inventory = page.locator('.inventory_list');
  const loginError = page.locator('[data-test="error"]');

  // Inventory жагсаалт эсвэл login error-ийн аль нэг нь гарч ирэхийг хүлээнэ.
  await expect(inventory.or(loginError)).toBeVisible({ timeout: 20_000 });

  if (await loginError.isVisible()) {
    const message = (await loginError.innerText()).trim();
    throw new Error(`SauceDemo нэвтрэлтийг татгалзлаа: ${message}`);
  }

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventory).toBeVisible();
}

/**
 * Амжилттай нэвтэрсэн үед SauceDemo-ийн цэсээр Logout хийнэ.
 * Нэвтрээгүй сөрөг тестэд меню байхгүй тул cleanup-г алгасна.
 */
async function logoutIfLoggedIn(page: Page): Promise<void> {
  const menuButton = page.locator('#react-burger-menu-btn');

  if (!(await menuButton.isVisible().catch(() => false))) {
    return;
  }

  await menuButton.click();

  const logoutLink = page.locator('#logout_sidebar_link');
  await expect(logoutLink).toBeVisible({ timeout: 5_000 });
  await logoutLink.click();

  // Logout хийсний дараа login form буцаж харагдах ёстой.
  await expect(page.locator('[data-test="login-button"]')).toBeVisible({
    timeout: 5_000
  });
}

test.afterEach(async ({ page }) => {
  await logoutIfLoggedIn(page);
});

test('зөв мэдээллээр амжилттай нэвтрэх', async ({ page }) => {
  await login(page);

  // Products гарчиг болон бүтээгдэхүүний жагсаалтыг шалгана.
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('буруу нууц үгээр нэвтрэхэд алдаа харуулах', async ({ page }) => {
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test="username"]').fill(USERNAME);
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  const loginError = page.locator('[data-test="error"]');

  // Зориуд буруу нууц үг өгсөн тул алдааны мэдэгдэл харагдах ёстой.
  await expect(loginError).toBeVisible();
  await expect(loginError).toContainText(
    'Username and password do not match'
  );

  // Систем inventory хуудас руу оруулаагүйг батална.
  await expect(page.locator('.inventory_list')).toHaveCount(0);
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

test('нэвтэрсний дараа барааг сагсанд нэмэх', async ({ page }) => {
  await login(page);

  // Нэрээр нь тухайн барааны card-ыг олж, түүний Add to cart товчийг дарна.
  const backpack = page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await expect(backpack).toHaveCount(1);
  await backpack.getByRole('button', { name: 'Add to cart' }).click();

  // Cart badge 1 болсон эсэхийг шалгана.
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.locator('.shopping_cart_link').click();

  // Cart хуудсанд зөвхөн сонгосон бараа харагдаж байгааг батална.
  await expect(page.locator('.title')).toHaveText('Your Cart');
  await expect(
    page.locator('.cart_item .inventory_item_name')
  ).toHaveText('Sauce Labs Backpack');
});
