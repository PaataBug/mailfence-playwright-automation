import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly enterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator("#signin");
    this.usernameInput = page.locator("#UserID");
    this.passwordInput = page.locator("#Password");
    this.enterButton = page.locator('input[type="submit"][value="Enter"]');
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async fillUsername(username: string) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
  }

  async clickEnter() {
    await this.enterButton.click();
  }

  async login(email: string, password: string) {
    await this.clickLogin();
    await this.fillUsername(email);
    await this.fillPassword(password);
    await this.clickEnter();
  }
}