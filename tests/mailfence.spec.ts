import { test, expect } from "@playwright/test";
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
    await mainPage.goto();
    await mainPage.login(email, password);
  });

  test.afterEach(async () => {
    // Cleanup test file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test("should complete email attachment workflow with drag-drop", async () => {
    await test.step("Compose and send email with attachment", async () => {
      await mainPage.openMail();
      await composePage.openNewMessage();
      await composePage.fillTo(email);
      await composePage.fillSubject(subject);
      await composePage.attachFile(filePath);
      await composePage.send();
    });

    await test.step("Open received email and save attachment", async () => {
      await inboxPage.waitForEmailDelivery();
      await inboxPage.refresh();
      await inboxPage.openEmailBySubject(subject);
      await emailViewPage.saveAttachmentToDocuments(fileName);
    });

    await test.step("Move file to trash using drag-and-drop", async () => {
      await mainPage.openDocuments();
      await documentsPage.waitForDocumentsToLoad();
      await documentsPage.moveFileToTrash(fileName);
      await documentsPage.openTrash();
    });

    await test.step("Delete file permanently from trash", async () => {
      await trashPage.deleteFile(fileName);
      await trashPage.verifyFileDeleted(fileName);
    });
  });

  test("should handle file operations correctly", async () => {
    await test.step("Verify file creation", async () => {
      await expect(async () => {
        const fileExists = fs.existsSync(filePath);
        expect(fileExists).toBe(true);
      }).toPass();
    });

    await test.step("Verify file content", async () => {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toBe("This is a test file created by Playwright.");
    });
  });
});