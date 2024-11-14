import { Page, expect } from "@playwright/test";

export type DataAddFundToBundle = {
   fromAccount: string;
   fundName: string;
   amountOfFund: "sälj procent av mitt innehav" | "Sälj andelar av mitt innehav" | "Sälj hela mitt innehav";
   amount?: string
}

export type VerifyBundleTable = {
   fundName: string;
   fromAccount: string;
}

export async function addFundToBundle(page: Page, data: DataAddFundToBundle) {
   // verify title
   await expect(page.getByRole("heading").first()).toHaveText("Sälj fond", { timeout: 40_000 });
   // choose "sell from account"
   await page.getByTestId("depotid").click()
   await page.getByTestId("depotid").locator("li").filter({ hasText: data.fromAccount }).click({ force: true });

   // choose fund to sell
   await page.getByTestId("isin").click({ timeout: 15_000 });
   await page.getByTestId("isin").locator("li").filter({ hasText: data.fundName }).click();
   
   await expect(page.locator('xpath=//div[contains(@class, "input-help-text_negativeMargins")]')).toBeVisible();

   // how much of fund to sell
   await page.getByTestId("sellType").click();

   if (data.amountOfFund.toLowerCase() === "sälj hela mitt innehav") {
      await page.getByTestId("sellType").locator("li").filter({ hasText: data.amountOfFund }).click();
   } else {
      await page.getByTestId("sellType").locator("li").filter({ hasText: data.amountOfFund }).click();
      await page.locator("[name='percent']").fill(data.amount);
      await expect(page.locator('xpath=//div[contains(@class, "select-fund_approxValueCard")]')).toBeVisible();
   }
}

export async function verifyBundle(page: Page, bundle: VerifyBundleTable[]) {
   for (let row of bundle) {
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fromAccount })).toContainText(row.fromAccount);
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fundName }).getByRole("button")).toBeVisible();
   }
}

export async function verifyReceipt(page: Page, bundle: VerifyBundleTable[]) {
   await expect(page.locator("h3")).toHaveText("Godkända säljordrar", { timeout: 15000 });
   await expect(page.locator("div").filter({ hasText: /^Dina säljordrar har tagits emot$/ })).toBeVisible();
   for (let row of bundle) {
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fundName })).toContainText(row.fromAccount);
   }
}
