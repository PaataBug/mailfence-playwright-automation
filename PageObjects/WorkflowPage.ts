import { expect, type Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { MainPage } from "./MainPage";
import { ComposePage } from "./ComposePage";
import { InboxPage } from "./InboxPage";
import { EmailViewPage } from "./EmailViewPage";
import { DocumentsPage } from "./DocumentsPage";
import { TrashPage } from "./TrashPage";

export class WorkflowPage {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly mainPage: MainPage;
  readonly composePage: ComposePage;
  readonly inboxPage: InboxPage;
  readonly emailViewPage: EmailViewPage;
  readonly documentsPage: DocumentsPage;
  readonly trashPage: TrashPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.mainPage = new MainPage(page);
    this.composePage = new ComposePage(page);
    this.inboxPage = new InboxPage(page);
    this.emailViewPage = new EmailViewPage(page);
    this.documentsPage = new DocumentsPage(page);
    this.trashPage = new TrashPage(page);
  }

  async loginToApplication(email: string, password: string) {
    await this.loginPage.goto();
    await this.loginPage.login(email, password);
    await expect(this.mainPage.mailNavigation).toBeVisible({ timeout: 30000 });
  }

  async composeAndSendEmailWithAttachment(email: string, subject: string, filePath: string) {
    await this.mainPage.openMail();
    await expect(this.composePage.newButton).toBeVisible({ timeout: 30000 });
    await this.composePage.openNewMessage();
    await this.composePage.fillTo(email);
    await this.composePage.fillSubject(subject);
    await this.composePage.attachFile(filePath);
    await this.composePage.send();
  }

  async openEmailAndSaveAttachment(subject: string, fileName: string) {
    await this.page.waitForTimeout(5000);
    await this.inboxPage.refresh();
    await expect(this.inboxPage.refreshButton).toBeEnabled({ timeout: 10000 });
    await this.inboxPage.openEmailBySubject(subject);
    
    const baseFileName = fileName.split("-")[0] + "-" + fileName.split("-")[1];
    const attachmentLocator = this.page.locator(`a[title*="${baseFileName}"]`);
    await expect(attachmentLocator.first()).toBeAttached({ timeout: 15000 });
    
    await this.emailViewPage.saveAttachmentToDocuments(fileName);
  }

  async moveFileToTrashViaDragDrop(fileName: string) {
    await this.mainPage.openDocuments();
    await this.documentsPage.waitForDocumentsToLoad();
    await expect(this.documentsPage.trashFolder).toBeVisible({ timeout: 20000 });
    
    const fileElement = this.page.locator(this.documentsPage.fileRowSelector).filter({ hasText: fileName });
    await expect(fileElement).toBeVisible({ timeout: 15000 });
    
    await this.documentsPage.moveFileToTrash(fileName);
    await expect(fileElement).not.toBeVisible({ timeout: 10000 });
    await this.documentsPage.openTrash();
  }

  async deleteFilePermanentlyFromTrash(fileName: string) {
    await expect(this.trashPage.getFileRowLocator(fileName)).toBeVisible({ timeout: 15000 });
    await this.trashPage.deleteFile(fileName);
    await expect(this.trashPage.getFileLocator(fileName)).not.toBeVisible({ timeout: 15000 });
  }
}