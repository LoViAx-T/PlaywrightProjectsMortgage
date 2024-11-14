import { expect, Page } from "@playwright/test";

export async function selectFundInTable(page: Page, fundName: string): Promise<void> {
   await page.getByRole("button").filter({ hasText: "Visa alla" }).click();
   await page.locator("tbody").getByRole("row").filter({ hasText: fundName }).getByRole("button").filter({ hasText: "Köp" }).click();
}

export type DataAddFundToBundle = {
   fundName: string;
   toAccount: string;
   fromAccount: string;
   amount: string;
};

export async function addFundToBundle(page: Page, data: DataAddFundToBundle): Promise<void> {
   await expect(page.locator("h2").first()).toContainText(data.fundName, { ignoreCase: true });

   await page.getByTestId("depotId").click();
   await page.getByTestId("depotId").locator("li").filter({ hasText: data.toAccount }).click({ force: true });

   await page.getByTestId("fromAccount").click();
   await page.getByTestId("fromAccount").locator("li").filter({ hasText: data.fromAccount }).click({ force: true });

   await expect(page.getByText("Disponibelt belopp")).toBeVisible();
   await page.locator("[name=amount]").fill(data.amount);
}

export interface VerifyBundleTable {
   fundName: string;
   toAccount: string;
   fromAccount: string;
   amount: string;
}

export async function verifyBundle(page: Page, bundle: VerifyBundleTable[]) {
   await expect(page.locator("h3")).toHaveText("Fonder jag vill köpa");
   for (let row of bundle) {
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fundName })).toContainText(row.toAccount);
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fundName })).toContainText(row.fromAccount);
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fundName })).toContainText(row.amount);
      await expect(page.locator("tbody").getByRole("row").filter({ hasText: row.fundName }).getByRole("button")).toBeVisible();
   }
}

export async function verifyReceipt(page: Page, bundle: VerifyBundleTable[]) {
   await expect(page.getByRole("heading", { name: "Kvittens" })).toBeVisible({ timeout: 20_000 });
   await expect(
      page.locator("div").filter({ hasText: /^Dina köpordrar har tagits emot$/ }),
   ).toBeVisible({ timeout: 20_000 });
   for (let row of bundle) {
      await expect(
         page.locator("tbody").getByRole("row").filter({ hasText: row.fundName }),
      ).toContainText(row.toAccount);
      await expect(
         page.locator("tbody").getByRole("row").filter({ hasText: row.fundName }),
      ).toContainText(row.fromAccount);
      await expect(
         page.locator("tbody").getByRole("row").filter({ hasText: row.fundName }),
      ).toContainText(row.amount);
   }
}
