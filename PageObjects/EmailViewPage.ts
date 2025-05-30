import { type Locator, type Page } from "@playwright/test";

export class EmailViewPage {
  readonly page: Page;
  readonly saveInDocumentsLink: Locator;
  readonly myDocumentsOption: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveInDocumentsLink = page.getByRole("link", { name: "Save in Documents" });
    this.myDocumentsOption = page.getByText("My documents");
    this.saveButton = page.getByText("Save");
  }

  async saveAttachmentToDocuments(fileName: string) {
    await this.page.waitForLoadState("domcontentloaded");

    const baseFileName = fileName.split("-")[0] + "-" + fileName.split("-")[1];
    const attachmentLocator = this.page.locator(`a[title*="${baseFileName}"]`);

    await attachmentLocator.first().click({ button: "right", force: true });
    await this.saveInDocumentsLink.click();
    await this.myDocumentsOption.click();
    await this.page.waitForTimeout(3000);
    await this.saveButton.click();
  }
}