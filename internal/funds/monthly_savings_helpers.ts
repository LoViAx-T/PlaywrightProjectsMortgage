import { expect, Page } from "@playwright/test";
import { DateMonthYear, dateMonthYearDigit } from "../general";
import { getMonthlySavingsGet } from "../api/mfbank_api";

export type DataStartMonthlySaving = {
   depotAccountNo: string;
   startMonth: DateMonthYear;
   savingsAccountNo: string;
   amount: string;
   funds: DataStartMonthlySavingFunds[]
}

type DataStartMonthlySavingFunds = {
   name: string;
   percantage: string;
};

export async function isNoMonthlySavings(page: Page): Promise<boolean> {
   // No monthly savings started on account
   return (await page.getByRole("link", { name: "Starta månadssparande" }).isVisible()) ? true : false;
}

export async function deleteMonthlySavings(page: Page): Promise<void> {
   await expect(page.locator("tbody")).toBeVisible({ timeout: 30000 });

   let allRows = await page.locator("tbody").locator("tr").all();
   for (var _ in allRows) {
      await page.locator("tbody").locator("tr").locator("button").first().click();
      await page.getByRole("button", { name: "Ta bort" }).click();

      await page.locator("#backdrop").getByRole("button", { name: "Ta bort" }).click();
      await expect(
         page
            .locator("div")
            .filter({ hasText: /^Något gick fel\. Var god försök igen eller kom tillbaka om några minuter\.$/ })
            .nth(4),
      ).not.toBeVisible();
   }
}

// Choose fund account
export async function chooseDepotAccount(page: Page, depotAccountNo: string): Promise<void> {
   await expect(page.locator("h2").first()).toContainText("Välj fondkonto", { timeout: 30_000 });
   await page
      .locator('xpath=//div[contains(@class, "select-depot_depotCard")]')
      .filter({ hasText: depotAccountNo })
      .first()
      .getByRole("button")
      .click();
}

// Create monthly saving
export async function monthlySavingsDetails(page: Page, data: DataStartMonthlySaving): Promise<void> {
   // verify sub title
   await expect(page.locator("h2").first()).toContainText("Ange belopp, startmånad och konto");
   // verify account
   await expect(page.locator("h3")).toContainText(data.depotAccountNo);

   await page.locator("[name=amount]").fill(data.amount);
   await page.getByTestId("startMonth").click();
   await page.getByTestId("startMonth").locator("li", { hasText: data.startMonth }).click({ force: true });

   await page.getByTestId("fromAccount").click();
   await page.getByTestId("fromAccount").locator("li", { hasText: data.savingsAccountNo }).click({ force: true });
}

export async function chooseFunds(page: Page, funds: DataStartMonthlySavingFunds[]): Promise<void> {
   for (let fund of funds) {
      await page
         .locator("tbody")
         .getByRole("row")
         .filter({ hasText: fund.name })
         .getByRole("button")
         .filter({ hasText: "Välj" })
         .click();
   }
}

export async function chooseFundsPercentage(
   page: Page,
   funds: DataStartMonthlySavingFunds[],
): Promise<void> {
   for (let fund of funds) {
      // verify elemnts in box
      let fundPercentageBox = page.getByTestId("fund-card").filter({ hasText: fund.name });
      await expect(page.locator("h4", { hasText: fund.name })).toBeVisible();
      await expect(fundPercentageBox).toBeVisible();
      await expect(fundPercentageBox.getByRole("link")).toHaveAttribute(
         "href",
         /\/spara\/fondlista\/fondinformation\/*/,
      );
      await expect(
         fundPercentageBox.getByRole("button", { name: "Beräknade kostnader" }),
      ).toBeEnabled();

      if (funds.length > 1) {
         await expect(fundPercentageBox.getByRole("button", { name: "Ta bort" })).toBeEnabled();
         await fundPercentageBox.getByRole("slider").fill(fund.percantage);
      }
   }
}

export async function verifyReceipt(
   page: Page,
   data: DataStartMonthlySaving,
): Promise<void> {
   // await expect(page.locator("div").filter({ hasText: /^Månadssparande startat$/ })).toBeVisible();
   await expect(page.getByRole("heading").first()).toHaveText("Månadssparande startat");
   await expect(page.getByText("månadssparande till")).toContainText(data.depotAccountNo);
   await expect(page.locator("dd").nth(2)).toContainText(data.startMonth, { ignoreCase: true });

   for (let fund of data.funds) {
      await expect(
         page.locator("tbody").getByRole("row").filter({ hasText: fund.name}),
      ).toContainText(data.funds.length > 1 ? fund.percantage : "100" +" %");
   }
   await expect(page.locator("tfoot")).toContainText(data.amount);
}

export async function verifyMonthlySavingStartedApi(
   ssn: string,
   data: DataStartMonthlySaving,
   isPaused: boolean,
   isWithinFreeze: boolean,
   customDate?: string,
) {
   let getMonthlySavings = await getMonthlySavingsGet(
      ssn,
      data.depotAccountNo.replaceAll(" ", "").replaceAll("-", ""),
   );
   expect(getMonthlySavings.status()).toEqual(200);
   let j = await getMonthlySavings.json();
   expect(j.amount).toEqual(parseInt(data.amount.replaceAll(" ", "")));
   isPaused ? expect(j.is_paused).toBeTruthy() : expect(j.is_paused).toBeFalsy();
   isWithinFreeze
      ? expect(j.is_within_freeze_period).toBeTruthy()
      : expect(j.is_within_freeze_period).toBeFalsy();
   expect(j.start_month).toEqual(dateMonthYearDigit(customDate ? customDate : null));
   expect(j.withdrawal_account_nbr).toEqual(
      data.savingsAccountNo.replaceAll("-", "").replaceAll(" ", ""),
   );
   expect(j["funds"].length).toEqual(data.funds.length);
}