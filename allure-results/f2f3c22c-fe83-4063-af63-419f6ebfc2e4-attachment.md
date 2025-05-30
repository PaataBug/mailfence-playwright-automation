# Test info

- Name: Mailfence Email Workflow >> should handle file operations correctly
- Location: C:\Users\Paata.Bugianishvili\Desktop\mailfence-playwright\tests\mailfence.spec.ts:119:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('#nav-mail div')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('#nav-mail div')

    at MainPage.login (C:\Users\Paata.Bugianishvili\Desktop\mailfence-playwright\PageObjects\MainPage.ts:33:39)
    at C:\Users\Paata.Bugianishvili\Desktop\mailfence-playwright\tests\mailfence.spec.ts:47:7
```

# Page snapshot

```yaml
- iframe
- iframe
```

# Test source

```ts
   1 | import { expect, type Locator, type Page } from '@playwright/test';
   2 |
   3 | export class MainPage {
   4 |   readonly page: Page;
   5 |   readonly loginButton: Locator;
   6 |   readonly usernameInput: Locator;
   7 |   readonly passwordInput: Locator;
   8 |   readonly enterButton: Locator;
   9 |   readonly mailNavigation: Locator;
  10 |   readonly documentsNavigation: Locator;
  11 |
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.loginButton = page.getByText('Log in');
  15 |     this.usernameInput = page.getByRole('textbox', { name: 'Username or Primary email' });
  16 |     this.passwordInput = page.getByRole('textbox', { name: 'Password' });
  17 |     this.enterButton = page.getByRole('button', { name: 'Enter' });
  18 |     this.mailNavigation = page.locator('#nav-mail div');
  19 |     this.documentsNavigation = page.locator('#nav-docs div');
  20 |   }
  21 |
  22 |   async goto() {
  23 |     await this.page.goto('/');
  24 |   }
  25 |
  26 |   async login(email: string, password: string) {
  27 |     await this.loginButton.click();
  28 |     await this.usernameInput.click();
  29 |     await this.usernameInput.fill(email);
  30 |     await this.passwordInput.click();
  31 |     await this.passwordInput.fill(password);
  32 |     await this.enterButton.click();
> 33 |     await expect(this.mailNavigation).toBeVisible();
     |                                       ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  34 |   }
  35 |
  36 |   async openMail() {
  37 |     await this.mailNavigation.click();
  38 |   }
  39 |
  40 |   async openDocuments() {
  41 |     await this.documentsNavigation.click();
  42 |   }
  43 | }
```