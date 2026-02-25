import { test, expect } from '@playwright/test';

test('Keepsake App Flow Verification', async ({ page }) => {
  // 1. The user, exhausted after finally putting their toddler to sleep, navigates to the web application on their phone.
  await page.goto('/echo');

  // 2. They are greeted immediately by a large, empty text field without needing to bypass any dashboards.
  const input = page.getByPlaceholder('What did they say today?');
  await expect(input).toBeVisible();
  await expect(input).toBeEmpty();

  // 3. They type: "I don't want to wear the blue socks, they are too spicy."
  const quote = "I don't want to wear the blue socks, they are too spicy.";
  await input.fill(quote);

  // 4. They press the singular button labeled "Preserve."
  const preserveButton = page.getByRole('button', { name: 'Preserve' });
  await preserveButton.click();

  // 5. The quote is gently appended to a chronological, text-only feed below the input.
  const feed = page.getByTestId('quote-feed');
  await expect(feed).toContainText(quote);

  // The user scrolls for a few seconds, smiling at a quote from three months prior, then closes the app with a sense of peace.
  // (Scrolling simulation is implicit in viewing the feed)

  // CRITICAL: At the end of the test (after the assertions pass), you MUST take a screenshot of the active feature using `await page.screenshot({ path: 'evidence.png' });`.
  await page.screenshot({ path: 'evidence.png' });
});
