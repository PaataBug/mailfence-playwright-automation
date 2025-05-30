import { type Locator, type Page } from "@playwright/test";

export class InboxPage {
  readonly page: Page;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.refreshButton = page.getByTitle("Refresh");
  }

  async refresh() {
    await this.refreshButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async openEmailBySubject(subject: string) {
    const parts = subject.split(" ");
    const baseSubject = `${parts[0]} ${parts[1]} ${parts[2]}`;

    console.log(`Looking for email with subject starting with: "${baseSubject}"`);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const emailLocator = this.page.locator("tr").filter({ hasText: baseSubject });

        console.log(`Attempt ${attempts + 1}: Searching for emails with "${baseSubject}"`);

        await emailLocator.first().click({ timeout: 10000 });

        console.log(`Successfully found and clicked email with subject: "${baseSubject}"`);
        return;
      } catch (error) {
        attempts++;
        console.log(`Attempt ${attempts}: Email not found, refreshing...`);

        if (attempts >= maxAttempts) {
          const allEmails = await this.page.locator('tr:has-text("Playwright")').allTextContents();
          console.log("Available emails:", allEmails);
          throw new Error(`Email with subject "${baseSubject}" not found after ${maxAttempts} attempts`);
        }

        await this.refresh();
        await this.page.waitForTimeout(3000);
      }
    }
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}