import { test, expect } from "@playwright/test";
import {
   MainApplicantNoPep,
   aboutCoApplicantStep2,
   aboutMainApplicantStep2,
   coApplicantCitizenSverige,
   coApplicantPep,
   doKidsLiveWithYou,
   mainApplicantOlikaLander,
   numberOfApplicant2,
   otherResidenciesNO,
   sharedAccomodation,
   signAgreement,
   startBuyApplication,
} from "../../internal/bolan/LouiseHelpers";
import { data } from "../../internal/bolan/TestdataBolan";
import {
   apartmentStep1,
   buyHouseStep1,
   houseStep1,
   oneApplicantStep2,
   oneApplicantStep3,
   step4,
   twoApplicantsStep2,
   twoApplicantsStep3BUY,
} from "../../internal/bolan/testStegBolan";

test("Kop2PersonerOlikaLanderVilla", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await buyHouseStep1(page);
   await numberOfApplicant2(page);
   await aboutMainApplicantStep2(page);
   await mainApplicantOlikaLander(page);
   await MainApplicantNoPep(page);
   await aboutCoApplicantStep2(page);
   await coApplicantCitizenSverige(page);
   await coApplicantPep(page);
   await doKidsLiveWithYou(page);
   await otherResidenciesNO(page);
   await sharedAccomodation(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
   page.close();
});
