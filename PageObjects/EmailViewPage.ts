import { expect, type Locator, type Page } from '@playwright/test';

export class EmailViewPage {
  readonly page: Page;
  readonly saveInDocumentsLink: Locator;
  readonly myDocumentsOption: Locator;
  readonly saveButton: Locator;
  readonly saveDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveInDocumentsLink = page.getByRole('link', { name: 'Save in Documents' });
    this.myDocumentsOption = page.getByText('My documents');
    this.saveButton = page.getByText('Save');
    this.saveDialog = page.locator('.GCSDBRWBFY.GCSDBRWBGY');
  }

  async saveAttachmentToDocuments(fileName: string) {
    const attachmentLocator = this.page.getByText(fileName);
    await expect(attachmentLocator).toBeVisible();
    await attachmentLocator.click({ button: 'right' });
    
    await expect(this.saveInDocumentsLink).toBeVisible();
    await this.saveInDocumentsLink.click();
    
    await expect(this.myDocumentsOption).toBeVisible();
    await this.myDocumentsOption.click();
    await this.page.waitForTimeout(3000);
    await this.saveButton.click();
    await expect(this.saveDialog).toBeHidden();
  }
}