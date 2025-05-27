import { test, expect } from "@playwright/test";
import * as allure from "allure-js-commons";
import fs from "fs";
import path from "path";
import { MainPage } from "../PageObjects/MainPage";
import { ComposePage } from "../PageObjects/ComposePage";
import { InboxPage } from "../PageObjects/InboxPage";
import { EmailViewPage } from "../PageObjects/EmailViewPage";
import { DocumentsPage } from "../PageObjects/DocumentsPage";
import { TrashPage } from "../PageObjects/TrashPage";

test.describe("Mailfence Email Workflow", () => {
  const fileName = "sample-email.txt";
  const subject = "Playwright Attachment Test";
  const filePath = path.join("test-attachments", fileName);
  const email = process.env.EMAIL!;
  const password = process.env.PASSWORD!;

  let mainPage: MainPage;
  let composePage: ComposePage;
  let inboxPage: InboxPage;
  let emailViewPage: EmailViewPage;
  let documentsPage: DocumentsPage;
  let trashPage: TrashPage;

  test.beforeEach(async ({ page }) => {
    // Allure test setup
    await allure.owner("QA Team");
    await allure.tags("email", "workflow", "e2e");
    await allure.severity("critical");
    await allure.feature("Email Management");
    
    mainPage = new MainPage(page);
    composePage = new ComposePage(page);
    inboxPage = new InboxPage(page);
    emailViewPage = new EmailViewPage(page);
    documentsPage = new DocumentsPage(page);
    trashPage = new TrashPage(page);

    // Setup test file
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "This is a test file created by Playwright.");

    // Navigate to site and login
    await allure.step("Navigate to Mailfence and login", async () => {
      await mainPage.goto();
      await mainPage.login(email, password);
    });
  });

  test.afterEach(async () => {
    // Cleanup test file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test("should complete email attachment workflow with drag-drop", async () => {
    await allure.description("Complete end-to-end email workflow including composition, attachment handling, and file management");
    await allure.story("Email Attachment Workflow");
    await allure.epic("Email Management System");

    await test.step("Compose and send email with attachment", async () => {
      await allure.step("Open mail composer", async () => {
        await mainPage.openMail();
        await composePage.openNewMessage();
      });

      await allure.step("Fill email details", async () => {
        await composePage.fillTo(email);
        await composePage.fillSubject(subject);
        await allure.attachment("Email Subject", subject, "text/plain");
      });

      await allure.step("Attach file and send", async () => {
        await composePage.attachFile(filePath);
        await allure.attachment("Test File", fs.readFileSync(filePath), "text/plain");
        await composePage.send();
      });
    });

    await test.step("Open received email and save attachment", async () => {
      await allure.step("Wait for email delivery", async () => {
        await inboxPage.waitForEmailDelivery();
        await inboxPage.refresh();
      });

      await allure.step("Open email and save attachment to documents", async () => {
        await inboxPage.openEmailBySubject(subject);
        await emailViewPage.saveAttachmentToDocuments(fileName);
      });
    });

    await test.step("Move file to trash using drag-and-drop", async () => {
      await allure.step("Navigate to documents", async () => {
        await mainPage.openDocuments();
        await documentsPage.waitForDocumentsToLoad();
      });

      await allure.step("Perform drag-and-drop operation", async () => {
        await allure.description("Advanced drag-and-drop functionality using mouse coordinates");
        await documentsPage.moveFileToTrash(fileName);
        await documentsPage.openTrash();
      });
    });

    await test.step("Delete file permanently from trash", async () => {
      await allure.step("Delete file from trash", async () => {
        await trashPage.deleteFile(fileName);
      });

      await allure.step("Verify file deletion", async () => {
        await trashPage.verifyFileDeleted(fileName);
        await allure.attachment("Deletion Status", "File successfully deleted", "text/plain");
      });
    });
  });

  test("should handle file operations correctly", async () => {
    await allure.description("Validate file creation and content verification");
    await allure.story("File Operations");
    await allure.epic("Document Management");
    await allure.severity("normal");

    await test.step("Verify file creation", async () => {
      await allure.step("Check file existence", async () => {
        await expect(async () => {
          const fileExists = fs.existsSync(filePath);
          expect(fileExists).toBe(true);
        }).toPass();
        
        await allure.attachment("File Path", filePath, "text/plain");
      });
    });

    await test.step("Verify file content", async () => {
      await allure.step("Validate file content", async () => {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toBe("This is a test file created by Playwright.");
        
        await allure.attachment("File Content", content, "text/plain");
      });
    });
  });

  test("should support cross-browser compatibility", async ({ browserName }) => {
    await allure.description(`Verify email workflow functionality across different browsers: ${browserName}`);
    await allure.story("Cross-Browser Testing");
    await allure.epic("Browser Compatibility");
    await allure.severity("high");
    await allure.parameter("Browser", browserName);

    await test.step(`Execute basic workflow on ${browserName}`, async () => {
      await allure.step("Verify login functionality", async () => {
        // Login is already done in beforeEach
        await expect(mainPage.mailNavigation).toBeVisible();
      });

      await allure.step("Verify navigation capabilities", async () => {
        await mainPage.openMail();
        await mainPage.openDocuments();
        await allure.attachment("Browser Info", `Test executed on ${browserName}`, "text/plain");
      });
    });
  });
});