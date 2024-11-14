import { getDepots } from "../../internal/api/coral_depots_api";
import { test, expect } from "../../internal/baseTest2";
import { dateYearMonthDay, login } from "../../internal/general";
import {
   OpenSavingsChildStep1,
   OpenSavingsChildStep2,
   OpenSavingsChildStep3,
   OpenSavingsChildStep4,
   cleanUsersAccounts,
   clickContinueButton,
   clickOpenSavingButton,
   openSavingsChildStep1,
   openSavingsChildStep2,
   openSavingsChildStep3,
   openSavingsChildStep3With2Adults,
   openSavingsChildStep4,
   openSavingsChildStep5,
   openSavingsChildStepFinal,
   scriveRejectSigning,
   scriveSignDocument,
   verifyDepotAccIsCreated,
   verifyScrive,
} from "../../internal/oppna-sparkonto/open-savings-account";
import { chooseEnvTestData } from "../../internal/testdata";

let testData = chooseEnvTestData().openSavingsAccountChild

let step1Data: OpenSavingsChildStep1 = {
   childSsn: "",
   existingAccount: true,
};

let step2Data: OpenSavingsChildStep2 = {
   childName: testData.childUnder16Yo.name,
   citizenships: ["Sverige"],
   countryOfResidence: "Sverige",
   taxResidence: ["Sverige"],
   pep: "Ingen av dessa",
};

const step3Data: OpenSavingsChildStep3 = {
   caregiverName: testData.guardian1.name,
   caregiverEmail: "PAULO.RYTTERLUND@ICATEST.SE",
   caregiverPhone: "0702345678",
   // caregiverPhone: "0735116153", // Oskar mobilnr
};

const step4Data: OpenSavingsChildStep4 = {
   applicationPurpose: "Bostad",
   investmentHorizon: "Långsiktigt (mer än 5 år)",
   depositFrequency: "En gång per månad",
   depositSource: "Lön",
   depositAmount: "100 - 5 000 SEK",
   understandRisks: true,
   understandValueLoss: true,
};



test.describe("Children with one guardian", () => {
   const guardian1Ssn = testData.guardian1.ssn;
   const childUnder16YoSsn = testData.childUnder16Yo.ssn;
   const childOver18YoSsn = testData.childOver18Yo.ssn;
   const childOver16YoSsn = testData.childOver16Yo.ssn;
   const childProtectedIdentitySsn = testData.childProtectedIdentity.ssn;


   test.beforeEach(async ({ page }) => {
      await page.goto("/spara/fondlista/oppna-depakonto-for-barn/");
   });

   test.use({ ssn: guardian1Ssn });

   test(
      "child over 16 occupation is not visible in summary",
      { tag: "@bugfix" },
      async ({ page, isMobile }) => {
         let step1DataO: OpenSavingsChildStep1 = {
            ...step1Data,
            childSsn: childOver16YoSsn,
         };

         let step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            occupation: "Studerande",
            childName: testData.childOver16Yo.name,
         };

         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);
         await expect(
            page.getByText("Vilken är barnets huvudsakliga sysselsättning").locator("xpath=.."),
         ).toContainText("Studerande");
      },
   );

   test.fixme(
      "KDK - child information is prefilled for existing user",
      { tag: "@functional" },
      async ({ page }) => {
         let step1DataO: OpenSavingsChildStep1 = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
         };

         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await test.step("step 2 (more info about the child) - verify kdk", async () => {
            // verify citizenship is prefilled
            await expect(
               page
                  .getByTestId("kyc.citizenships")
                  .locator('xpath=//div[contains(@class, "dropdown-header_selectedValue")]'),
            ).toHaveText("Sverige");

            // verify taxResidence is prefilled
            await expect(
               page
                  .getByTestId("kyc.taxResidences")
                  .locator('xpath=//div[contains(@class, "dropdown-header_selectedValue")]'),
            ).toHaveText("Sverige");

            // verify residency is prefilled
            await expect(
               page.locator('xpath=//label[contains(@class, "combo-button_active")]'),
            ).toContainText("Sverige");

            // verify pep is prefilled
            await expect(
               page
                  .getByTestId("kyc.pep")
                  .locator('xpath=//div[contains(@class, "dropdown-header_selectedValue")]'),
            ).toHaveText("Ingen av dessa");

            await clickContinueButton(page);
         });

         await test.step("step 3 (info about the guardian) - verify kdk", async () => {
            await expect(page.locator('[name="mobileNbr"]')).toHaveValue("0702345678");

            await expect(page.locator('[name="email"]')).toHaveValue("PAULO.RYTTERLUND@ICATEST.SE");
         });
      },
   );

   test(
      "Prevalidate - Open ISK account for child with invalid child SSN",
      { tag: "@functional" },
      async ({ page }) => {
         let step1DataO: OpenSavingsChildStep1 = {
            ...step1Data,
            childSsn: "9904290000",
         };
         await openSavingsChildStep1(page, step1DataO);
         await expect(page.getByText("Du har angivit ett felaktigt personnummer")).toBeVisible();
      },
   );

   test(
      "Prevalidate - Open ISK account for child with caregiver SSN",
      { tag: "@functional" },
      async ({ page }) => {
         const step1DataO = {
            ...step1Data,
            childSsn: guardian1Ssn,
         };
         await openSavingsChildStep1(page, step1DataO);
         await expect(
            page.getByText("Det gick inte att verifiera detta personnummer"),
         ).toBeVisible();
      },
   );

   test(
      "Prevalidate - Open ISK account for child over 18",
      { tag: "@functional" },
      async ({ page }) => {
         const step1DataO = {
            ...step1Data,
            childSsn: childOver18YoSsn,
         };
         await openSavingsChildStep1(page, step1DataO);
         await expect(
            page.getByText("Det gick inte att verifiera detta personnummer"),
         ).toBeVisible();
      },
   );

   test(
      "Prevalidate - Open depot account for child with protected identity",
      { tag: "@functional" },
      async ({ page }) => {
         let step1Data: OpenSavingsChildStep1 = {
            childSsn: childProtectedIdentitySsn,
            existingAccount: true,
         };
         await openSavingsChildStep1(page, step1Data);
         await expect(
            page.getByText(
               "Du kan inte öppna ett fondsparande för det här barnet eftersom barnet eller en av vårdnadshavarna har skyddad identitet.",
            ),
         ).toBeVisible();
      },
   );

   test(
      "create depot, residence: [swe], tax: [swe], country: swe, pep: no",
      { tag: "@integration" },
      async ({ page, isMobile }) => {
         await login(childUnder16YoSsn);
         await cleanUsersAccounts(childUnder16YoSsn);
         const step1DataO: OpenSavingsChildStep1 = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
            existingAccount: false,
         };

         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await openSavingsChildStep2(page, isMobile, step2Data);
         await clickContinueButton(page);

         await openSavingsChildStep3(page, step3Data);
         await clickContinueButton(page);

         await openSavingsChildStep4(page, isMobile, step4Data);
         await clickContinueButton(page);

         await openSavingsChildStep5(page);
         await clickContinueButton(page);

         await openSavingsChildStepFinal(page);
         await clickOpenSavingButton(page);

         await verifyScrive(page, true, step1DataO, step2Data, step3Data, guardian1Ssn);
         await scriveSignDocument(page);

         await expect(
            page.getByRole("heading", { name: "Nu är ditt konto för fondsparande öppnat" }),
         ).toBeVisible({ timeout: 15000 });

         await verifyDepotAccIsCreated(guardian1Ssn, step2Data.childName);
      },
   );

   test(
      "create depot, residence: [swe], tax: [nor], country: swe, pep: no",
      { tag: "@integration" },
      async ({ page, isMobile }) => {
         await login(childUnder16YoSsn);
         await cleanUsersAccounts(childUnder16YoSsn);
         const step1DataO = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
         };

         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            citizenships: ["Sverige"],
            taxResidence: ["Norge"],
            countryOfResidence: "Sverige",
         };

         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);

         await openSavingsChildStep3(page, step3Data);
         await clickContinueButton(page);

         await openSavingsChildStep4(page, isMobile, step4Data);
         await clickContinueButton(page);

         await openSavingsChildStep5(page);
         await clickContinueButton(page);

         await openSavingsChildStepFinal(page);
         await clickOpenSavingButton(page);

         await verifyScrive(page, true, step1DataO, step2Data, step3Data, guardian1Ssn);
         await scriveSignDocument(page);

         await expect(
            page.getByRole("heading", { name: "Nu är ditt konto för fondsparande öppnat!" }),
         ).toBeVisible({ timeout: 15000 });
         await verifyDepotAccIsCreated(guardian1Ssn, step2Data.childName);
      },
   );

   test(
      "create depot, residence: [swe,nor], tax: [swe,nor], country: nor, pep: no",
      { tag: "@integration" },
      async ({ page, isMobile }) => {
         await login(childUnder16YoSsn);
         await cleanUsersAccounts(childUnder16YoSsn);
         const step1DataO = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
         };
         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            citizenships: ["Sverige", "Norge"],
            taxResidence: ["Sverige", "Norge"],
            countryOfResidence: "Norge",
         };
         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);

         await openSavingsChildStep3(page, step3Data);
         await clickContinueButton(page);

         await openSavingsChildStep4(page, isMobile, step4Data);
         await clickContinueButton(page);

         await openSavingsChildStep5(page);
         await clickContinueButton(page);

         await openSavingsChildStepFinal(page);
         await clickOpenSavingButton(page);

         await verifyScrive(page, true, step1DataO, step2Data, step3Data, guardian1Ssn);
         await scriveSignDocument(page);

         await expect(
            page.getByRole("heading", { name: "Nu är ditt konto för fondsparande öppnat!" }),
         ).toBeVisible({ timeout: 15000 });
         await verifyDepotAccIsCreated(guardian1Ssn, step2Data.childName);
      },
   );

   test(
      "create depot, residence: [nor], tax: [nor], country: nor, pep: no",
      { tag: "@integration" },
      async ({ page, isMobile }) => {
         await login(childUnder16YoSsn);
         await cleanUsersAccounts(childUnder16YoSsn);
         const step1DataO = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
         };
         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            childName: testData.childUnder16Yo.name,
            citizenships: ["Norge"],
            taxResidence: ["Norge"],
            countryOfResidence: "Norge",
         };
         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);

         await openSavingsChildStep3(page, step3Data);
         await clickContinueButton(page);

         await openSavingsChildStep4(page, isMobile, step4Data);
         await clickContinueButton(page);

         await openSavingsChildStep5(page);
         await clickContinueButton(page);

         await openSavingsChildStepFinal(page);
         await clickOpenSavingButton(page);

         await scriveSignDocument(page);
         await verifyScrive(page, true, step1DataO, step2DataO, step3Data, guardian1Ssn);

         await expect(
            page.getByRole("heading", { name: "Nu är ditt konto för fondsparande öppnat!" }),
         ).toBeVisible({ timeout: 15000 });
         await verifyDepotAccIsCreated(guardian1Ssn, step2Data.childName);
      },
   );

   test(
      "create depot, child older than 16",
      { tag: "@integration" },
      async ({ page, isMobile }) => {
         await login(childOver16YoSsn);
         await cleanUsersAccounts(childOver16YoSsn);
         const step1Data: OpenSavingsChildStep1 = {
            childSsn: childOver16YoSsn,
            existingAccount: true,
         };

         await openSavingsChildStep1(page, step1Data);
         await clickContinueButton(page);

         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            childName: testData.childOver16Yo.name,
            occupation: "Studerande",
         };

         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);

         await openSavingsChildStep3(page, step3Data);
         await clickContinueButton(page);

         await openSavingsChildStep4(page, isMobile, step4Data);
         await clickContinueButton(page);

         await openSavingsChildStep5(page);
         await clickContinueButton(page);

         await openSavingsChildStepFinal(page);
         await clickOpenSavingButton(page);

         await scriveSignDocument(page);
         await verifyScrive(page, true, step1Data, step2DataO, step3Data, guardian1Ssn);

         await expect(
            page.getByRole("heading", { name: "Nu är ditt konto för fondsparande öppnat!" }),
         ).toBeVisible({ timeout: 15000 });
         await verifyDepotAccIsCreated(guardian1Ssn, step2DataO.childName);
      },
   );

   test(
      "create depot, residence: [swe,usa], tax: [swe,usa], country: usa, pep: no",
      { tag: "@functional" },
      async ({ page, isMobile }) => {
         const step1DataO: OpenSavingsChildStep1 = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
         };
         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            citizenships: ["Sverige", "USA"],
            taxResidence: ["Sverige", "USA"],
            countryOfResidence: "USA",
         };
         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);
         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);

         await expect(
            page.getByText(
               "Det går tyvärr inte att öppna ett depåkonto för barn om man är bosatt i USA, Kanada, Japan eller Australien på grund av rapporteringsskyldighet.",
            ),
         ).toBeVisible();

         await expect(
            page.getByText(
               "Du kan inte starta ett fondsparande för ditt barn om barnet har sin skatterättsliga hemvist i detta land.",
            ),
         ).toBeVisible();

         await expect(
            page.getByText(
               "Det går tyvärr inte att öppna ett depåkonto för barn om man har ett medborgarskap i USA, Kanada, Japan, Australien, Ryssland och Belarus på grund av rapporteringsskyldighet.",
            ),
         ).toBeVisible();
      },
   );

   test(
      "create depot, someone related is pep",
      { tag: "@integration" },
      async ({ page, isMobile }) => {
         await login(childUnder16YoSsn);
         await cleanUsersAccounts(childUnder16YoSsn);
         const step1DataO = {
            ...step1Data,
            childSsn: childUnder16YoSsn,
         };

         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            pep: "Parlamentsledamot",
            whoIsPep: "Förälder",
         };

         await openSavingsChildStep1(page, step1DataO);
         await clickContinueButton(page);

         await openSavingsChildStep2(page, isMobile, step2DataO);
         await clickContinueButton(page);

         await openSavingsChildStep3(page, step3Data);
         await clickContinueButton(page);

         await openSavingsChildStep4(page, isMobile, step4Data);
         await clickContinueButton(page);

         await openSavingsChildStep5(page);
         await clickContinueButton(page);

         await openSavingsChildStepFinal(page);
         await clickOpenSavingButton(page);

         await scriveSignDocument(page);
         await verifyScrive(page, true, step1DataO, step2DataO, step3Data, guardian1Ssn);
         await expect(
            page.getByRole("heading", { name: "Vi behandlar ditt ärende" }),
         ).toBeVisible();
      },
   );

   test("create depot, reject scrive", { tag: "@integration" }, async ({ page, isMobile }) => {
      await cleanUsersAccounts(childUnder16YoSsn);
      const step1DataO = {
         ...step1Data,
         childSsn: childUnder16YoSsn,
      };
      await openSavingsChildStep1(page, step1DataO);
      await clickContinueButton(page);

      await openSavingsChildStep2(page, isMobile, step2Data);
      await clickContinueButton(page);

      await openSavingsChildStep3(page, step3Data);
      await clickContinueButton(page);

      await openSavingsChildStep4(page, isMobile, step4Data);
      await clickContinueButton(page);

      await openSavingsChildStep5(page);
      await clickContinueButton(page);

      await openSavingsChildStepFinal(page);
      await clickOpenSavingButton(page);

      await scriveRejectSigning(page);
      await expect(page.getByRole("heading", { name: "Dokumentet går inte längre" })).toBeVisible();
   });
});

test.describe("Children with 2 parents", () => {
   // byt ut dessa kunder till andra kunder, just nu stör dessa sälj fonder 
   const guardian1SSN = testData.guardian2.ssn;
   const guardian2SSN = testData.guardian3.ssn;
   const childSSN = testData.child2Guardians.ssn;

   test(
      "Open depot, residence: [swe], tax: [swe], country: swe, pep: no",
      { tag: "@integration" },
      async ({ browser, isMobile }) => {
         await login(guardian1SSN);
         await login(childSSN);
         await cleanUsersAccounts(childSSN);

         // await cleanUsersAccounts(childSSN);
         const step1DataO: OpenSavingsChildStep1 = {
            ...step1Data,
            childSsn: childSSN,
         };

         const step2DataO: OpenSavingsChildStep2 = {
            ...step2Data,
            citizenships: ["Sverige"],
            taxResidence: ["Sverige"],
            countryOfResidence: "Sverige",
            childName: testData.child2Guardians.name,
         };

         const step3DataGuardian: OpenSavingsChildStep3 = {
            caregiverEmail: "magnus@mail.com",
            caregiverName: testData.guardian2.name,
            caregiverPhone: "0707183398", // fake mobil nr
            // caregiverPhone: "0735116153", // Oskar mobil nr
         };

         const step3DataOtherGuardian: OpenSavingsChildStep3 = {
            caregiverEmail: "Jenny@mail.com",
            caregiverName: testData.guardian3.name,
            caregiverPhone: "0707183399", // fake mobil nr
            // caregiverPhone: "0764965778", // ebbas mobil nr
         };

         const guardian1 = await browser.newContext({ storageState: `.auth/${guardian1SSN}.json` });
         const guardian1Page = await guardian1.newPage();
         await guardian1Page.context().addInitScript(() => {
            window.sessionStorage.setItem(
               "ICABanken:importantMessagesChecked",
               '{"hasClosedImportantMessagesAtLogin":true}',
            );
         });
         await guardian1Page.goto("/spara/fondlista/oppna-depakonto-for-barn/");

         await openSavingsChildStep1(guardian1Page, step1DataO);
         await clickContinueButton(guardian1Page);

         await openSavingsChildStep2(guardian1Page, isMobile, step2DataO);
         await clickContinueButton(guardian1Page);

         await openSavingsChildStep3With2Adults(
            guardian1Page,
            step3DataGuardian,
            step3DataOtherGuardian,
         );
         await clickContinueButton(guardian1Page);

         await openSavingsChildStep4(guardian1Page, isMobile, step4Data);
         await clickContinueButton(guardian1Page);

         await openSavingsChildStep5(guardian1Page);
         await clickContinueButton(guardian1Page);

         await openSavingsChildStepFinal(guardian1Page);

         await clickOpenSavingButton(guardian1Page);
         await verifyScrive(
            guardian1Page,
            true,
            step1DataO,
            step2DataO,
            step3DataGuardian,
            guardian1SSN,
         ); // förbättra den här funktionen
         await scriveSignDocument(guardian1Page);

         await expect(guardian1Page.getByRole("heading", { name: "Nästan klart!" })).toBeVisible({
            timeout: 20000,
         });

         await guardian1Page.goto("/min-ekonomi/pagaende-arenden/");

         await guardian1Page
            .getByRole("link", { name: "Depåkonto för barn" })
            .filter({ hasText: `Skapades ${dateYearMonthDay()}` })
            .first()
            .click();

         await expect(
            guardian1Page.getByRole("heading", { name: "Väntar på din medsökande" }),
         ).toBeVisible();
         await expect(guardian1Page.getByText("Du har signerat avtalet")).toBeVisible();

         await guardian1Page.close();

         await login(guardian2SSN);

         const guardian2 = await browser.newContext({ storageState: `.auth/${guardian2SSN}.json` });
         const guardian2Page = await guardian2.newPage();

         await guardian2Page.context().addInitScript(() => {
            window.sessionStorage.setItem(
               "ICABanken:importantMessagesChecked",
               '{"hasClosedImportantMessagesAtLogin":true}',
            );
         });
         // Guardian 2
         await guardian2Page.goto("/min-ekonomi/pagaende-arenden/");

         await expect(
            guardian2Page.getByRole("heading", { name: "Mina pågående ärenden" }),
         ).toBeVisible();

         await guardian2Page
            .getByRole("link", { name: "depåkonto för barn" })
            .filter({ hasText: `Skapades ${dateYearMonthDay()}` })
            .first()
            .click();
         // await guardian2Page
         await expect(
            guardian2Page.getByText("Den andra sökande har signerat avtalet"),
         ).toBeVisible();
         await guardian2Page.getByRole("link", { name: "Signera avtal" }).click();
         await verifyScrive(
            guardian2Page,
            true,
            step1DataO,
            step2DataO,
            step3DataOtherGuardian,
            guardian2SSN,
         );
         await scriveSignDocument(guardian2Page);
         await expect(
            guardian2Page.getByRole("heading", { name: "Nu är ditt konto för fondsparande öppnat" }),
         ).toBeVisible({ timeout: 15000 });

         await guardian2Page.close();

         await verifyDepotAccIsCreated(guardian1SSN, testData.child2Guardians.name);
      },
   );
});
