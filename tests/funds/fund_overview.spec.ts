import { test, expect } from "../../internal/baseTest2";
import * as generalHelpers from "../../internal/general";
import * as coralApi from "../../internal/api/coral_depots_api";
import { verifyOrdersInTable } from "../../internal/funds/fund_helpers";
import { chooseEnvTestData } from "../../internal/testdata";
import { cancelTodaysLastOrder, chooseDepotAccount, verifyOrderIsCanceled } from "../../internal/funds/fund_overview_helpers";

let testData = chooseEnvTestData().fundOverview;

test.describe("Normal user over 18 Yo", () => {
   const ssn = testData.ssn;
   const depotAccountNo = testData.depotAccountNo
   const depotAccountNoClean = depotAccountNo.replaceAll(" ", "").replaceAll("-","")
   const fund = "ICA Banken Modig"
   const isin = "SE0004723476";

   test.use({ ssn: ssn });

   test.beforeEach(async ({ page }) => {
      await page.goto("/min-ekonomi/mitt-fondsparande/");

      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await expect(page.getByRole("heading", { name: "Mitt fondsparande" })).toBeVisible({ timeout: 60_000 });
   });

   test.afterEach(async () => {
      await coralApi.deleteTodaysOrders(ssn, depotAccountNoClean);
   });

   test("Verify content on page", { tag: "@functional" }, async ({ page }) => {
      await expect(page.getByRole("link", { name: "Köp fond" }).nth(1)).toBeVisible();
      await expect(page.getByRole("link", { name: "Byt fond" }).nth(1)).toBeVisible();
      await expect(page.getByRole("link", { name: "sälj fond" }).nth(1)).toBeVisible();
      await expect(page.getByRole("link", { name: "Månadssparande" }).nth(1)).toBeVisible();
      await expect(page.getByRole("table")).toBeVisible();

      await expect(page.getByRole("button", { name: "mina fonder" })).toBeVisible();
      await expect(page.getByRole("button", { name: "pågående ordrar" })).toBeVisible();
      await expect(page.getByRole("button", { name: "transaktioner" })).toBeVisible();
      await expect(
         page.getByRole("button", { name: "Realiserade vinster och förluster" }),
      ).toBeVisible();
      await expect(
         page.locator('xpath=//div[contains(@class, "depot-info-card_infoCard")]').first(),
      ).toBeVisible();
   });

   test("Bought fund should be visible in orders", { tag: "@integration" }, async ({ page }) => {
      await coralApi.buyFund(ssn, depotAccountNoClean, testData.savingsAccountNo, isin, 1000);
      await page.reload();

      await chooseDepotAccount(page, depotAccountNo);

      await page.getByRole("button", { name: "pågående ordrar" }).click();
      await verifyOrdersInTable(page, fund, "1 000,00 kr", "Köp", "Behandlas");
   });

   test("Sold fund should be visible in orders", { tag: "@integration" }, async ({ page }) => {
      await coralApi.sellFund(ssn, depotAccountNoClean, isin, 2);
      await page.reload();

      await chooseDepotAccount(page, depotAccountNo);
      await page.getByRole("button", { name: "pågående ordrar" }).click({ timeout: 60_000 });

      await verifyOrdersInTable(page, fund, "Sälj", "2,00", "Behandlas");
   });

   test("Cancel buy order", { tag: "@integration" }, async ({ page }) => {
      await coralApi.buyFund(ssn, depotAccountNoClean, testData.savingsAccountNo, isin, 1000);
      await page.reload();

      await chooseDepotAccount(page, depotAccountNo);

      // click on orders tab an verify order is there
      await page.getByRole("button", { name: "pågående ordrar" }).click();
      await verifyOrdersInTable(page, fund, "1 000,00 kr", "Köp", "Behandlas");

      // Cancel todays order
      await cancelTodaysLastOrder(page, fund);

      // verify order is gone
      await page.waitForTimeout(1000);
      await verifyOrderIsCanceled(page, fund);
   });

   test("Cancel sell order", { tag: "@integration" }, async ({ page }) => {
      await coralApi.sellFund(ssn, depotAccountNoClean, isin, 2);
      await page.reload();

      // select depot account funds are in
      await chooseDepotAccount(page, depotAccountNo);

      // click on orders tab an verify order is there
      await page.getByRole("button", { name: "pågående ordrar" }).click();
      await verifyOrdersInTable(page, fund, "Sälj", "2,00", "Behandlas");

      await cancelTodaysLastOrder(page, fund);

      // verify order is gone
      await page.waitForTimeout(1500);
      await verifyOrderIsCanceled(page, fund);
   });
});

test.describe("Child account", () => {
   const childSsn = testData.childSsn;

   test.use({ ssn: childSsn })
   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(childSsn, payload);
   });

   test(
      "Verify that buy,sell,switch funds buttons are disabled and sidebar list not contains links",
      { tag: "@functional" },
      async ({ page }) => {
         await page.goto("/min-ekonomi/mitt-fondsparande/");
         await page.waitForLoadState("networkidle");
         await expect(page.getByRole("button", { name: "Köp fond" })).toBeDisabled();
         await expect(page.getByRole("button", { name: "Byt fond" })).toBeDisabled();
         await expect(page.getByRole("button", { name: "sälj fond" })).toBeDisabled();
         await expect(page.getByRole("link", { name: "Månadssparande" }).nth(1)).not.toBeDisabled();
      },
   );

   test("Navigate to diabled urls directly", { tag: "@functional" }, async ({ page }) => {
      await page.goto("/min-ekonomi/mitt-fondsparande/kop-fond/");
      await expect(page.getByRole("heading").first()).toHaveText("Ej behörig");
      await page.goto("/min-ekonomi/mitt-fondsparande/salj-fond/");
      await expect(page.getByRole("heading").first()).toHaveText("Ej behörig");
      await page.goto("/min-ekonomi/mitt-fondsparande/byt-fond/");
      await expect(page.getByRole("heading").first()).toHaveText("Ej behörig");
      await page.goto("/min-ekonomi/mitt-fondsparande/flytta-fond/");
      await expect(page.getByRole("heading").first()).toHaveText("Oops... Här tog det visst stopp");
   });
});