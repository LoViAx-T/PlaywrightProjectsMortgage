import { test, expect, Page } from "@playwright/test";
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
   cashDepositOrigin,
   coApplicantCitizenSverige,
   coApplicantNoPep,
   coApplicantTaxDeferment,
   doKidsLiveWithYou,
   mainApplicantTaxDeferment,
   numberOfApplicant1,
   numberOfApplicant2,
   otherResidenciesNO,
   permanentResidency,
   sharedAccomodation,
   signAgreement,
   startPromiseApplication,
   wantToLoanMore,
} from "../../internal/bolan/LouiseHelpers";
import {
   apartmentStep1,
   houseStep1,
   oneApplicantStep2,
   oneApplicantStep3,
   oneApplicantStep3BUY,
   promiseApartmentStep1,
   promiseHouseStep1,
   step4,
   twoApplicantsStep3BUY,
   twoApplicantsStep2,
   twoApplicantsStep3,
} from "../../internal/bolan/testStegBolan";

test("lanelofte1PersonBrf", async ({ page }) => {
   test.slow();

   await startPromiseApplication(page);
   await promiseApartmentStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("lanelofte2PersonerBrf", async ({ page }) => {
   test.slow();
   await startPromiseApplication(page);
   await promiseApartmentStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("lanelofte1PersonVilla", async ({ page }) => {
   test.slow();
   await startPromiseApplication(page);
   await promiseHouseStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("lanelofte2PersonerVilla", async ({ page }) => {
   test.slow();
   await startPromiseApplication(page);
   await promiseHouseStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});
