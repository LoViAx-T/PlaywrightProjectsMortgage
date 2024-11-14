import { test, expect } from "@playwright/test";
import { Page } from "@playwright/test";
import { data } from "../../internal/bolan/TestdataBolan";

//Byte av miljö sker i playwright.config.ts

/*-----------------------------------STARTA ANSÖKAN-----------------------------------------------*/
//Starta flytt + flytt/höj-ansökan
export async function startFlyttApplication(page: Page) {
   await page.goto("/lana/bolan/flytta-bolan/ansokan-flytta-bolan/");
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
}

//Starta höj-ansökan
export async function startHojApplication(page: Page) {
   await page.goto("/lana/bolan/utoka-bolan/");
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
   await page.getByRole("link", { name: "Starta ansökan" }).click();
}
//Starta köp-ansökan
export async function startBuyApplication(page: Page) {
   await page.goto(
      "/lana/bolan/bolaneansokan/ansokan-bolan/?typ=1&TotalLoan=1000000&PropertyValue=3000000&PropertyPrice=3000000&CommitmentPeriod=3&IcaSpend=4",
   );
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
}
//Starta Lånelöftes-ansökan
export async function startPromiseApplication(page: Page) {
   await page.goto(
      "/lana/bolan/lanelofte/ansok-om-lanelofte/?typ=4&TotalLoan=1000000&PropertyValue=3000000&PropertyPrice=3000000&CommitmentPeriod=3&IcaSpend=4",
   );
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
}

/*----------------------------------STEG 1: "Om bostaden"-----------------------------------------------*/

// Steg 1 - "Om bostaden" Brf
export async function aboutResidenceApartmentStep1(page: Page) {
   await expect(page.getByRole("main")).toContainText("Om bostaden");
   await page
      .locator("div")
      .filter({ hasText: /^Bostadsrätt$/ })
      .click();
   await page.locator('input[name="residenceCost"]').click();
   await page.locator('input[name="residenceCost"]').fill(data.residenceCost);
   await page.locator('input[name="residenceCost"]').press("Tab");
   await page.locator('input[name="mortgageAmount"]').fill(data.mortgageAmount);
   await page.locator('input[name="mortgageAmount"]').press("Tab");
   await page
      .locator('input[name="apartmentInfo\\.apartmentNumber"]')
      .fill(data.apartmentInfoapartmentNumber);
   await page.locator('input[name="apartmentInfo\\.apartmentNumber"]').press("Tab");
   await page
      .locator('input[name="apartmentInfo\\.apartmentArea"]')
      .fill(data.apartmentInfoapartmentArea);
   await page.locator('input[name="apartmentInfo\\.apartmentArea"]').press("Tab");
   await page
      .locator('input[name="apartmentInfo\\.monthlyFee"]')
      .fill(data.apartmentInfomonthlyFee);
   await page.locator('input[name="apartmentInfo\\.monthlyFee"]').press("Tab");
   await page.locator('input[name="apartmentInfo\\.address"]').fill(data.apartmentInfoaddress);
   await page.locator('input[name="apartmentInfo\\.address"]').press("Tab");
   await page.locator('input[name="apartmentInfo\\.zipCode"]').fill(data.apartmentInfozipCode);
   await page.locator('input[name="apartmentInfo\\.zipCode"]').press("Tab");
   await page.locator('input[name="operatingCost"]').fill(data.operatingCost);
   await page.locator('input[name="operatingCost"]').press("Tab");
}

//Vid HPL-ansökan lägg till await needsCashDepositLoanYES(page); i testfallet under aboutResidenceApartmentStep1

// Steg 1 - "Om bostaden" Brf
export async function aboutResidenceApartmentLLStep1(page: Page) {
   await expect(page.getByRole("main")).toContainText("Om bostaden");
   await page
      .locator("div")
      .filter({ hasText: /^Bostadsrätt$/ })
      .click();
   await page.locator('input[name="residenceCost"]').click();
   await page.locator('input[name="residenceCost"]').fill(data.residenceCost);
   await page.locator('input[name="residenceCost"]').press("Tab");
   await page.locator('input[name="mortgageAmount"]').fill(data.mortgageAmount);
   await page.locator('input[name="mortgageAmount"]').press("Tab");

   await page
      .locator('input[name="apartmentInfo\\.monthlyFee"]')
      .fill(data.apartmentInfomonthlyFee);
   await page.locator('input[name="apartmentInfo\\.monthlyFee"]').press("Tab");
   await page.locator('input[name="operatingCost"]').fill(data.operatingCost);
   await page.locator('input[name="operatingCost"]').press("Tab");
}

export async function aboutResidenceHouseLLStep1(page: Page) {
   await expect(page.getByRole("main")).toContainText("Om bostaden");
   await page
      .locator("div")
      .filter({ hasText: /^Villa$/ })
      .click();
   await page.locator('input[name="residenceCost"]').click();
   await page.locator('input[name="residenceCost"]').fill(data.residenceCost);
   await page.locator('input[name="residenceCost"]').press("Tab");
   await page.locator('input[name="mortgageAmount"]').fill(data.mortgageAmount);
   await page.locator('input[name="mortgageAmount"]').press("Tab");
   await page.locator('input[name="operatingCost"]').fill(data.operatingCost);
   await page.locator('input[name="operatingCost"]').press("Tab");
   await page.locator('input[name="operatingCost"]').click();
   await page.locator('input[name="operatingCost"]').fill(data.operatingCost);
}

export async function permanentResidency(page: Page) {
   await page
      .getByTestId("permanentResidency")
      .locator("div")
      .filter(data.permanentResidency)
      .click();
}

export async function cashDepositOrigin(page: Page) {
   await page.locator("label").filter(data.cashDepositOrigin).locator("div").nth(1).click();
}

export async function creditor(page: Page) {
   await page.getByTestId("creditor").locator("div").first().click();
   await page.getByTestId("creditor").getByText(data.creditor).click();
}

export async function isInsured(page: Page) {
   await page.getByTestId("isInsured").locator("label").filter(data.isInsured).click();
}

export async function hasFireInsurance(page: Page) {
   await page
      .getByTestId("hasFireInsuranceFullValue")
      .locator("div")
      .filter(data.hasFireInsuranceFullValue)
      .click();
}

export async function insuranceCompany(page: Page) {
   await page.getByTestId("insuranceCompanyCode").locator("div").first().click();
   await page.getByTestId("insuranceCompanyCode").getByText(data.insuranceCompanyCode).click();
}

export async function needsCashDepositLoanNO(page: Page) {
   await await page
      .getByTestId("needsCashDepositLoan")
      .locator("div")
      .filter(data.needsCashDepositLoanNO)
      .click();
   await page.locator("label").filter(data.cashDepositOrigin).locator("div").nth(1).click();
}
//Vid KÖP och ÖBL-ansökan lägg till await needsCashDepositLoanNO (page); i testfallet under aboutResidenceApartmentStep1

export async function needsCashDepositLoanYES(page: Page) {
   await await page
      .getByTestId("needsCashDepositLoan")
      .locator("div")
      .filter(data.needsCashDepositLoanYES)
      .click();
   await page.locator("label").filter(data.cashDepositOrigin).locator("div").nth(1).click();
}

//Steg 1 - "Om bostaden" Villa
export async function aboutResidenceHouseStep1(page: Page) {
   await expect(page.getByRole("main")).toContainText("Om bostaden");
   await page
      .locator("div")
      .filter({ hasText: /^Villa$/ })
      .click();
   await page.locator('input[name="residenceCost"]').click();
   await page.locator('input[name="residenceCost"]').fill(data.residenceCost);
   await page.locator('input[name="residenceCost"]').press("Tab");
   await page.locator('input[name="mortgageAmount"]').fill(data.mortgageAmount);
   await page.locator('input[name="mortgageAmount"]').press("Tab");
   await page.locator('input[name="villaInfo\\.address"]').click();
   await page.locator('input[name="villaInfo\\.address"]').fill(data.villaInfoaddress);
   await page.locator('input[name="villaInfo\\.zipCode"]').click();
   await page.locator('input[name="villaInfo\\.zipCode"]').fill(data.villaInfozipCode);
   await page.locator('input[name="villaInfo\\.zipCode"]').dblclick();
   await page.locator('input[name="operatingCost"]').click();
   await page.locator('input[name="operatingCost"]').fill(data.operatingCost);
}

/*----------------------------------STEG 2: "Om dig" -----------------------------------------------*/
// Steg 2 - 1 sökande
export async function numberOfApplicant1(page: Page) {
   await page
      .locator("div")
      .filter({ hasText: /^1 person$/ })
      .click();
}

// Steg 2 - 2 sökande
export async function numberOfApplicant2(page: Page) {
   await page
      .locator("div")
      .filter({ hasText: /^2 personer$/ })
      .click();
}

// Steg 2 - "Om dig" Sökande 1.
export async function aboutMainApplicantStep2(page: Page) {
   await page.locator('input[name="applicant1\\.firstName"]').click();
   await page.locator('input[name="applicant1\\.firstName"]').fill(data.applicant1firstName);
   await page.locator('input[name="applicant1\\.firstName"]').press("Tab");
   await page.locator('input[name="applicant1\\.lastName"]').fill(data.applicant1lastName);
   await page.locator('input[name="applicant1\\.lastName"]').press("Tab");
   await page.locator('input[name="applicant1\\.mobileNumber"]').fill(data.applicant1mobileNumber);
   await page.locator('input[name="applicant1\\.mobileNumber"]').press("Tab");
   await page.locator('input[name="applicant1\\.email"]').fill(data.applicant1email);
   await page.locator("label").filter({ hasText: "Ensamstående" }).locator("div").nth(2).click();
}

export async function MainApplicantCitizenSverige(page: Page) {
   await page.getByTestId("applicant1.citizenships.0.code").locator("div").first().click();
   await page
      .getByTestId("applicant1.citizenships.0.code")
      .getByText(data.applicant1citizenships)
      .click();
   await page
      .getByTestId("applicant1.countryOfResidence")
      .locator("div")
      .filter(data.applicant1countryOfResidence)
      .click();
   await page.getByTestId("applicant1.taxResidences.0.country.code").locator("div").first().click();
   await page
      .getByTestId("applicant1.taxResidences.0.country.code")
      .getByText(data.applicant1taxResidences)
      .click();
   await page.getByTestId("applicant1.pep").locator("div").first().click();
}

export async function coApplicantCitizenSverige(page: Page) {
   await page.getByTestId("applicant2.citizenships.0.code").locator("div").first().click();
   await page
      .getByTestId("applicant2.citizenships.0.code")
      .getByText(data.applicant2citizenships)
      .click();
   await page
      .getByTestId("applicant2.countryOfResidence")
      .locator("div")
      .filter(data.applicant2countryOfResidence)
      .click();
   await page.getByTestId("applicant2.taxResidences.0.country.code").locator("div").first().click();
   await page
      .getByTestId("applicant2.taxResidences.0.country.code")
      .getByText(data.applicant2taxResidences)
      .click();
}

export async function MainApplicantNoPep(page: Page) {
   await page.getByTestId("applicant1.pep").locator("div").first().click();
   await page.getByTestId("applicant1.pep").getByText("Ingen av dessa").click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function coApplicantNoPep(page: Page) {
   await page.getByTestId("applicant2.pep").locator("div").first().click();
   await page.getByTestId("applicant2.pep").getByText(data.applicant1pep).click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

// Steg 2 - "Om dig" Sökande 2.
export async function aboutCoApplicantStep2(page: Page) {
   await page.locator('input[name="applicant2\\.personalIdentityNumber"]').click();
   await page
      .locator('input[name="applicant2\\.personalIdentityNumber"]')
      .fill(data.applicant2personalIdentityNumber);
   await expect(page.getByRole("main")).toContainText("Personnummer");
   await page.locator('input[name="applicant2\\.firstName"]').click();
   await page.locator('input[name="applicant2\\.firstName"]').fill(data.applicant2firstName);
   await page.locator('input[name="applicant2\\.firstName"]').press("Tab");
   await page.locator('input[name="applicant2\\.lastName"]').fill(data.applicant2lastName);
   await page.locator('input[name="applicant2\\.lastName"]').press("Tab");
   await page.locator('input[name="applicant2\\.mobileNumber"]').fill(data.applicant2mobileNumber);
   await page.locator('input[name="applicant2\\.mobileNumber"]').press("Tab");
   await page.locator('input[name="applicant2\\.email"]').fill(data.applicant2email);
   await page
      .getByTestId("applicant2.relationshipStatus")
      .locator("label")
      .filter(data.applicant2relationshipStatus)
      .locator("div")
      .nth(2)
      .click();
}

/*----------------------------------STEG 3: "Din ekonomi"-----------------------------------------------*/
//Steg 3 - "Din ekonomi" Sökande 1 Brf
export async function otherResidenciesNO(page: Page) {
   await page
      .getByTestId("ownsOtherResidencies")
      .locator("div")
      .filter(data.ownsOtherResidencies)
      .click();
}

export async function sharedAccomodation(page: Page) {
   await page
      .getByTestId("isSharedAccommodation")
      .locator("div")
      .filter(data.isSharedAccommodation)
      .click();
}

export async function aboutMainApplicantStep3(page: Page) {
   await page
      .getByTestId("mainApplicantInfo.typeOfWork")
      .getByText(data.mainApplicantInfotypeOfWork)
      .click();
   await page.locator('input[name="mainApplicantInfo\\.employer"]').click();
   await page
      .locator('input[name="mainApplicantInfo\\.employer"]')
      .fill(data.mainApplicantInfoemployer);
   await page.locator('input[name="mainApplicantInfo\\.employmentStartDate"]').click();
   await page
      .locator('input[name="mainApplicantInfo\\.employmentStartDate"]')
      .fill(data.mainApplicantInfoemploymentStartDate);
   await page.locator('input[name="mainApplicantInfo\\.employmentStartDate"]').click();
   await page.locator('input[name="mainApplicantInfo\\.employmentStartDate"]').press("Tab");
   await page
      .locator('input[name="mainApplicantInfo\\.monthlyIncome"]')
      .fill(data.mainApplicantInfomonthlyIncome);
   await page.locator('input[name="mainApplicantInfo\\.monthlyIncome"]').press("Tab");
   await page
      .locator('input[name="mainApplicantInfo\\.savings"]')
      .fill(data.mainApplicantInfosavings);
   await expect(page.getByTestId("mainApplicantInfo.incomeInSek")).toContainText(
      "Får du din inkomst i svenska kronor?",
   );
   await page
      .getByTestId("mainApplicantInfo.incomeInSek")
      .locator("div")
      .filter(data.mainApplicantInfoincomeInSek)
      .click();
   await expect(page.getByTestId("mainApplicantInfo.incomeInSek")).toContainText("Ja");
   await page
      .getByTestId("mainApplicantInfo.anyOtherLoans")
      .locator("div")
      .filter(data.mainApplicantInfoanyOtherLoans)
      .click();
}
//Vid höj-ansökan lägg till await hojamount (page); i testfallet.
//Vid köp-ansökan lägg till await mainApplicantTaxDeferment(page); i testfallet.

export async function mainApplicantTaxDeferment(page: Page) {
   await page
      .getByTestId("mainApplicantInfo.hasTaxDeferment")
      .locator("div")
      .filter(data.mainApplicantInfohasTaxDeferment)
      .click();
}

//Steg 3 - "Din ekonomi" Sökande 2await page.getByRole('button', { name: 'Fortsätt till steg' }).click();
export async function aboutCoApplicantStep3(page: Page) {
   await page.getByTestId("coApplicantInfo.typeOfWork").locator("div").first().click();
   await page
      .getByTestId("coApplicantInfo.typeOfWork")
      .getByText(data.coApplicantInfotypeOfWork)
      .click();
   await page.locator('input[name="coApplicantInfo\\.employer"]').click();
   await page
      .locator('input[name="coApplicantInfo\\.employer"]')
      .fill(data.coApplicantInfoemployer);
   await page.locator('input[name="coApplicantInfo\\.employer"]').press("Tab");
   await page
      .locator('input[name="coApplicantInfo\\.employmentStartDate"]')
      .fill(data.coApplicantInfoemploymentStartDate);
   await page.locator('input[name="coApplicantInfo\\.employmentStartDate"]').press("Tab");
   await page
      .locator('input[name="coApplicantInfo\\.monthlyIncome"]')
      .fill(data.coApplicantInfomonthlyIncome);
   await page.locator('input[name="coApplicantInfo\\.monthlyIncome"]').press("Tab");
   await page.locator('input[name="coApplicantInfo\\.savings"]').fill(data.coApplicantInfosavings);
   await page
      .getByTestId("coApplicantInfo.incomeInSek")
      .locator("div")
      .filter(data.coApplicantInfoincomeInSek)
      .click();
   await expect(page.getByTestId("coApplicantInfo.incomeInSek")).toContainText(
      "Får du din inkomst i svenska kronor?",
   );
   await page
      .getByTestId("coApplicantInfo.anyOtherLoans")
      .locator("div")
      .filter(data.coApplicantInfoanyOtherLoans)
      .click();
}
export async function coApplicantTaxDeferment(page: Page) {
   await page
      .getByTestId("coApplicantInfo.hasTaxDeferment")
      .locator("div")
      .filter(data.coApplicantTaxDeferment)
      .click();
}
export async function wantToLoanMore(page: Page) {
   await page.getByTestId("wantToLoanMore").locator("div").filter(data.wantToLoanMore1).click();
}

export async function freetext(page: Page) {
   await page.locator('textarea[name="additionalInfo"]').click();
   await page.locator('textarea[name="additionalInfo"]').fill(data.freetext);
}

//Steg 3 - "Din Ekonomi" för höj-ansökan.
export async function hojAmount(page: Page) {
   await page.getByTestId("wantToLoanMore").locator("div").filter(data.wantToLoanMore2).click();
   await page.locator('input[name="extraLoanAmount"]').click();
   await page.locator('input[name="extraLoanAmount"]').fill(data.extraLoanAmount);
   await page.getByTestId("extraLoanPurpose").locator("div").first().click();
   await page.getByTestId("extraLoanPurpose").locator("div").first().click();
   await page.getByTestId("extraLoanPurpose").getByText(data.extraLoanPurpose).click();
}
export async function doKidsLiveWithYou(page: Page) {
   await page
      .getByTestId("doKidsLiveWithYou")
      .locator("div")
      .filter(data.doKidsLiveWithYou)
      .click();
   await page
      .getByTestId("ownsOtherResidencies")
      .locator("div")
      .filter(data.ownsOtherResidencies)
      .click();
}

export async function maxKids(page: Page) {
   await page.getByTestId("doKidsLiveWithYou").locator("div").filter({ hasText: /^Ja$/ }).click();
   await page.getByTestId("kids.0.age").getByText("2", { exact: true }).click();
   await page.getByText("Heltid").click();
   await page.getByTestId("kids.0.childSupportGet").getByText("Ja").click();
   await page
      .getByTestId("kids.0.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.1.age").locator("div").first().click();
   await page.getByTestId("kids.1.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.1.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.1.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.1.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.2.age").locator("div").first().click();
   await page.getByTestId("kids.2.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.2.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.2.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.2.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.3.age").locator("div").first().click();
   await page.getByTestId("kids.3.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.3.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.3.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.3.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.4.age").locator("div").first().click();
   await page.getByTestId("kids.4.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.4.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.4.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.4.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.5.age").locator("div").first().click();
   await page.getByTestId("kids.5.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.5.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.5.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.5.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();

   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.6.age").locator("div").first().click();
   await page.getByTestId("kids.6.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.6.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.6.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.6.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();

   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.7.age").locator("div").first().click();
   await page.getByTestId("kids.7.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.7.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.7.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.7.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();

   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.8.age").locator("div").first().click();
   await page.getByTestId("kids.8.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.8.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.8.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.8.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();

   await page.getByRole("button", { name: "+ Lägg till ett barn" }).click();
   await page.getByTestId("kids.9.age").locator("div").first().click();
   await page.getByTestId("kids.9.age").getByText("3", { exact: true }).click();
   await page
      .getByTestId("kids.9.custody")
      .locator("label")
      .filter({ hasText: "Halvtid" })
      .locator("div")
      .nth(2)
      .click();
   await page
      .getByTestId("kids.9.childSupportGet")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page
      .getByTestId("kids.9.childSupportPay")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
}

export async function mainApplicantOlikaLander(page: Page) {
   await page.getByTestId("applicant1.citizenships.0.code").locator("div").first().click();
   await page
      .getByTestId("applicant1.citizenships.0.code")
      .getByRole("list")
      .getByText(data.applicant1CitizenshipsUtomlands)
      .click();
   await page
      .getByTestId("applicant1.countryOfResidence")
      .locator("div")
      .filter(data.applicant1countryOfResidenceUtomlands)
      .click();
   await page.getByTestId("applicant1.otherCountryOfResidence").locator("div").first().click();
   await page
      .getByTestId("applicant1.otherCountryOfResidence")
      .getByText(data.applicant1otherCountryOfResidence)
      .click();
   await page.getByTestId("applicant1.taxResidences.0.country.code").getByRole("img").click();
   await page
      .getByTestId("applicant1.taxResidences.0.country.code")
      .getByRole("list")
      .getByText(data.applicant1taxResidencesUtomlands)
      .click();
   await page.locator('input[name="applicant1\\.taxResidences\\.0\\.tin"]').click();
   await page
      .locator('input[name="applicant1\\.taxResidences\\.0\\.tin"]')
      .fill(data.taxResidenceTIN);
}

export async function coApplicantOlikaLander(page: Page) {
   await page
      .getByTestId("applicant2.citizenships")
      .getByText(data.applicant2citizenshipsUtomlands)
      .click();
   await page.getByTestId("applicant2.citizenships").locator("div").first().click();
   await page
      .getByTestId("applicant2.countryOfResidence")
      .locator("div")
      .filter(data.applicant2countryOfResidenceUtomlands)
      .click();
   await page.getByTestId("applicant2.otherCountryOfResidence").locator("div").first().click();
   await page
      .getByTestId("applicant2.otherCountryOfResidence")
      .getByText(data.applicant2otherCountryOfResidence)
      .click();
   await page.getByTestId("applicant2.taxResidences").locator("div").first().click();
   await page
      .getByTestId("applicant2.taxResidences")
      .getByText(data.applicant2taxResidencesUtomlands)
      .click();
   await page.locator('input[name="applicant2\\.taxResidences\\.0\\.tin"]').click();
   await page
      .locator('input[name="applicant2\\.taxResidences\\.0\\.tin"]')
      .fill(data.applicant2taxResidenceTIN);
}

export async function mainApplicantPep(page: Page) {
   await page.getByTestId("applicant1.pep").locator("div").first().click();

   await page.getByTestId("applicant1.pepRelative").locator("div").first().click();
   await page
      .getByTestId("applicant1.pepRelative")
      .getByText("Make/maka, registrerad partner eller sambo", { exact: true })
      .click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function coApplicantPep(page: Page) {
   await page.getByTestId("applicant2.pep").locator("div").first().click();
   await page.getByTestId("applicant2.pep").getByText("Stats- eller regeringschef,").click();
   await page.getByTestId("applicant2.pepRelative").locator("div").first().click();
   await page
      .getByTestId("applicant2.pepRelative")
      .getByText("Make/maka, registrerad partner eller sambo", { exact: true })
      .click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

//Steg 3 --"Din ekonomi" Sökande 1
export async function otherResidenciesYES(page: Page) {
   await page
      .getByTestId("ownsOtherResidencies")
      .locator("div")
      .filter(data.ownsOtherResidenciesOBL)
      .click();
   await page.getByTestId("otherResidencies.0.typeOfOtherResidence").locator("div").first().click();
   await page
      .getByTestId("otherResidencies.0.typeOfOtherResidence")
      .getByText(data.typeOfOtherResidencies)
      .click();
   await page
      .getByTestId("otherResidencies.0.keepResidence")
      .locator("div")
      .filter(data.keepOtherResidencies)
      .click();
   await page.locator('input[name="otherResidencies\\.0\\.operatingCost"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.operatingCost"]')
      .fill(data.otherResidenciesoperatingCost);
   await page
      .getByTestId("otherResidencies.0.hasLoan")
      .locator("div")
      .filter(data.otherResidencieshasLoan)
      .click();
   await page.locator('input[name="otherResidencies\\.0\\.estimatedSaleAmount"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.estimatedSaleAmount"]')
      .fill(data.otherResidenciesestimatedSaleAmount);
   await page.locator('input[name="otherResidencies\\.0\\.accomodationBrokerFee"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.accomodationBrokerFee"]')
      .fill(data.otherResidenciesBrokerFee);
   await page.locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]').click();
   await page.locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]')
      .fill(data.otherResidenciesaccomodationConveyenceDate);
   await page
      .locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]')
      .press("Tab");
}

//Steg 3 --"Din ekonomi" Sökande 1 TVÅ SÖKANDE ÖBL
export async function aboutMainApplicantHouseAppartmentOBLStep3(page: Page) {
   //await page.getByLabel('Hur mycket handlar du för?').fill('3');
   //await page.getByLabel('Hur mycket handlar du för?').click();
   await page
      .getByTestId("doKidsLiveWithYou")
      .locator("div")
      .filter(data.doKidsLiveWithYou)
      .click();
   await page
      .getByTestId("isSharedAccommodation")
      .locator("div")
      .filter(data.isSharedAccommodation)
      .click();
   await page
      .getByTestId("ownsOtherResidencies")
      .locator("div")
      .filter(data.ownsOtherResidencies)
      .click();
   await page.getByTestId("otherResidencies.0.typeOfOtherResidence").locator("div").first().click();
   await page
      .getByTestId("otherResidencies.0.typeOfOtherResidence")
      .getByText(data.typeOfOtherResidencies)
      .click();
   await page
      .getByTestId("otherResidencies.0.keepResidence")
      .locator("div")
      .filter(data.otherResidencieskeepResidence)
      .click();
   await page.locator('input[name="otherResidencies\\.0\\.operatingCost"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.operatingCost"]')
      .fill(data.otherResidenciesoperatingCost);
   await page
      .getByTestId("otherResidencies.0.hasLoan")
      .locator("div")
      .filter(data.otherResidencieshasLoan)
      .click();
   await page.locator('input[name="otherResidencies\\.0\\.estimatedSaleAmount"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.estimatedSaleAmount"]')
      .fill(data.otherResidenciesestimatedSaleAmount);
   await page.locator('input[name="otherResidencies\\.0\\.accomodationBrokerFee"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.accomodationBrokerFee"]')
      .fill(data.otherResidenciesBrokerFee);
   await page.locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]').click();
   await page.locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]').click();
   await page
      .locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]')
      .fill(data.otherResidenciesaccomodationConveyenceDate);
   await page
      .locator('input[name="otherResidencies\\.0\\.accomodationConveyenceDate"]')
      .press("Tab");
   await page
      .getByTestId("mainApplicantInfo.typeOfWork")
      .getByRole("list")
      .getByText(data.mainApplicantInfotypeOfWork)
      .click();
   await page.locator('input[name="mainApplicantInfo\\.employer"]').click();
   await page
      .locator('input[name="mainApplicantInfo\\.employer"]')
      .fill(data.mainApplicantInfoemployer);
   await page.locator('input[name="mainApplicantInfo\\.employer"]').press("Tab");
   await page
      .locator('input[name="mainApplicantInfo\\.employmentStartDate"]')
      .fill(data.mainApplicantInfoemploymentStartDate);
   await page.locator('input[name="mainApplicantInfo\\.employmentStartDate"]').press("Tab");
   await page
      .locator('input[name="mainApplicantInfo\\.monthlyIncome"]')
      .fill(data.mainApplicantInfomonthlyIncome);
   await page.locator('input[name="mainApplicantInfo\\.monthlyIncome"]').press("Tab");
   await page.locator('input[name="mainApplicantInfo\\.savings"]').click();
   await page
      .locator('input[name="mainApplicantInfo\\.savings"]')
      .fill(data.mainApplicantInfosavings);
   await page
      .getByTestId("mainApplicantInfo.incomeInSek")
      .locator("div")
      .filter(data.mainApplicantInfoincomeInSek)
      .click();
   await page
      .getByTestId("mainApplicantInfo.anyOtherLoans")
      .locator("div")
      .filter(data.mainApplicantInfoanyOtherLoans)
      .click();
   await page
      .getByTestId("mainApplicantInfo.hasTaxDeferment")
      .locator("div")
      .filter(data.mainApplicantInfohasTaxDeferment)
      .click();
}

/*----------------------------------STEG 4: "Godkänn villkor"-----------------------------------------------*/

//Steg 4 - "Godkänn villkor"
export async function signAgreement(page: Page) {
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   await page.locator("label div").nth(1).click();
   await page.getByRole("button", { name: "Signera och skicka in ansökan" }).click();
   await page.getByRole("textbox").click();
   await page.getByRole("textbox").fill(data.applicant1personalIdentityNumber);
   await page.getByRole("main").getByRole("button", { name: "Logga in" }).click();
   //await expect(page.getByRole("heading", { name: "Vi går igenom ansökan" })).toBeVisible();
}

/*---------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------*/
export async function logInHoj(page: Page) {
   await page.goto("https://ver.icabanken.se/");
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
   await page.getByRole("button", { name: "Logga in" }).click();
   await page.getByRole("heading", { name: "Logga in" }).click();
   await page.getByRole("link", { name: "icabanken-username-bankid" }).click();
   await page.getByRole("textbox").click();
   await page.getByRole("textbox").fill("6708118648");
   await expect(page.locator("form")).toContainText("Logga in");
   await page.getByRole("button", { name: "Logga in" }).click();
   await page.locator("label div").nth(1).click();
   await page.getByRole("button", { name: "OK" }).click();
   await page.getByRole("button", { name: "Gå vidare" }).click();
   await page.getByRole("heading", { name: "Lån" }).click();
   await page.getByRole("link", { name: "1002, Brf" }).click();
   await page.getByRole("button", { name: "Utöka mitt bolån" }).click();
   await page.getByRole("link", { name: "Starta ansökan" }).click();
   await page.getByLabel("Hur mycket tror du att").fill("5500000");
   await page.getByLabel("Hur mycket mer vill du låna?").fill("2100000");
   await page.getByLabel("Hur mycket handlar du för?").fill("1");
   await page.getByRole("link", { name: "Starta ansökan" }).click();
}

export async function increaseMortgageHOJ(page: Page) {
   await expect(page.getByRole("main")).toContainText("Om lånet");
   await page.getByRole("textbox", { name: "Hur mycket mer vill du låna?" }).click();
   await page.getByRole("textbox", { name: "Hur mycket mer vill du låna?" }).fill("500000");
   await page.getByTestId("extraLoanPurpose").locator("div").first().click();
   await page.getByTestId("extraLoanPurpose").getByText("Köp av bostad").click();
   await page.locator("div").filter({ hasText: /^Nej$/ }).click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function mainApplicantStep1HOJ(page: Page) {
   await expect(page.getByRole("main")).toContainText("Din ekonomi");
   await page.getByLabel("Hur mycket handlar du för?").fill("1");
   await page.getByTestId("doKidsLiveWithYou").locator("div").filter({ hasText: /^Nej$/ }).click();
   await page
      .getByTestId("ownsOtherResidencies")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByTestId("mainApplicantInfo.typeOfWork").locator("div").first().click();
   await page
      .getByTestId("mainApplicantInfo.typeOfWork")
      .getByRole("list")
      .getByText("Tillsvidareanställning")
      .click();
   await page.locator('input[name="mainApplicantInfo\\.employer"]').click();
   await page.locator('input[name="mainApplicantInfo\\.employer"]').fill("ICA");
   await page.locator('input[name="mainApplicantInfo\\.employmentStartDate"]').click();
   await page.locator('input[name="mainApplicantInfo\\.employmentStartDate"]').fill("19990101");
   await page.locator('input[name="mainApplicantInfo\\.monthlyIncome"]').fill("100000");
   await page.locator('input[name="mainApplicantInfo\\.savings"]').click();
   await page.locator('input[name="mainApplicantInfo\\.savings"]').fill("90000");
   await page
      .getByTestId("mainApplicantInfo.incomeInSek")
      .locator("div")
      .filter({ hasText: /^Ja$/ })
      .click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
   await page.locator('input[name="applicant1\\.firstName"]').click();
   await page.locator('input[name="applicant1\\.firstName"]').fill("Testare");
   await page.locator('input[name="applicant1\\.firstName"]').press("Tab");
   await page.locator('input[name="applicant1\\.lastName"]').fill("Test");
   await page.locator('input[name="applicant1\\.lastName"]').press("Tab");
   await page.locator('input[name="applicant1\\.mobileNumber"]').fill("0700000000");
   await page.locator('input[name="applicant1\\.mobileNumber"]').press("Tab");
   await page.locator('input[name="applicant1\\.email"]').fill("test@test.se");
   await page.locator('input[name="applicant1\\.email"]').press("Tab");
   await page.locator("label").filter({ hasText: "Ensamstående" }).locator("div").nth(2).click();
   await page.getByTestId("applicant1.citizenships.0.code").locator("div").first().click();
   await page.getByTestId("applicant1.citizenships.0.code").getByText("Sverige").click();
   await page
      .getByTestId("applicant1.countryOfResidence")
      .locator("div")
      .filter({ hasText: /^Sverige$/ })
      .click();
   await page.getByTestId("applicant1.taxResidences.0.country.code").locator("div").first().click();
   await page.getByTestId("applicant1.taxResidences.0.country.code").getByText("Sverige").click();
   await page.getByTestId("applicant1.pep").locator("div").first().click();
   await page.locator('textarea[name="additionalInfo"]').click();
   await page.locator('textarea[name="additionalInfo"]').fill("Anteckning höj");
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function coApplicantStep1Hoj(page: Page) {
   await page.getByTestId("coApplicantInfo.typeOfWork").locator("div").first().click();
   await page.getByTestId("coApplicantInfo.typeOfWork").getByText("Tillsvidareanställning").click();
   await page.locator('input[name="coApplicantInfo\\.employer"]').click();
   await page.locator('input[name="coApplicantInfo\\.employer"]').fill("COOP");
   await page.locator('input[name="coApplicantInfo\\.employmentStartDate"]').click();
   await page.locator('input[name="coApplicantInfo\\.employmentStartDate"]').fill("20100101");
   await page.locator('input[name="coApplicantInfo\\.employmentStartDate"]').press("Tab");
   await page.locator('input[name="coApplicantInfo\\.monthlyIncome"]').fill("90000");
   await page.locator('input[name="coApplicantInfo\\.monthlyIncome"]').press("Tab");
   await page.locator('input[name="coApplicantInfo\\.savings"]').fill("100000");
   await page.locator('input[name="coApplicantInfo\\.savings"]').press("Tab");
   await page
      .getByTestId("coApplicantInfo.incomeInSek")
      .locator("div")
      .filter({ hasText: /^Ja$/ })
      .click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}
export async function mainApplicantStep2HOJ(page: Page) {
   await page.locator('input[name="applicant1\\.firstName"]').click();
   await page
      .getByTestId("applicant1.relationshipStatus")
      .locator("label")
      .filter({ hasText: "Ensamstående" })
      .locator("div")
      .nth(2)
      .click();
   await page.getByTestId("applicant1.citizenships.0.code").locator("div").first().click();
   await page
      .getByTestId("applicant1.citizenships.0.code")
      .getByRole("list")
      .getByText("Sverige")
      .click();
   await page
      .getByTestId("applicant1.countryOfResidence")
      .locator("div")
      .filter({ hasText: /^Sverige$/ })
      .click();
   await page
      .getByTestId("applicant1.taxResidences.0.country.code")
      .getByRole("list")
      .getByText("Sverige")
      .click();
   await page.getByTestId("applicant1.pep").locator("div").first().click();
   await page.getByTestId("applicant1.pep").getByRole("list").getByText("Ingen av dessa").click();
}

export async function coApplicantStep2HOJ(page: Page) {
   await page.locator('input[name="applicant2\\.personalIdentityNumber"]').click();
   await page.locator('input[name="applicant2\\.personalIdentityNumber"]').fill("197112187401");
   await page.locator('input[name="applicant2\\.firstName"]').click();
   await page.locator('input[name="applicant2\\.firstName"]').fill("Testare");
   await page.locator('input[name="applicant2\\.lastName"]').fill("Testare");
   await page.locator('input[name="applicant2\\.firstName"]').press("Tab");
   await page.locator('input[name="applicant2\\.lastName"]').press("Tab");
   await page.locator('input[name="applicant2\\.mobileNumber"]').fill("0700000000");
   await page.locator('input[name="applicant2\\.mobileNumber"]').press("Tab");
   await page.locator('input[name="applicant2\\.email"]').fill("test@test.se");
   await page
      .getByTestId("applicant2.relationshipStatus")
      .locator("label")
      .filter({ hasText: "Ensamstående" })
      .locator("div")
      .nth(2)
      .click();
   await page.getByTestId("applicant2.citizenships.0.code").locator("div").first().click();
   await page.getByTestId("applicant2.citizenships.0.code").getByText("Sverige").click();
   await page
      .getByTestId("applicant2.countryOfResidence")
      .locator("div")
      .filter({ hasText: /^Sverige$/ })
      .click();
   await page.getByTestId("applicant2.taxResidences.0.country.code").locator("div").first().click();
   await page.getByTestId("applicant2.taxResidences.0.country.code").getByText("Sverige").click();
   await page.getByTestId("applicant2.pep").locator("div").first().click();
   await page.getByTestId("applicant2.pep").getByText("Ingen av dessa").click();
}

export async function sendApplicationHOJ(page: Page) {
   await page.locator("label div").nth(1).click();
   await expect(page.getByRole("main")).toContainText("Godkänn villkor");
   await page.getByRole("button", { name: "Skicka in ansökan" }).click();
   await expect(page.getByRole("main")).toContainText(
      "Vi går igenom din ansökan Vi har gjort en preliminär kreditprövning på de uppgifter du har lämnat. För att vi ska kunna ge dig ett definitivt besked kommer en kundspecialist för bolån gå igenom din låneansökan och därefter kontakta dig. Du kommer få en personlig kontaktperson. Svaren på de vanligaste frågorna hittar du här. Du är också välkommen att ringa oss på 033-435 98 08, vardagar 8–18. Följ din ansökan i Pågående ärenden Du kan redan nu gå till sidan pågående ärenden för att se om du behöver komplettera din ansökan. Där kan du också se hur det går för ansökan.",
   );
   await page.getByRole("button", { name: "Logga ut" }).click();
}

export async function accomodationStep1HOJ(page: Page) {
   await expect(page.locator("h2")).toContainText("Utöka bolån");
   await page.getByRole("textbox", { name: "Hur mycket tror du att" }).fill("7000000");
   await page.locator('input[name="apartmentInfo\\.apartmentArea"]').click();
   await page.locator('input[name="apartmentInfo\\.apartmentArea"]').fill("95");
   await page.locator('input[name="apartmentInfo\\.monthlyFee"]').click();
   await page.locator('input[name="apartmentInfo\\.monthlyFee"]').fill("2000");
   await page.locator('input[name="operatingCost"]').click();
   await page.locator('input[name="operatingCost"]').fill("400");
   await page.getByTestId("isInsured").locator("div").filter({ hasText: /^Ja$/ }).click();
   await expect(page.getByRole("main")).toContainText("Välj försäkringsbolag");
   await page.getByTestId("insuranceCompanyCode").locator("div").first().click();
   await page.getByTestId("insuranceCompanyCode").getByText("GJENSIDIGE").click();
   await page.getByTestId("insuranceCompanyCode").getByRole("list").getByText("GJENSIDIGE").click();
   await page.getByTestId("permanentResidency").locator("div").filter({ hasText: /^Ja$/ }).click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function mainApplicantOtherLoansHOJ(page: Page) {
   await page
      .getByTestId("mainApplicant.anyOtherLoans")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
}
export async function coApplicantOtherLoansHOJ(page: Page) {
   await page
      .getByTestId("coApplicant.anyOtherLoans")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
   await page.getByRole("button", { name: "Fortsätt till steg" }).click();
}

export async function kidsHOJ(page: Page) {
   await page.getByTestId("doKidsLiveWithYou").locator("div").filter({ hasText: /^Nej$/ }).click();
}

export async function otherResidenciesHOJ(page: Page) {
   await page
      .getByTestId("ownsOtherResidencies")
      .locator("div")
      .filter({ hasText: /^Nej$/ })
      .click();
}
