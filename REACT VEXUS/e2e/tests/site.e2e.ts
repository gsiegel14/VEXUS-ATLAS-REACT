import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('the home page and its navigation open an education page', async ({ app, screen, browser }) => {
  await browser.route('https://www.googletagmanager.com/gtag/js**', async (request) => request.abort());
  await app.open('/');
  await expect(browser).toHaveTitle('VEXUS ATLAS - Home');
  await expect(screen.getByRole('main')).toBeVisible();
  await screen.getByRole('button', 'VEXUS Atlas').tap();
  await screen.getByRole('link', 'VEXUS Fundamentals').tap();
  await expect(browser).toHaveURL('/education');
  await expect(screen.getByRole('main')).toBeVisible();
});

test('the mobile drawer opens the VEXUS pages', async ({ app, screen, browser }) => {
  await browser.route('https://www.googletagmanager.com/gtag/js**', async (request) => request.abort());
  await browser.setViewport({ width: 390, height: 844 });
  await app.open('/');
  await screen.getByRole('button', 'open drawer').tap();
  await browser.locator('.MuiDrawer-paper .MuiListItemText-primary').filter({ hasText: 'VEXUS Atlas' }).tap();
  await screen.getByRole('link', 'VEXUS Fundamentals').tap();
  await expect(browser).toHaveURL('/education');
  await expect(screen.getByRole('main')).toBeVisible();
});

for (const route of [
  '/waveform', '/education', '/acquisition', '/literature', '/publications',
  '/about', '/image-atlas', '/team', '/contact', '/calculator',
]) {
  test(`${route} renders its main content`, async ({ app, screen, browser }) => {
    if (route === '/image-atlas') {
      await browser.route('**/api/images', async (request) => request.fulfill({ json: [] }));
    }
    await app.open(route);
    await expect(browser).toHaveURL(route);
    if (route === '/calculator') {
      await screen.getByRole('button', 'I Understand & Confirm').tap();
      await screen.getByRole('button', 'I Understand & Confirm').tap();
    }
    await expect(screen.getByRole('main')).toBeVisible();
    await expect(browser.locator('main h1')).toBeVisible();
  });
}

test('publication search filters and restores the list', async ({ app, screen }) => {
  await app.open('/publications');
  await expect(screen.getByText('5 publications found')).toBeVisible();
  await screen.getByPlaceholder('Search by title, author, journal, or keywords...').fill('no matching publication');
  await expect(screen.getByText('No publications found matching your criteria')).toBeVisible();
  await screen.getByPlaceholder('Search by title, author, journal, or keywords...').fill('Longino');
  await expect(screen.getByText('No publications found matching your criteria')).not.toBeVisible();
});

test('image atlas search filters synthetic API images', async ({ app, screen, browser }) => {
  const imageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';
  await browser.route('**/api/images', async (request) => request.fulfill({
    json: [
      { id: 'synthetic-hepatic', title: 'Synthetic Hepatic Pattern', description: 'Example only', imageUrl, quality: 'High', veinType: 'Hepatic Vein', waveform: 'Normal' },
      { id: 'synthetic-portal', title: 'Synthetic Portal Pattern', description: 'Example only', imageUrl, quality: 'High', veinType: 'Portal Vein', waveform: 'Pulsatile' },
    ],
  }));
  await app.open('/image-atlas');
  await expect(screen.getByText('Synthetic Hepatic Pattern')).toBeVisible();
  await expect(screen.getByText('Synthetic Portal Pattern')).toBeVisible();
  await screen.getByPlaceholder('Search by description, vein type, waveform, analysis...').fill('hepatic');
  await expect(screen.getByText('Synthetic Hepatic Pattern')).toBeVisible();
  await expect(screen.getByText('Synthetic Portal Pattern')).not.toBeVisible();
});

test('manual VEXUS scoring requires every step and can be reset', async ({ app, screen }) => {
  await app.open('/calculator');
  await expect(screen.getByRole('heading', 'HIPAA Compliance Warning')).toBeVisible();
  await screen.getByRole('button', 'I Understand & Confirm').tap();
  await expect(screen.getByRole('heading', 'Beta Feature Warning')).toBeVisible();
  await screen.getByRole('button', 'I Understand & Confirm').tap();

  await expect(screen.getByRole('button', 'Next Step')).toBeDisabled();
  await screen.getByRole('combobox', 'IVC Diameter (Collapsibility NOT used in VEXUS)').tap();
  await screen.getByRole('option', 'IVC > 2cm').tap();
  await screen.getByRole('button', 'Next Step').tap();

  for (const [label, option] of [
    ['Hepatic Vein Classification', 'Hepatic Vein Severe'],
    ['Portal Vein Classification', 'Portal Vein Severe'],
    ['Renal Vein Classification', 'Renal Vein Severe'],
  ]) {
    await screen.getByRole('button', 'manual input').tap();
    await screen.getByRole('combobox', label).tap();
    await screen.getByRole('option', option).tap();
    await screen.getByRole('button', option.startsWith('Renal') ? 'Calculate Score' : 'Next Step').tap();
  }

  await expect(screen.getByRole('heading', 'VEXUS Grade 3')).toBeVisible();
  await screen.getByRole('button', 'Start New Calculation').tap();
  await expect(screen.getByRole('button', 'Next Step')).toBeDisabled();
});
