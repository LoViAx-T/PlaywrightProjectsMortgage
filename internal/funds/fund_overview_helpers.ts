import { expect, Page } from "@playwright/test";

const todaysDate = new Date().toLocaleDateString("se").split("T")[0];

 // select depå account funds are in
export async function chooseDepotAccount(page: Page, depotAccountNo: string): Promise<void> {
   let dropdownHeader = page.locator('xpath=//label[contains(text(), "Konto/depå")]/..');
   await dropdownHeader.click();

   await dropdownHeader.locator("li", { hasText: depotAccountNo }).click({ force: true });
}

export async function cancelTodaysLastOrder(page: Page, fund:string): Promise<void> {
   // Cancel todays order
   await page
      .getByRole("row", { name: `${todaysDate} ${fund}` })
      .first()
      .getByRole("button")
      .click();
   await page.getByRole("button", { name: "Avbryt order" }).click();
}

export async function verifyOrderIsCanceled(page: Page, fund: string): Promise<void> {
   await expect(page.getByRole("row", { name: `${todaysDate} ${fund}` })).not.toBeVisible();
}