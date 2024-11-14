import { test, expect } from "../../internal/baseTest2";
import * as helpers from "../../internal/general";
import {
   DataStartMonthlySaving,
   chooseDepotAccount,
   chooseFunds,
   chooseFundsPercentage,
   deleteMonthlySavings,
   monthlySavingsDetails,
   verifyReceipt,
   isNoMonthlySavings,
   verifyMonthlySavingStartedApi,
} from "../../internal/funds/monthly_savings_helpers";
import { chooseEnvTestData } from "../../internal/testdata";
import { MonthlySavingsCreatePayload, getMonthlySavingsGet, postMonthlySavingsCreate } from "../../internal/api/mfbank_api";


let testData = chooseEnvTestData().monthlySavings;

test.use({ ssn: testData.ssn});

let todaysDate = new Date().getDate();

test.beforeEach(async ({ page }) => {
   await page.goto("/min-ekonomi/mitt-fondsparande/manadssparande/");
   await page.waitForLoadState("networkidle")
   // Delete monthly savings before each test if date is before 22nd
   if (todaysDate < 22) {
      if (await isNoMonthlySavings(page)) {
         await page.getByRole("link", { name: "Starta månadssparande" }).click();
      } else {
         await deleteMonthlySavings(page);
         await page.getByRole("link", { name: "Starta månadssparande" }).click();
      }
      await page.waitForURL("**\/manadssparande\/starta-manadssparande\/")
   }
});

// test.skip("If date is between 25th and last date I should not be able to edit or delete monthly saving", async ({ page }) => {});

if (todaysDate < 22) {
   test.describe("Start monthly saving - depot", () => {
      let data: DataStartMonthlySaving = {
         amount: "1 000",
         depotAccountNo: testData.depotAccountNo,
         funds: [
            {
               name: "Ica banken måttlig",
               percantage: "100",
            },
         ],
         savingsAccountNo: testData.savingsAccountNo,
         startMonth: helpers.dateMonthYear(),
      };

      test("Start monthly savings", async ({ page }) => {
         await chooseDepotAccount(page, data.depotAccountNo);

         await monthlySavingsDetails(page, data);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFunds(page, data.funds);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFundsPercentage(page, data.funds);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, data);

         await verifyMonthlySavingStartedApi(testData.ssn, data, false, false);
      });

      test("Delete monthly savings", async ({ page }) => {
         await chooseDepotAccount(page, data.depotAccountNo);

         await monthlySavingsDetails(page, data);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFunds(page, data.funds);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFundsPercentage(page, data.funds);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, data);

         await page.goto("/min-ekonomi/mitt-fondsparande/manadssparande/");

         await deleteMonthlySavings(page);

         await expect(page.getByRole("link", { name: "Starta månadssparande" })).toBeVisible();
         let getMonthlySavings = await getMonthlySavingsGet(
            testData.ssn,
            data.depotAccountNo.replaceAll(" ", ""),
         );
         expect(getMonthlySavings.status()).toEqual(204);
         expect(await getMonthlySavings.text()).toEqual("");
      });

      test("Edit monthly saving", async ({ page }) => {
         await chooseDepotAccount(page, data.depotAccountNo);

         await monthlySavingsDetails(page, data);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFunds(page, data.funds);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFundsPercentage(page, data.funds);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, data);

         await page.goto("/min-ekonomi/mitt-fondsparande/manadssparande/");
         await page
            .locator("tbody")
            .locator("tr")
            .filter({ hasText: data.depotAccountNo })
            .locator("button")
            .click({ timeout: 20000 });

         await page.locator("td").getByRole("link").filter({ hasText: "ändra" }).click();
         await expect(page.locator("h1")).toContainText("Ändra månadssparande");
         await expect(page.locator("h3").first()).toContainText(
            `Fondsparande depå, ${data.depotAccountNo}`,
         );

         let dataO: DataStartMonthlySaving = {
            ...data,
            amount: "777",
         };
         await page.getByRole("textbox").fill(dataO.amount);
         await page.getByRole("button", { name: "Godkänn" }).click();

         await verifyMonthlySavingStartedApi(testData.ssn, dataO, false, false);
      });

      test("Pause monthly saving", async ({ page }) => {
         // Create a monthly saving using api
         let datePauseFrom = helpers.dateMonthYear();
         let datePauseTo = helpers.dateMonthYear();

         let icaRanteFondIsin = "SE0021147998";
         let createPayload: MonthlySavingsCreatePayload = {
            amount: 900,
            depot_id: testData.depotAccountNo.replaceAll(" ", ""),
            funds: [{ isin: icaRanteFondIsin, percentage: 100 }],
            start_month: helpers.dateMonthYearDigit(),
            withdrawal_account_nbr: testData.savingsAccountNo
               .replaceAll("-", "")
               .replaceAll(" ", ""),
         };
         let monthlySavingsCreate = await postMonthlySavingsCreate(testData.ssn, createPayload);
         expect(monthlySavingsCreate).toBeOK();

         // Edit monthly saving
         await page.goto("/min-ekonomi/mitt-fondsparande/manadssparande/");
         await page.locator("tbody").getByRole("button").click();
         await page.getByRole("link", { name: "ändra" }).click();

         await expect(page.getByRole("heading", { name: "till Fondsparande" })).toContainText(
            testData.depotAccountNo,
         );
         await page.locator("label").filter({ hasText: "Gör uppehåll" }).click();
         await page.getByTestId("pauseFromMonth").click();
         await page.getByTestId("pauseFromMonth").locator("li", { hasText: datePauseFrom }).click();

         await page.getByTestId("pauseToMonth").click();
         await page.getByTestId("pauseToMonth").locator("li", { hasText: datePauseTo }).click();
         await page.getByRole("button", { name: "Godkänn" }).click();

         // await verifyMonthlySavingStartedApi(data, true, false)
         let getMonthlySavings = await getMonthlySavingsGet(
            testData.ssn,
            data.depotAccountNo.replaceAll(" ", ""),
         );
         let j = await getMonthlySavings.json();

         expect(getMonthlySavings.status()).toEqual(200);
         expect(j).toHaveProperty("pause_from_month", helpers.dateMonthYearDigit());
         expect(j).toHaveProperty("pause_from_month", helpers.dateMonthYearDigit());
      });
   });

   test.describe("Start monthly saving - ISK", () => {
      let data: DataStartMonthlySaving = {
         amount: "1 000",
         depotAccountNo: testData.iskAccountNo,
         funds: [
            {
               name: "Ica banken måttlig",
               percantage: "100",
            },
         ],
         savingsAccountNo: testData.savingsAccountNo,
         startMonth: helpers.dateMonthYear(),
      };

      test("Start monthly saving", async ({ page }) => {
         await chooseDepotAccount(page, data.depotAccountNo);

         await monthlySavingsDetails(page, data);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFunds(page, data.funds);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFundsPercentage(page, data.funds);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, data);
         await page.waitForTimeout(10_000);
         await verifyMonthlySavingStartedApi(testData.ssn, data, false, false);
      });
   });

   test.describe("Start monthly saving child - ISK", () => {
      let data: DataStartMonthlySaving = {
         amount: "1 000",
         depotAccountNo: testData.childIskAccountNo,
         funds: [
            {
               name: "Ica banken modig",
               percantage: "100",
            },
         ],
         savingsAccountNo: testData.childSavingsAccountNo,
         startMonth: helpers.dateMonthYear(),
      };

      test("Start monthly savings for child", async ({ page }) => {
         await chooseDepotAccount(page, data.depotAccountNo);

         await monthlySavingsDetails(page, data);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFunds(page, data.funds);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFundsPercentage(page, data.funds);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, data);

         await verifyMonthlySavingStartedApi(testData.ssn, data, false, false);
      });
   });

   test.describe("Start monthly saving child - depot", () => {
      let data: DataStartMonthlySaving = {
         amount: "1 000",
         depotAccountNo: testData.childDepotAccountNo,
         funds: [
            {
               name: "Ica banken modig",
               percantage: "100",
            },
         ],
         savingsAccountNo: testData.childSavingsAccountNo,
         startMonth: helpers.dateMonthYear(),
      };

      test("Start monthly savings for child", async ({ page }) => {
         await chooseDepotAccount(page, data.depotAccountNo);

         await monthlySavingsDetails(page, data);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFunds(page, data.funds);
         await page.getByRole("button", { name: "Nästa" }).click();

         await chooseFundsPercentage(page, data.funds);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, data);
         await verifyMonthlySavingStartedApi(testData.ssn, data, false, false);
      });
   });
} else {
   console.log("[i] Not running some monthly savings tests because of freeze period")
}


