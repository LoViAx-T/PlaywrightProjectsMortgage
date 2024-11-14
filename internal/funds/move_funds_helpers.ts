import { Page, expect } from "@playwright/test";

export async function chooseAccountToTransferTo(page: Page, toAccount: string): Promise<void> {
   await expect(page.getByText("Välj konto för fondsparande")).toBeVisible();
   await page
      .locator("div")
      .filter({ hasText: /^Välj konto$/ })
      .first()
      .click();
   await page.locator("form").locator("ul").locator("li").filter({ hasText: toAccount }).click({ force: true });
}

export async function chooseInstitute(page: Page, institute: string): Promise<void> {
   await expect(page.locator('xpath=//div[contains(@class, "select-institution_headline")]').getByText("Välj institut")).toBeVisible();
   await page
      .locator("form")
      .locator("div")
      .filter({ hasText: /^Välj institut$/ })
      .first()
      .click();
   await page.locator("form").locator("ul").locator("li").filter({ hasText: institute }).click({ force: true });
}

export async function accountDetails(page: Page, institute: string, depotNo: string): Promise<void> {
   await expect(page.getByText(institute)).toBeVisible();
   await page.getByRole("textbox").click();
   await page.getByRole("textbox").fill(depotNo);
}

export async function chooseFund(page: Page, fundName: string): Promise<void> {
   await page.locator("form").locator("div").filter({ hasText: "Välj fond" }).first().click();
   await page.locator("form").locator("ul").locator("li").filter({ hasText: fundName }).click({ force: true });
}

export interface IVerifyMove {
   fundNames: string[];
   institute: string;
   depotNo: string;
   toAccount: string;
}

export async function verifyMove(page: Page, verify: IVerifyMove): Promise<void> {
   await expect(page.getByText("Fonder jag vill flytta")).toBeVisible();

   for (let fund of verify.fundNames) {
      await expect(page.locator("dl").first()).toContainText(fund);
   }
   await expect(page.locator("dl").first().getByRole("button")).toBeVisible();
   await expect(page.locator("dl").nth(1)).toContainText(verify.institute);
   await expect(page.locator("dl").nth(1)).toContainText(verify.depotNo);
   await expect(page.locator("dl").nth(2)).toContainText(verify.toAccount);
}
