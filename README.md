# Mailfence Playwright Automation Framework 🎭

A comprehensive end-to-end testing framework for Mailfence email workflows using Playwright with TypeScript and Page Object Model (POM) design pattern.

## 🚀 Features

- **Enterprise-grade architecture** with Page Object Model
- **Cross-browser testing** support (Chromium, Firefox, WebKit)
- **Advanced drag-and-drop functionality** for file management
- **TypeScript** for type safety and better IDE support
- **Environment configuration** for multiple test environments
- **Professional test reporting** with traces and screenshots
- **CI/CD ready** configuration

## 🏗️ Framework Architecture

```
mailfence-playwright-automation/
├── PageObjects/           # Page Object Model classes
│   ├── MainPage.ts       # Login and navigation
│   ├── ComposePage.ts    # Email composition
│   ├── InboxPage.ts      # Inbox operations
│   ├── EmailViewPage.ts  # Email viewing and attachments
│   ├── DocumentsPage.ts  # Document management and drag-drop
│   └── TrashPage.ts      # Trash operations
├── tests/                # Test specifications
│   └── mailfence.spec.ts # Main test scenarios
├── test-attachments/     # Test files (auto-generated)
├── test-results/         # Test execution results
├── .env                  # Environment variables
├── playwright.config.ts  # Playwright configuration
└── package.json         # Dependencies and scripts
```

## 📋 Test Scenarios

### 🧪 Current Test Coverage

- **Email Workflow**: Complete email composition and sending
- **Attachment Management**: File attachment and document saving
- **Drag-and-Drop**: Advanced file management with mouse interactions
- **Document Operations**: Moving files to trash and permanent deletion
- **Cross-browser Validation**: Ensures functionality across different browsers

## 🛠️ Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Mailfence Account** - [Sign up here](https://mailfence.com/)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mailfence-playwright-automation.git
cd mailfence-playwright-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Environment Setup

Create a `.env` file in the root directory:

```env
EMAIL=your-mailfence-email@example.com
PASSWORD=your-secure-password
```

> ⚠️ **Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 5. Run Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run specific test
npx playwright test mailfence.spec.ts
```

## 📊 Test Reports

After running tests, you can view detailed reports:

```bash
# Open HTML report
npx playwright show-report

# View trace files (for failed tests)
npx playwright show-trace test-results/[test-folder]/trace.zip
```

## 🔧 Configuration

### Playwright Configuration

The framework is configured in `playwright.config.ts`:

- **Base URL**: https://mailfence.com
- **Timeout**: 60 seconds
- **Retries**: 0 (configurable)
- **Browser**: Chromium (headless by default)
- **Screenshots**: On failure only
- **Video**: Retain on failure

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL` | Mailfence email address | ✅ |
| `PASSWORD` | Mailfence password | ✅ |

## 🏛️ Page Object Model

This framework implements the **Page Object Model (POM)** design pattern following official Playwright recommendations:

### Benefits
- **Maintainable**: UI changes require updates in one place only
- **Reusable**: Page methods can be used across multiple tests
- **Readable**: Tests focus on business logic, not implementation details
- **Type-safe**: Full TypeScript support with IntelliSense

### Example Usage

```typescript
// Initialize page objects
const mainPage = new MainPage(page);
const composePage = new ComposePage(page);

// Use in tests
await mainPage.login(email, password);
await mainPage.openMail();
await composePage.openNewMessage();
```

## 🎯 Advanced Features

### Drag-and-Drop Implementation

The framework includes sophisticated drag-and-drop functionality using Playwright's mouse actions:

```typescript
// Coordinate-based drag and drop for complex UI interactions
await page.mouse.move(sourceX, sourceY);
await page.mouse.down();
await page.mouse.move(targetX, targetY, { steps: 5 });
await page.mouse.up();
```

### Test Steps Organization

Tests are organized using `test.step()` for better debugging and reporting:

```typescript
await test.step("Compose and send email", async () => {
  // Test implementation
});
```

