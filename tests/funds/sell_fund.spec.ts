import { test, expect } from "../../internal/baseTest2";
import * as generalHelpers from "../../internal/general";
import * as coralApi from "../../internal/api/coral_depots_api";
import { DataAddFundToBundle, VerifyBundleTable, addFundToBundle, verifyBundle, verifyReceipt } from "../../internal/funds/sell_fund_helper";
import { chooseEnvTestData } from "../../internal/testdata";

let testData = chooseEnvTestData().sellFunds;

test.describe("Normal user - depot", () => {
   const ssn = testData.ssn;
   let fromAccount = testData.depotAccountNo;
   let fundToSell = "ICA Banken Modig"

   test.use({ ssn: ssn })

   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);

      await page.goto("/min-ekonomi/mitt-fondsparande/salj-fond/");
   });

   test.afterEach(async () => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await coralApi.deleteTodaysOrders(ssn, fromAccount.replaceAll(" ", ""));
   });

   test("Sell 10% of funds", async ({ page }) => {
      const data: DataAddFundToBundle = {
         fromAccount: fromAccount,
         amount: "20",
         fundName: fundToSell,
         amountOfFund: "sälj procent av mitt innehav"
      }
      // await addFundToBundle(page, fromAccount, fundName, "sälj procent av mitt innehav", "10");
      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "lägg till" }).click();

      let verifyData: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            fromAccount: data.fromAccount,
         },
      ];

      await verifyBundle(page, verifyData);
      await page.getByRole("button").filter({ hasText: "godkänn" }).click();
      await verifyReceipt(page, verifyData);
   });

   test("Remove fund from bundle", async ({ page }) => {
      const data: DataAddFundToBundle = {
         fromAccount: fromAccount,
         amount: "20",
         fundName: fundToSell,
         amountOfFund: "sälj procent av mitt innehav"
      }

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "lägg till" }).click();

      let verifyData: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            fromAccount: data.fromAccount,
         },
      ];

      await verifyBundle(page, verifyData);

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Ta bort" }).first().click();

      await expect(page.locator("form")).toBeVisible();
      await expect(page.getByRole("button", { name: "Lägg till" })).toBeVisible();
   });

   test("Add fund to bundle using invalid values", async ({ page }) => {
      await page.getByRole("button").filter({ hasText: "lägg till" }).click();
      await expect(page.getByText("Du behöver ange fond att sälja")).toBeVisible();
   });

   test("I should not be able to sell 100% of fund if i have a ongoing sell order", async ({ page }) => {
      let isin = "SE0004723476"

      const data: DataAddFundToBundle = {
         fromAccount: fromAccount,
         fundName: fundToSell,
         amountOfFund: "Sälj hela mitt innehav"
      }

      await coralApi.sellFund(ssn, data.fromAccount.replaceAll(" ", ""), isin, 10);

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "lägg till" }).click();

      let verifyData: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            fromAccount: data.fromAccount,
         },
      ];

      await verifyBundle(page, verifyData);

      await page.getByRole("button").filter({ hasText: "godkänn" }).click();
      await expect(page.locator("div").filter({ hasText: /^Kontrollera dina ordrar$/ })).toBeVisible();
      await expect(page.getByRole("row", { name: "Inte tillräckliga positioner" })).toBeVisible();
   });
});

test.describe("One Guardian with child", () => {
   const guardianSsn = testData.ssn;
   const childSsn = testData.childSsn;
   const fundToSell = "ICA Banken Modig";

   let fromAccount = testData.childDepotAccountNo;
   let fromAccountClean = fromAccount.replaceAll("-","").replaceAll(" ", "");

   test.use({ ssn: guardianSsn });

   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(guardianSsn, payload);
      await page.goto("/min-ekonomi/mitt-fondsparande/salj-fond/");
   });

   test.afterEach(async () => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(guardianSsn, payload);
      await coralApi.deleteTodaysOrders(guardianSsn, fromAccountClean);
   });

   test("Sell 10% of fund from child account", async ({ page }) => {
      const data: DataAddFundToBundle = {
         fromAccount: fromAccount,
         amount: "20",
         fundName: fundToSell,
         amountOfFund: "sälj procent av mitt innehav"
      }

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "lägg till" }).click();

      let verifyData: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            fromAccount: data.fromAccount,
         },
      ];
      await verifyBundle(page, verifyData);

      await page.getByRole("button").filter({ hasText: "godkänn" }).click();
      await verifyReceipt(page, verifyData);

      await generalHelpers.login(childSsn);

      await coralApi.verifyLastOrderIsOk(guardianSsn, data.fromAccount.replace('-', ''), data.fundName)
      await coralApi.verifyLastOrderIsOk(childSsn, data.fromAccount.replace('-', ''),  data.fundName)
   });

   test.fixme("API - Buy fund using child's ssn", async () => {
      await generalHelpers.login(childSsn)
      const depotId = await coralApi.getDepotId(childSsn, fromAccountClean);
      const isinIcaBankenModig = "SE0004723476";

      let bundle: coralApi.FundsBundlePayload = {
         sellOrders: [
            {
               depotId: depotId,
               isin: isinIcaBankenModig,
               shares: 5
            }
         ] 
      };

      await coralApi.addFundToBundle(childSsn, bundle);
      await coralApi.sellFundInBundle(childSsn, depotId);

      await coralApi.verifyLastOrderIsOk(guardianSsn, fromAccountClean, "ICA Banken Modig", "599");
   });
});

