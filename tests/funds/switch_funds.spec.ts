
import { test, expect } from "../../internal/baseTest2";
import * as generalHelpers from "../../internal/general";
import * as coralApi from "../../internal/api/coral_depots_api";
import { VerifyBundleTable, addFundToBundle, selectFundInTable, verifyBundle } from "../../internal/funds/buy_fund_helpers";
import { verifyLastOrderIsOk } from "../../internal/api/coral_depots_api";
import { chooseEnvTestData } from "../../internal/testdata";
import { Page } from "playwright";


let testData = chooseEnvTestData().switchFunds

test.describe("Normal user over 18 - Depot", () => {
   const ssn = testData.ssn;

   let depotAccountNo = testData.depotAccountNo;
   let depotAccountNoClean = depotAccountNo.replaceAll(" ","")

   test.use({ ssn: ssn });

   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await page.goto("/min-ekonomi/mitt-fondsparande/byt-fond/");
   });

   test.afterEach(async () => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await coralApi.deleteTodaysOrders(ssn, depotAccountNoClean);
   });

   test("Switch one fund to another", async ({ page }) => {
      let fundFrom = "Ica banken modig";
      let fundTo = "AMF Räntefond Lång";

      await chooseDepotAccount(page, depotAccountNo) 
      await chooseFundToSwitchFrom(page, depotAccountNo, fundFrom)

      await amountOfFundToSwitch(page, depotAccountNo);
      await page.getByRole("button", { name: "Välj fonder att byta till" }).click();

      await chooseFundToSwitchTo(page, fundTo)
      await page.getByRole("button", { name: "Nästa" }).click();

      await page.getByRole("button", { name: "Godkänn" }).click();
      await expect(
         page.getByRole("heading", { name: "Din bytesorder har tagits emot" }),
      ).toBeVisible();
   });  
});

async function chooseDepotAccount(page: Page, depotAccountNo: string) {
   await expect(page.getByRole('heading', { name: 'Välj fondkonto' })).toBeVisible();
   await page
      .locator(`xpath=//div[contains(@class, 'select-depot_depotCard')]`)
      .filter({ hasText: depotAccountNo })
      .getByRole("button", { name: "Välj" })
      .click();
}

async function chooseFundToSwitchFrom(page: Page, depotAccountNo: string, fundName: string) {
   await expect(page.getByRole("heading", { name: "Välj fond att byta från" })).toBeVisible();
   await expect(
      page.getByRole("heading", { name: "Fondsparande depå, " + depotAccountNo }),
   ).toBeVisible({ timeout: 10_000 });
   await page
      .locator('xpath=//div[contains(@class, "from-fund-card_fundCard")]')
      .filter({ hasText: fundName })
      .getByRole("button", { name: "Välj" })
      .click();
}

async function amountOfFundToSwitch(page: Page, depotAccountNo: string) {
   await expect(page.getByRole("heading", { name: "Fond som ska bytas" })).toBeVisible({
      timeout: 10_000,
   });

   await expect(page.getByRole("heading", { name: "ICA BANKEN MODIG" })).toBeVisible();
   await expect(page.getByText(`i Fondsparande depå, ${depotAccountNo}`)).toBeVisible();

   await page
      .getByTestId("typeOfTrade")
      .locator("label")
      .filter({ hasText: "Byt hela innehavet" })
      .click();
}

async function chooseFundToSwitchTo(page: Page, fundName: string) {
   await expect(page.getByRole("heading", { name: "välj fonder att byta till" })).toBeVisible();
   await page.getByRole("button").filter({ hasText: "Visa alla" }).click();
   await page
      .locator("tbody")
      .getByRole("row")
      .filter({ hasText: fundName })
      .getByRole("button")
      .filter({ hasText: "Välj" })
      .click();
}

// async function verifyBeforeSwitch(page: Page) {}
// async function verifyReceipt(page: Page) {}