import { type Locator, type Page } from "@playwright/test";

export class TrashPage {
  readonly page: Page;
  readonly fileRowSelector: string;
  readonly deleteButton: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileRowSelector = "tr.trow";
    this.deleteButton = page.getByText("Delete", { exact: true });
    this.confirmButton = page.getByText("Yes");
  }

  async deleteFile(fileName: string) {
    const fileLocator = this.page.locator(this.fileRowSelector).filter({ hasText: fileName });
    await fileLocator.click();
    await this.deleteButton.click();
    await this.confirmButton.click();
  }

  getFileLocator(fileName: string) {
    return this.page.getByText(fileName);
  }

  getFileRowLocator(fileName: string) {
    return this.page.locator(this.fileRowSelector).filter({ hasText: fileName });
  }
}