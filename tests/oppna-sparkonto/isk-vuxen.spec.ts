import { test, expect } from "../../internal/baseTest2";
import { AdultStep1DataPersonUppgifter, clickContinueButton, openSavingsAdultStep1 } from "../../internal/oppna-sparkonto/open-savings-account";


const step1Data: AdultStep1DataPersonUppgifter = {
   mobileNbr: "0704411258",
   email: "ralf@ica.se",
   occupation: "tillsvidareanställning",
   monthlyIncome: "26000",
   citizenships: ["sverige"],
   taxResidences: ["sverige"],
   countryOfResidence: "sverige",
   pep: "ingen av dessa"
}

test.beforeEach(async ({ page }) => {
   await page.goto("/spara/fondlista/oppna-isk/")
});

test.describe("Normal user", () => {
   const ssn = "195902170074";
   test.use({ ssn: ssn })

   test("Verify header", async ({ page }) => {
      await expect(page.getByRole("heading").first()).toHaveText("Öppna ISK");
   })

   test("Open ISK with [swe, japan], tax: [swe, japan], country: japan, pep: no - should be possible", async ({ page }) => {
      const step1DataO:AdultStep1DataPersonUppgifter = {
         ...step1Data,
         citizenships: ["sverige", "norge"],
         taxResidences: ["sverige", "norge"],
         countryOfResidence: "sverige"
      };
      await openSavingsAdultStep1(page, step1DataO);
      await clickContinueButton(page);
      await expect(page.getByTestId('applicationPurposeId')).toBeVisible();
   })

   test("Open ISK with residence: [swe, japan], tax: [swe, japan], country: japan, pep: no - should not be possible", async ({ page }) => {
      const step1DataO:AdultStep1DataPersonUppgifter = {
         ...step1Data,
         citizenships: ["sverige", "japan"],
         taxResidences: ["sverige", "japan"],
         countryOfResidence: "sverige"
      };

      await openSavingsAdultStep1(page, step1DataO)
      await clickContinueButton(page);

      await expect(page.getByText("Det går tyvärr inte att öppna ett investeringssparkonto")).toBeVisible();
      await expect(page.getByText("Du behöver ha Sverige som en av dina skatterättsliga hemvister för att få öppna ISK.")).toBeVisible();
   });
});

