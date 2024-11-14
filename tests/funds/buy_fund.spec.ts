import { test, expect } from "../../internal/baseTest2";
import * as generalHelpers from "../../internal/general";
import * as coralApi from "../../internal/api/coral_depots_api";
import {VerifyBundleTable, addFundToBundle, selectFundInTable, verifyBundle, verifyReceipt, DataAddFundToBundle} from "../../internal/funds/buy_fund_helpers";
import { verifyLastOrderIsOk } from "../../internal/api/coral_depots_api";
import { chooseEnvTestData } from "../../internal/testdata";

const testData = chooseEnvTestData().buyFunds;

test.describe("User over 18 - depot", () => {
   const ssn = testData.ssn;
   let depotAccount = testData.depotAccountNo;

   test.use({ ssn: testData.ssn });

   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);

      await page.goto("/min-ekonomi/mitt-fondsparande/kop-fond/");
   });

   test.afterEach(async () => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await coralApi.deleteTodaysOrders(ssn, depotAccount.replaceAll(" ", ""));
   });

   test(
      "Buy fund using depot with money in ISK account should not be possible",
      { tag: "@functional" },
      async ({ page }) => {
         let fundName = "ICA Banken Modig";

         const data: DataAddFundToBundle = {
            fundName: fundName,
            fromAccount: testData.iskAccountNo,
            toAccount: depotAccount,
            amount: "999",
         };

         await selectFundInTable(page, fundName);
         await addFundToBundle(page, data);

         await page.getByRole("button").filter({ hasText: "Lägg till" }).click();
         await expect(
            page.getByText(
               "Du kan inte dra pengar från ett annat fondkonto än det fondkonto som du köper fonden till",
            ),
         ).toBeVisible();
      },
   );

   test("Add fund to bundle using invalid amount", { tag: "@functional" }, async ({ page }) => {
      let fundName = "Ica banken modig";

      const data: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: depotAccount,
         toAccount: depotAccount,
         amount: "",
      };
      await selectFundInTable(page, fundName);
      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();
      await expect(page.getByText("Denna fond har ett minsta köpbelopp på")).toBeVisible();
   });

   test("Add fund to bundle using no valid values", { tag: "@functional" }, async ({ page }) => {
      let fundName = "Ica banken modig";

      await selectFundInTable(page, fundName);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      await expect(page.getByText("Denna fond har ett minsta köpbelopp på")).toBeVisible();
      await expect(page.getByText("Du behöver ange till fondsparande.")).toBeVisible();
      await expect(page.getByText("Du behöver ange ett värde för detta fält")).toBeVisible();
   });

   test("Calculate estimated cost for a fund", { tag: "@functional" }, async ({ page }) => {
      let fundName = "Ica banken modig";

      const data: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: depotAccount,
         toAccount: depotAccount,
         amount: "500",
      };

      await selectFundInTable(page, fundName);
      await addFundToBundle(page, data);

      await page.getByRole("button", { name: "Se beräknade kostnader" }).click();
      await expect(
         page
         .locator("div")
         .filter({
            hasText:
               /^Något gick fel\. Var god försök igen eller kom tillbaka om några minuter\.$/,
         })
         .nth(2),
      ).not.toBeVisible();
      await expect(
         page.locator("#backdrop").getByRole("heading", { name: fundName }),
      ).toBeVisible();
   });

   test("Remove a fund from bundle", { tag: "@functional" }, async ({ page }) => {
      let fundName = "Ica banken modig";

      const data: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: testData.savingsAccountNo,
         toAccount: depotAccount,
         amount: "777",
      };

      await selectFundInTable(page, fundName);
      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "Ta bort" }).first().click();
      await expect(page.getByRole("table")).toContainText("Köp");
   });

   test("Buy fund using depot", { tag: "@integration" }, async ({ page }) => {
      const data: DataAddFundToBundle = {
         fundName: "ICA Banken Modig",
         fromAccount: testData.savingsAccountNo,
         // fromAccount: depotAccount,
         toAccount: depotAccount,
         amount: "500",
      };

      await selectFundInTable(page, data.fundName);

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      // verify orders in bundle
      let verify: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            toAccount: data.toAccount,
            fromAccount: data.fromAccount,
            amount: data.amount,
         },
      ];

      await verifyBundle(page, verify);

      await page.getByRole("button").filter({ hasText: "Godkänn" }).click();
      await verifyReceipt(page, verify);

      await verifyLastOrderIsOk(
         ssn,
         depotAccount.replaceAll(" ", "").replaceAll("-", ""),
         data.fundName,
         data.amount,
      );
   });

   test("Buy multiple funds using depot", { tag: "@integration" }, async ({ page }) => {
      let fundName = "ICA Banken Modig";
      let fundName2 = "ICA Banken Varlig";

      const data1: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: testData.savingsAccountNo,
         toAccount: depotAccount,
         amount: "400",
      };

      const data2: DataAddFundToBundle = {
         fundName: fundName2,
         fromAccount: testData.savingsAccountNo,
         toAccount: depotAccount,
         amount: "500",
      };

      await selectFundInTable(page, fundName);

      await addFundToBundle(page, data1);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      await page.getByRole("button").filter({ hasText: "Lägg till fler fonder att köpa" }).click();
      await selectFundInTable(page, fundName2);
      await addFundToBundle(page, data2);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      // verify orders in bundle
      let verify: VerifyBundleTable[] = [
         {
            fundName: data1.fundName,
            toAccount: data1.toAccount,
            fromAccount: data1.fromAccount,
            amount: data1.amount,
         },
         {
            fundName: data2.fundName,
            toAccount: data2.toAccount,
            fromAccount: data2.fromAccount,
            amount: data2.amount,
         },
      ];

      await verifyBundle(page, verify);

      await page.getByRole("button").filter({ hasText: "Godkänn" }).click();
      await verifyReceipt(page, verify);

      // verify that bought funds are visible in orders
      await page.waitForTimeout(5000);
      let orders = await coralApi.getOrders(ssn, depotAccount.replaceAll(" ", ""), 500);
      let ordersCount = orders["orders"].length;
      let lastOrder = orders["orders"][ordersCount - 1];
      let secondLastOrder = orders["orders"][ordersCount - 2];

      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ fundName: fundName }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ totalAmount: parseInt(data1.amount) }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ isCancelable: true }),
      );

      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ fundName: fundName2 }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ totalAmount: parseInt(data2.amount) }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ isCancelable: true }),
      );
   });

   test(
      "Add same fund to bundle multiple times and buy",
      { tag: "@integration" },
      async ({ page }) => {
         let fundName = "ICA Banken Modig";

         const data: DataAddFundToBundle = {
            fundName: fundName,
            fromAccount: testData.savingsAccountNo,
            toAccount: depotAccount,
            amount: "250",
         };
         await selectFundInTable(page, fundName);
         await addFundToBundle(page, data);
         await page.getByRole("button").filter({ hasText: "Lägg till" }).click();
         await page.getByRole("button", { name: "Lägg till fler fonder att köpa" }).click();

         await selectFundInTable(page, fundName);
         await addFundToBundle(page, data);
         await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

         // verify orders in bundle
         let verify: VerifyBundleTable[] = [
            {
               fundName: data.fundName,
               toAccount: data.toAccount,
               fromAccount: data.fromAccount,
               amount: (parseInt(data.amount) * 2).toString(),
            },
         ];
         await verifyBundle(page, verify);
         await page.getByRole("button").filter({ hasText: "Godkänn" }).click();

         await verifyReceipt(page, verify);

         await verifyLastOrderIsOk(
            ssn,
            data.toAccount,
            data.fundName,
            (parseInt(data.amount) * 2).toString(),
         );
      },
   );
});

test.describe("User over 18 - ISK", () => {
   const ssn = testData.ssn;
   let toAccount = testData.iskAccountNo;

   test.use({ ssn: ssn });

   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await page.goto("/min-ekonomi/mitt-fondsparande/kop-fond/");
   });

   test.afterEach(async () => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(ssn, payload);
      await coralApi.deleteTodaysOrders(ssn, toAccount.replaceAll("-", ""));
   });

   test("Buy fund ISK using money in depot account should not be possible", { tag: "@functional" }, async ({ page }) => {
      let fundName = "ICA Banken Modig";

      const data: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: testData.depotAccountNo,
         toAccount: toAccount,
         amount: "999",
      };

      await selectFundInTable(page, fundName);

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();
      await expect(
         page.getByText("Du kan inte dra pengar från ett annat fondkonto än det fondkonto som du köper fonden till."),
      ).toBeVisible();
   });

   test("Buy fund using ISK", { tag: "@integration" }, async ({ page }) => {
      let fundName = "ICA Banken Modig";

      const data: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: testData.savingsAccountNo,
         toAccount: toAccount,
         amount: "999",
      };

      await selectFundInTable(page, fundName);

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      // verify orders in bundle
      let verify: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            toAccount: data.toAccount,
            fromAccount: data.fromAccount,
            amount: data.amount,
         },
      ];
      await verifyBundle(page, verify);

      await page.getByRole("button").filter({ hasText: "Godkänn" }).click();
      await verifyReceipt(page, verify);

      await verifyLastOrderIsOk(ssn, toAccount, data.fundName, data.amount);
   });

   test("Buy multiple funds using ISK", { tag: "@integration" }, async ({ page }) => {
      let fundName = "ICA Banken Modig";
      let fundName2 = "ICA Banken Varlig";

      const data1: DataAddFundToBundle = {
         fundName: fundName,
         fromAccount: testData.savingsAccountNo,
         toAccount: toAccount,
         amount: "999",
      };

      const data2: DataAddFundToBundle = {
         fundName: fundName2,
         fromAccount: testData.savingsAccountNo,
         toAccount: toAccount,
         amount: "555",
      };

      await selectFundInTable(page, fundName);

      await addFundToBundle(page, data1);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();
      await page.getByRole("button").filter({ hasText: "Lägg till fler fonder att köpa" }).click();

      await selectFundInTable(page, fundName2);
      await addFundToBundle(page, data2);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();

      // verify orders in bundle
      let verify: VerifyBundleTable[] = [
         {
            fundName: data1.fundName,
            toAccount: data1.toAccount,
            fromAccount: data1.fromAccount,
            amount: data1.amount,
         },
         {
            fundName: data2.fundName,
            toAccount: data2.toAccount,
            fromAccount: data2.fromAccount,
            amount: data2.amount,
         },
      ];

      await verifyBundle(page, verify);

      await page.getByRole("button").filter({ hasText: "Godkänn" }).click();
      await verifyReceipt(page, verify);

      // verify that bought funds are visible in orders
      await page.waitForTimeout(5000);
      let orders = await coralApi.getOrders(ssn, toAccount.replaceAll("-", ""), 500);
      let ordersCount = orders["orders"].length;
      let lastOrder = orders["orders"][ordersCount - 1];
      let secondLastOrder = orders["orders"][ordersCount - 2];
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ fundName: fundName }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ totalAmount: parseInt(data1.amount) }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ isCancelable: true }),
      );

      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ fundName: fundName2 }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ totalAmount: parseInt(data2.amount) }),
      );
      expect([lastOrder, secondLastOrder]).toContainEqual(
         expect.objectContaining({ isCancelable: true }),
      );
   });
});

test.describe("One guardian with child", () => {
   const guardianSsn = testData.ssn;
   const childSsn = testData.childSsn;

   const data: DataAddFundToBundle = {
      fundName: "JAPAN TEMA",
      fromAccount: testData.savingsAccountNo,
      toAccount:  testData.childIskAccountNo,
      amount: "999",
   };

   let toAccountClean = data.toAccount.replaceAll("-","").replaceAll(" ", "")
   let fromAccountClean = data.fromAccount.replaceAll("-","").replaceAll(" ","")


   test.use({ ssn: guardianSsn })

   test.beforeEach(async ({ page }) => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(guardianSsn, payload);

      await page.goto("/min-ekonomi/mitt-fondsparande/kop-fond/");
   });

   test.afterEach(async () => {
      const payload: coralApi.BundleDeletePayload = {
         deleteAll: true,
      };
      await coralApi.deleteBundle(guardianSsn, payload);
      await coralApi.deleteTodaysOrders(guardianSsn, toAccountClean);
   });

   test("Buy fund to child's ISK account", { tag: "@integration" }, async ({ page }) => {
      await selectFundInTable(page, data.fundName);

      await addFundToBundle(page, data);
      await page.getByRole("button").filter({ hasText: "Lägg till" }).click();
      // verify orders in bundle
      let verify: VerifyBundleTable[] = [
         {
            fundName: data.fundName,
            toAccount: data.toAccount,
            fromAccount: data.fromAccount,
            amount: data.amount,
         },
      ];

      await verifyBundle(page, verify);

      await page.getByRole("button").filter({ hasText: "Godkänn" }).click();
      await verifyReceipt(page, verify);

      await generalHelpers.login(childSsn);
      // verify that guardian and child can see childs/parents order
      await verifyLastOrderIsOk(guardianSsn, toAccountClean, "SHB Japan Tema", data.amount);
      await verifyLastOrderIsOk(childSsn, toAccountClean, "SHB Japan Tema", data.amount);
   });  

   test.fixme("API - Buy fund using child's ssn", async () => {

      const guardianDepotId = await coralApi.getDepotId(childSsn, toAccountClean);
      const isinIcaBankenModig = "SE0004723476";

      let bundle: coralApi.FundsBundlePayload = {
         buyOrders: [
            {
               isin: isinIcaBankenModig,
               amount: 599,
               fromAccountNbr: fromAccountClean,
               depotId: guardianDepotId,
            },
         ],
      };

      await coralApi.addFundToBundle(childSsn, bundle);
      await coralApi.buyFundInBundle(childSsn, guardianDepotId, fromAccountClean);

      await coralApi.verifyLastOrderIsOk(childSsn, toAccountClean, "ICA Banken Modig", "599");
   });
});
