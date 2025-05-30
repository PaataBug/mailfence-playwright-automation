import { type Locator, type Page } from "@playwright/test";

export class ComposePage {
  readonly page: Page;
  readonly newButton: Locator;
  readonly toField: Locator;
  readonly subjectField: Locator;
  readonly attachmentButton: Locator;
  readonly fileInput: Locator;
  readonly sendButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newButton = page.locator("#mailNewBtn");
    this.toField = page
      .getByRole("row", { name: "To", exact: true })
      .getByRole("textbox");
    this.subjectField = page.locator("#mailSubject");
    this.attachmentButton = page.getByText("Attachment");
    this.fileInput = page.locator('input[type="file"]');
    this.sendButton = page.locator("#mailSend");
  }

  async openNewMessage() {
    await this.newButton.click();
  }

  async fillTo(email: string) {
    await this.toField.fill(email);
  }

  async fillSubject(subject: string) {
    await this.subjectField.click();
    await this.subjectField.fill(subject);
  }

  async attachFile(filePath: string) {
    await this.attachmentButton.click();
    await this.fileInput.setInputFiles(filePath);
  }

  async send() {
    await this.sendButton.click();
  }
}
