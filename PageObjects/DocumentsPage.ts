import { type Locator, type Page } from "@playwright/test";

export class DocumentsPage {
  readonly page: Page;
  readonly fileRowSelector: string;
  readonly trashFolder: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileRowSelector = "tr.trow";
    this.trashFolder = page.locator("#doc_tree_trash");
  }

  async waitForDocumentsToLoad() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async moveFileToTrash(fileName: string) {
    const fileElement = this.page.locator(this.fileRowSelector).filter({ hasText: fileName });

    const count = await fileElement.count();
    console.log(`Found ${count} file rows`);

    const firstElementBox = await fileElement.boundingBox();
    const secondElementBox = await this.trashFolder.boundingBox();

    console.log("firstElementBox:", firstElementBox);
    console.log("secondElementBox:", secondElementBox);

    if (firstElementBox && secondElementBox) {
      await this.page.mouse.move(
        firstElementBox.x + firstElementBox.width / 2,
        firstElementBox.y + firstElementBox.height / 2
      );
      await this.page.mouse.down();
      await this.page.mouse.move(
        secondElementBox.x + secondElementBox.width / 2,
        secondElementBox.y + secondElementBox.height / 2,
        { steps: 5 }
      );
      await this.page.mouse.up();
      console.log("Drag and drop completed");
    } else {
      console.log("Could not get bounding boxes - elements not found or not visible");
    }
  }

  async openTrash() {
    await this.trashFolder.click();
  }
}