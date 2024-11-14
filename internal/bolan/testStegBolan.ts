import { test, Page, expect } from "playwright/test";
import {
   MainApplicantCitizenSverige,
   MainApplicantNoPep,
   aboutCoApplicantStep2,
   aboutCoApplicantStep3,
   aboutMainApplicantStep2,
   aboutMainApplicantStep3,
   aboutResidenceApartmentLLStep1,
   aboutResidenceApartmentStep1,
   aboutResidenceHouseLLStep1,
   aboutResidenceHouseStep1,
   cashDepositOrigin,
   coApplicantCitizenSverige,
   coApplicantNoPep,
   coApplicantTaxDeferment,
   creditor,
   doKidsLiveWithYou,
   freetext,
   hasFireInsurance,
   hojAmount,
   insuranceCompany,
   isInsured,
   mainApplicantTaxDeferment,
   needsCashDepositLoanNO,
   needsCashDepositLoanYES,
   numberOfApplicant1,
   numberOfApplicant2,
   otherResidenciesNO,
   otherResidenciesYES,
   permanentResidency,
   sharedAccomodation,
   signAgreement,
   wantToLoanMore,
} from "../../internal/bolan/LouiseHelpers";
import { data } from "./TestdataBolan";

export async function apartmentStep1(page: Page) {
   test.step("brfStep1", async () => {
      await aboutResidenceApartmentStep1(page);
      await creditor(page);
      await isInsured(page);
      await insuranceCompany(page);
      await permanentResidency(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}
export async function houseStep1(page: Page) {
   test.step("villaStep1", async () => {
      await aboutResidenceHouseStep1(page);
      await creditor(page);
      await isInsured(page);
      await insuranceCompany(page);
      await hasFireInsurance(page);
      await permanentResidency(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function buyApartmentStep1(page: Page) {
   await test.step("buyStep1", async () => {
      await aboutResidenceApartmentStep1(page);
      await insuranceCompany(page);
      await permanentResidency(page);
      await needsCashDepositLoanNO(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function buyHouseStep1(page: Page) {
   await test.step("buyStep1", async () => {
      await aboutResidenceHouseStep1(page);
      await insuranceCompany(page);
      await hasFireInsurance(page);
      await permanentResidency(page);
      await needsCashDepositLoanNO(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function hPLApartmentStep1(page: Page) {
   await test.step("hPLStep1", async () => {
      await aboutResidenceApartmentStep1(page);
      await insuranceCompany(page);
      await permanentResidency(page);
      await needsCashDepositLoanYES(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function hPLHouseStep1(page: Page) {
   await test.step("hPLStep1", async () => {
      await aboutResidenceApartmentStep1(page);
      await insuranceCompany(page);
      await permanentResidency(page);
      await needsCashDepositLoanYES(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function oBLHouseStep1(page: Page) {
   await test.step("hPLStep1", async () => {
      await aboutResidenceApartmentStep1(page);
      await insuranceCompany(page);
      await permanentResidency(page);
      await needsCashDepositLoanNO(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function oBLApartmentStep1(page: Page) {
   await test.step("hPLStep1", async () => {
      await aboutResidenceApartmentStep1(page);
      await insuranceCompany(page);
      await permanentResidency(page);
      await needsCashDepositLoanNO(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function promiseApartmentStep1(page: Page) {
   await aboutResidenceApartmentLLStep1(page);
   await permanentResidency(page);
   await cashDepositOrigin(page);
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function promiseHouseStep1(page: Page) {
   await aboutResidenceHouseLLStep1(page);
   await permanentResidency(page);
   await cashDepositOrigin(page);
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function oneApplicantStep2(page: Page) {
   await test.step("1ApplicantStep2", async () => {
      await numberOfApplicant1(page);
      await expect(page.getByRole("main")).toContainText("Om dig");
      await aboutMainApplicantStep2(page);
      await MainApplicantCitizenSverige(page);
      await MainApplicantNoPep(page);
      await doKidsLiveWithYou(page);
      await otherResidenciesNO(page);
   });
}
export async function twoApplicantsStep2(page: Page) {
   await test.step("2ApplicantsStep2", async () => {
      await numberOfApplicant2(page);
      await aboutMainApplicantStep2(page);
      await MainApplicantCitizenSverige(page);
      await MainApplicantNoPep(page);
      await aboutCoApplicantStep2(page);
      await coApplicantCitizenSverige(page);
      await coApplicantNoPep(page);
      await doKidsLiveWithYou(page);
      await otherResidenciesNO(page);
      await sharedAccomodation(page);
      await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   });
}

export async function oneApplicantStep2OBL(page: Page) {
   await test.step("1ApplicantStep2OBL", async () => {
      await numberOfApplicant1(page);
      await aboutMainApplicantStep2(page);
      await MainApplicantCitizenSverige(page);
      await MainApplicantNoPep(page);
      await doKidsLiveWithYou(page);
      await otherResidenciesYES(page);
   });
}

export async function twoApplicantsStep2OBL(page: Page) {
   await test.step("2ApplicantsStep2OBL", async () => {
      await numberOfApplicant2(page);
      await aboutMainApplicantStep2(page);
      await MainApplicantCitizenSverige(page);
      await MainApplicantNoPep(page);
      await aboutCoApplicantStep2(page);
      await coApplicantCitizenSverige(page);
      await coApplicantNoPep(page);
      await doKidsLiveWithYou(page);
      await sharedAccomodation(page);
      await otherResidenciesYES(page);
   });
}

export async function oneApplicantStep3(page: Page) {
   await test.step("1ApplicantStep3", async () => {
      await aboutMainApplicantStep3(page);
      await wantToLoanMore(page);
      await freetext(page);
   });
}

export async function oneApplicantStep3HOJ(page: Page) {
   await test.step("1ApplicantStep3Hoj", async () => {
      await aboutMainApplicantStep3(page);
      await hojAmount(page);
      await freetext(page);
   });
}

export async function twoApplicantsStep3(page: Page) {
   await test.step("2ApplicantsStep3", async () => {
      await aboutMainApplicantStep3(page);
      await aboutCoApplicantStep3(page);
      await wantToLoanMore(page);
      await freetext(page);
   });
}

export async function twoApplicantsStep3HOJ(page: Page) {
   await test.step("2ApplicantsStep3Hoj", async () => {
      await aboutMainApplicantStep3(page);
      await aboutCoApplicantStep3(page);
      await hojAmount(page);
      await freetext(page);
   });
}
export async function oneApplicantStep3BUY(page: Page) {
   await test.step("1ApplicantStep3Buy", async () => {
      await aboutMainApplicantStep3(page);
      await mainApplicantTaxDeferment(page);
      await freetext(page);
   });
}

export async function twoApplicantsStep3BUY(page: Page) {
   await test.step("2ApplicantsStep3Buy", async () => {
      await aboutMainApplicantStep3(page);
      await mainApplicantTaxDeferment(page);
      await aboutCoApplicantStep3(page);
      await coApplicantTaxDeferment(page);
      await freetext(page);
   });
}

export async function step4(page: Page) {
   await test.step("step4", async () => {
      await page.evaluate("setUseFakeBankId(true)");
      await signAgreement(page);
      await expect(page.getByTestId("loading").locator("span")).toContainText(
         "Ladda INTE om sidan. Din ansökan skickas in. Det kan dröja en stund.",
      );
      //await expect(page.getByRole("heading", { name: "Vi går igenom din ansökan" }));
   });
}
