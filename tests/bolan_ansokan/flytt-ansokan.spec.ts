import { test, expect, Page } from "@playwright/test";
import { startFlyttApplication } from "../../internal/bolan/LouiseHelpers";
import { data } from "../../internal/bolan/TestdataBolan";
import { afterEach } from "node:test";
import {
   apartmentStep1,
   houseStep1,
   oneApplicantStep2,
   oneApplicantStep3,
   step4,
   twoApplicantsStep2,
   twoApplicantsStep3,
} from "../../internal/bolan/testStegBolan";

test("Flytt1personBrf", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await apartmentStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3(page);
   await step4(page);
});

test("flytt2PersonerBrf", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await apartmentStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3(page);
   await step4(page);
});

test("Flytt1personVilla", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await houseStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3(page);
   await step4(page);
});

test("Flytt2PersonerVilla", async ({ page }) => {
   test.slow();
   await startFlyttApplication(page);
   await houseStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3(page);
   await step4(page);
   //page.close();
});
