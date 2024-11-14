import { test, expect, Page } from "@playwright/test";
import { startFlyttApplication } from "../../internal/bolan/LouiseHelpers";
import { data } from "../../internal/bolan/TestdataBolan";
import {
   apartmentStep1,
   houseStep1,
   oneApplicantStep2,
   oneApplicantStep3,
   oneApplicantStep3HOJ,
   step4,
   twoApplicantsStep2,
   twoApplicantsStep3,
   twoApplicantsStep3HOJ,
} from "../../internal/bolan/testStegBolan";

test("FlyttHoj1PersonBrf", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await apartmentStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3HOJ(page);
   await step4(page);
});

test("FlyttHoj2PersonerBrf", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await apartmentStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3HOJ(page);
   await step4(page);
});

test("FlyttHoj1PersonVilla", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await houseStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3HOJ(page);
   await step4(page);
});

test("FlyttHoj2PersonerVilla", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await houseStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3HOJ(page);
   await step4(page);
   // page.close();
});
