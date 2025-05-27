import { expect, type Locator, type Page } from '@playwright/test';

export class InboxPage {
  readonly page: Page;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.refreshButton = page.getByTitle('Refresh');
  }

  async refresh() {
    await this.refreshButton.click();
  }

  async openEmailBySubject(subject: string) {
    const emailLocator = this.page.getByText(subject).first();
    await expect(emailLocator).toBeVisible();
    await emailLocator.click();
  }

  async waitForEmailDelivery() {
    await this.page.waitForTimeout(5000);
  }
}