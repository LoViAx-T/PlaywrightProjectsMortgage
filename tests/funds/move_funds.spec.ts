// import { test, expect, Page } from "@playwright/test";
import { test, expect } from "../../internal/baseTest2";
import * as generalHelpers from "../../internal/general";
import { IVerifyMove, accountDetails, chooseAccountToTransferTo, chooseFund, chooseInstitute, verifyMove } from "../../internal/funds/move_funds_helpers";

const ssn = "197604235502";
test.use({ ssn: ssn })

test.describe("Normal user over 18 Yo", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/min-ekonomi/mitt-fondsparande/flytta-fonder/");
      await expect(page.getByRole("heading")).toContainText("Flytta fonder till ICA Banken");
   });

   test("Move fund to ICA Banken using depot, fund with form", async ({ page }) => {
      let toAccount: string = "Fondsparande ISK";
      // Välj konto för fondsparande
      await chooseAccountToTransferTo(page, toAccount);
      await page.getByRole("button", { name: "Vidare" }).click();
      await page.getByRole("link").filter({ hasText: "den här blanketten" }).click({ timeout: 10000 });
      // Välj institut
      await expect(page).toHaveURL(`https://${process.env.ENV}.cms.icabanken.se/globalassets/pdf/blankett-fondflytt-till-icabanken-isk.pdf`);
   });

   test("Move fund to ICA Banken using depot with form", async ({ page }) => {
      let toAccount: string = "Fondsparande depå";
      let institute: string = "Aktie-ansvar";
      // Välj konto för fondsparande
      await chooseAccountToTransferTo(page, toAccount);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj institut
      await chooseInstitute(page, institute);
      await page.getByRole("button", { name: "Vidare" }).click();
      await page.getByRole("link").filter({ hasText: "den här blanketten" }).click({ timeout: 10000 });
      await expect(page).toHaveURL(`https://${process.env.ENV}.cms.icabanken.se/globalassets/pdf/blankett-fondflytt-till-icabanken-depa.pdf`);
   });

   test("Move fund to ICA Banken using depot", async ({ page }) => {
      let data: IVerifyMove = {
         fundNames: ["Aktie-Ansvar Sverige"],
         institute: "Avanza Bank",
         depotNo: "123123123",
         toAccount: "Fondsparande depå",
      };
      // Välj konto för fondsparande
      await chooseAccountToTransferTo(page, data.toAccount);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj institut
      await chooseInstitute(page, data.institute);
      await page.getByRole("button", { name: "Vidare" }).click();

      // Kontouppgifter
      await accountDetails(page, data.institute, data.depotNo);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj fond
      await chooseFund(page, data.fundNames[0]);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Fonder jag vill flytta
      await verifyMove(page, data);
      await page.getByRole("button", { name: "Godkänn" }).click();
      await expect(
         page
            .locator("div")
            .filter({ hasText: /^Tack för din ansökan!$/ })
            .first(),
      ).toBeVisible();
   });

   test("Move fund to ICA Banken, remove choosen fund from list", async ({ page }) => {
      let data: IVerifyMove = {
         fundNames: ["Aktie-Ansvar Sverige"],
         institute: "Avanza Bank",
         depotNo: "123123123",
         toAccount: "Fondsparande depå",
      };
      // Välj konto för fondsparande
      await chooseAccountToTransferTo(page, data.toAccount);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj institut
      await chooseInstitute(page, data.institute);
      await page.getByRole("button", { name: "Vidare" }).click();

      // Kontouppgifter
      await accountDetails(page, data.institute, data.depotNo);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj fond
      await chooseFund(page, data.fundNames[0]);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Fonder jag vill flytta
      await verifyMove(page, data);
      // delete fund from list
      await page.locator("dl").getByRole("button").click();
      await expect(page.getByRole("button", { name: "Godkänn" })).toBeDisabled();
   });

   test("Move funds to ICA Banken, add more funds to move", async ({ page }) => {
      let data: IVerifyMove = {
         fundNames: ["Aktie-Ansvar Sverige", "AMF Aktiefond sverige"],
         institute: "Avanza Bank",
         depotNo: "123123123",
         toAccount: "Fondsparande depå",
      };
      // Välj konto för fondsparande
      await chooseAccountToTransferTo(page, data.toAccount);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj institut
      await chooseInstitute(page, data.institute);
      await page.getByRole("button", { name: "Vidare" }).click();

      // Kontouppgifter
      await accountDetails(page, data.institute, data.depotNo);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj fond
      await chooseFund(page, data.fundNames[0]);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Fonder jag vill flytta
      await page.getByRole("button").filter({ hasText: "lägg till fler fonder att flytta" }).click();
      await chooseFund(page, data.fundNames[1]);
      await page.getByRole("button", { name: "Vidare" }).click();

      await page.getByRole("button", { name: "Godkänn" }).click();
      await expect(
         page
            .locator("div")
            .filter({ hasText: /^Tack för din ansökan!$/ })
            .first(),
      ).toBeVisible();
   });

   test("Move funds to ICA Banken, remove multiple funds from list", async ({ page }) => {
      let data: IVerifyMove = {
         fundNames: ["Aktie-Ansvar Sverige", "AMF Aktiefond sverige"],
         institute: "Avanza Bank",
         depotNo: "123123123",
         toAccount: "Fondsparande depå",
      };
      // Välj konto för fondsparande
      await chooseAccountToTransferTo(page, data.toAccount);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj institut
      await chooseInstitute(page, data.institute);
      await page.getByRole("button", { name: "Vidare" }).click();

      // Kontouppgifter
      await accountDetails(page, data.institute, data.depotNo);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Välj fond
      await chooseFund(page, data.fundNames[0]);
      await page.getByRole("button", { name: "Vidare" }).click();
      // Fonder jag vill flytta
      await page.getByRole("button").filter({ hasText: "lägg till fler fonder att flytta" }).click();
      await chooseFund(page, data.fundNames[1]);
      await page.getByRole("button", { name: "Vidare" }).click();
      // remove element from list
      await page.locator("dl").first().locator('dt:text("aktie-ansvar sverige") + dd > button').click();
      await expect(
         page.locator("dl").first().locator("dt").filter({ hasText: "aktie-ansvar sverige" }),
      ).not.toBeVisible();
   });
});
