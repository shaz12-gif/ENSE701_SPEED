import { test, expect } from '@playwright/test';

test.describe('Evidence Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/submit');
  });

  test('should submit evidence without file', async ({ page }) => {
    // Wait for practices to load
    await page.waitForSelector('select[name="practiceId"]');
    
    // Fill form
    await page.selectOption('select[name="practiceId"]', '1');
    await page.selectOption('select[name="claimId"]', '1');
    await page.fill('textarea[name="title"]', 'Test Evidence');
    await page.fill('input[name="source"]', 'Test Source');
    await page.fill('input[name="year"]', '2023');
    await page.fill('textarea[name="description"]', 'Test Description');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to practices page
    await expect(page).toHaveURL('/practices');
  });

  test('should submit evidence with file', async ({ page }) => {
    // Wait for practices to load
    await page.waitForSelector('select[name="practiceId"]');
    
    // Fill required fields
    await page.selectOption('select[name="practiceId"]', '1');
    await page.selectOption('select[name="claimId"]', '1');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('test pdf content')
    });
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to practices page
    await expect(page).toHaveURL('/practices');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('.error')).toBeVisible();
  });
});