import { test, expect } from "@playwright/test";
import { startBuyApplication } from "../../internal/bolan/LouiseHelpers";
import { data } from "../../internal/bolan/TestdataBolan";
import {
   apartmentStep1,
   buyApartmentStep1,
   buyHouseStep1,
   hPLApartmentStep1,
   hPLHouseStep1,
   houseStep1,
   oBLApartmentStep1,
   oneApplicantStep2,
   oneApplicantStep2OBL,
   oneApplicantStep3,
   oneApplicantStep3BUY,
   step4,
   twoApplicantsStep3BUY,
   twoApplicantsStep2,
   twoApplicantsStep2OBL,
   twoApplicantsStep3,
   twoApplicantsStep3HOJ,
   oBLHouseStep1,
} from "../../internal/bolan/testStegBolan";

test("Kop1PersonBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await buyApartmentStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("Kop2PersonerBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await buyApartmentStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("Kop1PersonVilla", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await buyHouseStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("Kop2PersonerVilla", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await buyHouseStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("HPL1PersonBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await hPLApartmentStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("HPL2PersonerBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await hPLApartmentStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("HPL1PersonVilla", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await hPLHouseStep1(page);
   await oneApplicantStep2(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("HPL2PersonerVilla", async ({ page }) => {
   test.slow();
   await startBuyApplication(page);
   await hPLHouseStep1(page);
   await twoApplicantsStep2(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("HplObl1personBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await hPLApartmentStep1(page);
   await oneApplicantStep2OBL(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("hplObl2PersonerBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await hPLApartmentStep1(page);
   await twoApplicantsStep2OBL(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("hplObl1PersonVilla", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await hPLHouseStep1(page);
   await oneApplicantStep2OBL(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("hplObl2PersonerVilla", async ({ page }) => {
   test.slow();
   await startBuyApplication(page);
   await hPLHouseStep1(page);
   await twoApplicantsStep2OBL(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("obl1PersonBrf", async ({ page }) => {
   test.slow();
   await startBuyApplication(page);
   await oBLApartmentStep1(page);
   await oneApplicantStep2OBL(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("obl2PersonerBrf", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await oBLApartmentStep1(page);
   await twoApplicantsStep2OBL(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});

test("obl1PersonVilla", async ({ page }) => {
   test.slow();

   await startBuyApplication(page);
   await oBLHouseStep1(page);
   await oneApplicantStep2OBL(page);
   await oneApplicantStep3BUY(page);
   await step4(page);
});

test("obl2PersonerVilla", async ({ page }) => {
   test.slow();
   await startBuyApplication(page);
   await oBLHouseStep1(page);
   await twoApplicantsStep2OBL(page);
   await twoApplicantsStep3BUY(page);
   await step4(page);
});
