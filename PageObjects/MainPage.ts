import { expect, type Locator, type Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly enterButton: Locator;
  readonly mailNavigation: Locator;
  readonly documentsNavigation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByText('Log in');
    this.usernameInput = page.getByRole('textbox', { name: 'Username or Primary email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.enterButton = page.getByRole('button', { name: 'Enter' });
    this.mailNavigation = page.locator('#nav-mail div');
    this.documentsNavigation = page.locator('#nav-docs div');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.loginButton.click();
    await this.usernameInput.click();
    await this.usernameInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.enterButton.click();
    await expect(this.mailNavigation).toBeVisible();
  }

  async openMail() {
    await this.mailNavigation.click();
  }

  async openDocuments() {
    await this.documentsNavigation.click();
  }
}