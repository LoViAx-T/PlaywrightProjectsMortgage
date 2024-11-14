import { test, expect } from "@playwright/test";
import {
   sharedAccomodation,
   aboutCoApplicantStep2,
   aboutCoApplicantStep3,
   aboutMainApplicantStep2,
   aboutMainApplicantStep3,
   aboutResidenceApartmentStep1,
   aboutResidenceHouseStep1,
   numberOfApplicant1,
   numberOfApplicant2,
   signAgreement,
   startFlyttApplication,
   wantToLoanMore,
   doKidsLiveWithYou,
   otherResidenciesNO,
   creditor,
   isInsured,
   permanentResidency,
   insuranceCompany,
   hasFireInsurance,
   maxKids,
   MainApplicantCitizenSverige,
   MainApplicantNoPep,
   coApplicantCitizenSverige,
   coApplicantNoPep,
} from "../../internal/bolan/LouiseHelpers";
import { data } from "../../internal/bolan/TestdataBolan";
import {
   apartmentStep1,
   houseStep1,
   oneApplicantStep2,
   oneApplicantStep3,
   step4,
   twoApplicantsStep2,
   twoApplicantsStep3,
} from "../../internal/bolan/testStegBolan";

test("FlyttMaxBarnBrf", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await apartmentStep1(page);
   await numberOfApplicant1(page);
   await aboutMainApplicantStep2(page);
   await MainApplicantCitizenSverige(page);
   await MainApplicantNoPep(page);
   await maxKids(page);
   await otherResidenciesNO(page);
   await oneApplicantStep3(page);
   await step4(page);
});

test("Flytt2PersonerMaxBarnVilla", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await houseStep1(page);
   await numberOfApplicant2(page);
   await aboutMainApplicantStep2(page);
   await MainApplicantCitizenSverige(page);
   await MainApplicantNoPep(page);
   await aboutCoApplicantStep2(page);
   await coApplicantCitizenSverige(page);
   await coApplicantNoPep(page);
   await maxKids(page);
   await sharedAccomodation(page);
   await otherResidenciesNO(page);
   await twoApplicantsStep3(page);
   await step4(page);
   page.close();
});
