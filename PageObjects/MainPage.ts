import { type Locator, type Page } from "@playwright/test";

export class MainPage {
  readonly page: Page;
  readonly mailNavigation: Locator;
  readonly documentsNavigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mailNavigation = page.locator("#nav-mail");
    this.documentsNavigation = page.locator("#nav-docs");
  }

  async openMail() {
    await this.mailNavigation.click();
  }

  async openDocuments() {
    await this.documentsNavigation.click();
  }
}