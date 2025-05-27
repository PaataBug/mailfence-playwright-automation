import { expect, type Locator, type Page } from '@playwright/test';

export class TrashPage {
  readonly page: Page;
  readonly fileRowSelector: string;
  readonly deleteButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileRowSelector = 'tr.trow';
    this.deleteButton = page.getByText('Delete', { exact: true });
    this.confirmButton = page.getByText('Yes');
  }

  async deleteFile(fileName: string) {
    const fileLocator = this.page.locator(this.fileRowSelector).filter({ hasText: fileName });
    await expect(fileLocator).toBeVisible();
    await fileLocator.click();
    
    await expect(this.deleteButton).toBeVisible();
    await this.deleteButton.click();
    
    await expect(this.confirmButton).toBeVisible();
    await this.confirmButton.click();
  }

  async verifyFileDeleted(fileName: string) {
    await expect(this.page.getByText(fileName)).not.toBeVisible();
  }
}