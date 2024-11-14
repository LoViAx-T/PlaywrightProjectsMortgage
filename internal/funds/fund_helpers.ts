import { expect, Locator, Page } from "@playwright/test";

export async function findDropdownInput(page: Page): Promise<Locator[]> {
   // How to use:
   // (await findDropdownInput(page)).at(1).click();
   // or
   // let t = await findDropdownInput(page)
   // await t[0].click()
   return await page.locator('xpath=//div[contains(@class, "dropdown-header_headerMultiOption")]').all();
}

export async function verifyOrdersInTable(page: Page, fundName, ...textToVerify: string[]) {
   let date = new Date();
   let todaysDate = date.toLocaleDateString("se").split("T")[0];

   for (var ele in textToVerify) {
      await expect(page.locator("table").locator("tr").filter({ hasText: todaysDate }).filter({ hasText: fundName }).first()).toContainText(textToVerify[ele]);
   }
}

export async function deleteTodaysOrders(page: Page) {
   let date = new Date();
   let todaysDate = date.toLocaleDateString("se").split("T")[0];

   for (const _ of await page.getByRole("row", { name: `${todaysDate}` }).all()) {
      if (
         await page
            .getByRole("row", { name: `${todaysDate}` })
            .first()
            .getByRole("button")
            .isVisible()
      ) {
         await page
            .getByRole("row", { name: `${todaysDate}` })
            .first()
            .getByRole("button")
            .click({ force: true });
         //await page.waitForTimeout(200)
         await expect(page.getByRole("button", { name: "Avbryt order" })).toBeVisible();
         await page.getByRole("button", { name: "Avbryt order" }).click({ force: true });
         await expect(page.getByText("Något gick fel, ordern kunde inte tas bort.")).not.toBeVisible();
         await page.waitForResponse("**/coral/products/depots/v1.0/**");
         await expect(page.getByText("Laddar sida")).not.toBeVisible({ timeout: 10000 });
      }
   }
}

export async function removeFundsInBundle(page: Page) {
   // If there is any funds in bundle remove them
   if (await page.getByRole("button", { name: "Godkänn" }).isVisible()) {
      for (var _ in await page.getByRole("button", { name: "Ta bort" }).all()) {
         await page.on("dialog", (dialog) => dialog.accept());
         await page.getByRole("button", { name: "Ta bort" }).first().click();
      }
   }
   await expect(page.getByRole("button", { name: "Godkänn" })).not.toBeVisible();
}
