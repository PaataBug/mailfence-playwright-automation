import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { WorkflowPage } from "../PageObjects/WorkFlowPage";

test.describe("Mailfence Email Workflow", () => {
  let fileName: string;
  let subject: string;
  let filePath: string;
  let testContent: string;

  const email = process.env.EMAIL!;
  const password = process.env.PASSWORD!;

  let workflowPage: WorkflowPage;

  test.beforeEach(async ({ page }, testInfo) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const workerIndex = testInfo.workerIndex;

    fileName = `test-w${workerIndex}-${timestamp}-${randomId}.txt`;
    subject = `Playwright Test W${workerIndex} ${timestamp} ${randomId}`;
    filePath = path.join("test-attachments", fileName);
    testContent = `Test file created at ${new Date().toISOString()} by worker ${workerIndex} with ID ${randomId}`;

    workflowPage = new WorkflowPage(page);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, testContent);

    await workflowPage.loginToApplication(email, password);
  });

  test.afterEach(async () => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  test("should complete email attachment workflow with drag-drop", async () => {
    await workflowPage.composeAndSendEmailWithAttachment(email, subject, filePath);
    await workflowPage.openEmailAndSaveAttachment(subject, fileName);
    await workflowPage.moveFileToTrashViaDragDrop(fileName);
    await workflowPage.deleteFilePermanentlyFromTrash(fileName);
  });

  test("should handle file operations correctly", async () => {
    await expect(async () => {
      const fileExists = fs.existsSync(filePath);
      expect(fileExists).toBe(true);
    }).toPass();

    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toBe(testContent);
  });
});