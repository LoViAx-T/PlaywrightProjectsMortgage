import { test, expect } from "@playwright/test";
import {
   accomodationStep1HOJ,
   coApplicantOtherLoansHOJ,
   coApplicantStep1Hoj,
   coApplicantStep2HOJ,
   increaseMortgageHOJ,
   kidsHOJ,
   logInHoj,
   mainApplicantOtherLoansHOJ,
   mainApplicantStep1HOJ,
   mainApplicantStep2HOJ,
   otherResidenciesHOJ,
   sendApplicationHOJ,
   startHojApplication,
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

test("oneApplicantHOJ", async ({ page }) => {
   await logInHoj(page);
   await accomodationStep1HOJ(page);
   await increaseMortgageHOJ(page);
   await mainApplicantStep1HOJ(page);
   await sendApplicationHOJ(page);
});
