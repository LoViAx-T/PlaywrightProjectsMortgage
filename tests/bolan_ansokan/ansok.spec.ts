import { Page } from "@playwright/test";
import { test, expect } from "../../internal/baseTest2";

// const ssn = "192107160018";
// test.use({ storageState: { cookies: [], origins: [] } });

test.describe.skip("TBD - bolån tester", () => {
   test.beforeEach(async ({ page }) => {
      await page.goto("/lana/bolan/bolan-bolaneansokan/ansokan-nytt-bolan/");
   });

   let testAboutResidenceHouse: ITestDataAboutResidenceHouse = {
      residenceCost: "2000000",
      villaInfoAddress: "Infanterigatan 6",
      villaInfoZipCode: "11227",
      operatingCost: "2000",
      mortgageAmount: "500000",
      insuranceCompanyCode: "ICA Försäkring",
      hasFireInsuranceFullValue: true,
      fireInsuranceValue: "",
      permanentResidency: true,
      needsCashDepositLoan: true,
      sourceOfCashDeposit: ["Eget sparande", "Lån"],
   };

   let testAboutResidenceApartament: ITestDataAboutResidenceApartament = {
      residenceCost: "2000000",
      apartmentInfoApartmentNumber: "1101",
      apartmentInfoApartmentArea: "50",
      apartmentInfoMonthlyFee: "3000",
      apartmentInfoAddress: "Lovartsvägen 44",
      apartmentInfoZipCode: "18135",
      operatingCost: "2500",
      mortgageAmount: "500000",
      insuranceCompanyCode: "ICA Försäkring",
      permanentResidency: true,
      needsCashDepositLoan: true,
      sourceOfCashDeposit: ["Eget sparande", "Försäljning tidigare bostad", "Lån"],
   };

   let testVacationHome: ITestDataAboutResidenceVacation = {
      residenceCost: "500000",
      cottageInfoAddress: "Infanterigatan 6",
      cottageInfoZipCode: "11227",
      operatingCost: "1000",
      mortgageAmount: "200000",
      insuranceCompanyCode: "ICA Försäkring",
      hasFireInsuranceFullValue: true,
      fireInsuranceValue: "",
      permanentResidency: false,
      needsCashDepositLoan: false,
      sourceOfCashDeposit: ["Eget sparande", "Lån"],
   };

   let testAboutMainApplicant: ITestDataAboutApplicant = {
      applicantFirstName: "Fredde",
      applicantLastName: "Schiller",
      applicantMobileNumber: "0768360000",
      applicantEmail: "fredde.schiller@test.com",
      applicantRelationshipStatus: "Gift/Registrerad partner",
      applicantCitizenships: ["sverige", "norge"],
      applicantCountryOfResidenceSweden: true,
      applicantTaxResidences: [{ country: "sverige" }],
      applicantPep: "Ingen av dessa",
   };

   test("ansök om bolån house", async ({ page }) => {
      await test.step("Om bostaden", async () => {
         await aboutHouseStep1(page, testAboutResidenceHouse);
         await page.getByRole("button").filter({ hasText: "fortsätt till steg 2" }).click();
      });

      await test.step("Om sökande", async () => {
         await aboutApplicantStep2(page, testAboutMainApplicant);
         await page.getByRole("button").filter({ hasText: "fortsätt till steg 3" }).click();
      });

      await test.step("Applicants economy", async () => {
         await applicantEconomyStep3(page);
      });
   });

   async function aboutHouseStep1(page: Page, data: ITestDataAboutResidenceHouse): Promise<void> {
      await expect(page.getByRole("heading").first()).toHaveText("Ansök om bolån");
      await page.getByTestId("typeOfResidence").locator("label", { hasText: "villa" }).click();
      await page.locator('[name="residenceCost"]').fill(data.residenceCost);
      await page.locator('[name="villaInfo.address"]').fill(data.villaInfoAddress);
      await page.locator('[name="villaInfo.zipCode"]').fill(data.villaInfoZipCode);
      await page.locator('[name="operatingCost"]').fill(data.operatingCost);
      await page.locator('[name="mortgageAmount"]').fill(data.mortgageAmount);

      await page.getByTestId("insuranceCompanyCode").click();
      await page
         .getByTestId("insuranceCompanyCode")
         .locator("li")
         .filter({ hasText: data.insuranceCompanyCode })
         .click();

      if (data.hasFireInsuranceFullValue === true) {
         await page.getByTestId("hasFireInsuranceFullValue").locator("label", { hasText: "Ja" }).click();
      } else {
         await page.getByTestId("hasFireInsuranceFullValue").locator("label", { hasText: "nej" }).click();
         await page.locator("[name=fireInsuranceValue]").fill(data.fireInsuranceValue);
      }

      await page
         .getByTestId("permanentResidency")
         .locator("label", { hasText: data.permanentResidency ? "Ja" : "nej" })
         .click();

      await page
         .getByTestId("needsCashDepositLoan")
         .locator("label", { hasText: data.needsCashDepositLoan ? "ja" : "nej" })
         .click();

      for (let alt of data.sourceOfCashDeposit) await page.getByTestId("sourceOfCashDeposit").getByText(alt).click();
   }

   async function aboutApartamentStep1(page: Page, data: ITestDataAboutResidenceApartament): Promise<void> {
      await page.getByTestId("typeOfResidence").locator("label", { hasText: "bostadsrätt" }).click();
      await page.locator('[name="residenceCost"]').fill(data.residenceCost);
      await page.locator('[name="apartmentInfo.apartmentNumber"]').fill(data.apartmentInfoApartmentNumber);
      await page.locator('[name="apartmentInfo.apartmentArea"]').fill(data.apartmentInfoApartmentArea);
      await page.locator('[name="apartmentInfo.monthlyFee"]').fill(data.apartmentInfoMonthlyFee);
      await page.locator('[name="apartmentInfo.address"]').fill(data.apartmentInfoAddress);
      await page.locator('[name="apartmentInfo.zipCode"]').fill(data.apartmentInfoZipCode);
      await page.locator('[name="operatingCost"]').fill(data.operatingCost);
      await page.locator('[name="mortgageAmount"]').fill(data.mortgageAmount);

      await page.locator('xpath=//div[contains(@class, "dropdown-list_list")]').click();
      await page
         .locator('xpath=//div[contains(@class, "dropdown-list_list")]')
         .locator("ul")
         .locator("li")
         .filter({ hasText: data.insuranceCompanyCode })
         .click();

      await page
         .getByTestId("permanentResidency")
         .locator("label", { hasText: data.permanentResidency ? "Ja" : "nej" })
         .click();

      await page
         .getByTestId("needsCashDepositLoan")
         .locator("label", { hasText: data.needsCashDepositLoan ? "ja" : "nej" })
         .click();

      for (let alt of data.sourceOfCashDeposit) await page.getByTestId("sourceOfCashDeposit").getByText(alt).click();
   }

   async function aboutVacationHomeStep1(page: Page, data: ITestDataAboutResidenceVacation): Promise<void> {
      await page.getByTestId("typeOfResidence").locator("label", { hasText: "fritidshus" }).click();
      await page.locator('[name="residenceCost"]').fill(data.residenceCost);
      await page.locator('[name="cottageInfo.address"]').fill(data.cottageInfoAddress);
      await page.locator('[name="cottageInfo.zipCode"]').fill(data.cottageInfoZipCode);
      await page.locator('[name="operatingCost"]').fill(data.operatingCost);
      await page.locator('[name="mortgageAmount"]').fill(data.mortgageAmount);
      await page.locator('[name="mortgageAmount"]').fill(data.mortgageAmount);

      await page.locator('xpath=//div[contains(@class, "dropdown-list_list")]').click();
      await page
         .locator('xpath=//div[contains(@class, "dropdown-list_list")]')
         .locator("ul")
         .locator("li")
         .filter({ hasText: data.insuranceCompanyCode })
         .click();

      if (data.hasFireInsuranceFullValue === true) {
         await page.getByTestId("hasFireInsuranceFullValue").locator("label", { hasText: "Ja" }).click();
      } else {
         await page.getByTestId("hasFireInsuranceFullValue").locator("label", { hasText: "nej" }).click();
         await page.locator("[name=fireInsuranceValue]").fill(data.fireInsuranceValue);
      }

      await page
         .getByTestId("permanentResidency")
         .locator("label", { hasText: data.permanentResidency ? "Ja" : "nej" })
         .click();

      await page
         .getByTestId("needsCashDepositLoan")
         .locator("label", { hasText: data.needsCashDepositLoan ? "ja" : "nej" })
         .click();

      for (let alt of data.sourceOfCashDeposit) await page.getByTestId("sourceOfCashDeposit").getByText(alt).click();
   }

   async function aboutApplicantStep2(
      page: Page,
      mainApplicant: ITestDataAboutApplicant,
      secondApplicant?: ITestDataAboutApplicant,
   ): Promise<void> {
      await page.getByTestId("noApplicants").locator("label", { hasText: "1 Person" }).click();
      await page.locator('[name="applicant1.firstName"]').fill(mainApplicant.applicantFirstName);
      await page.locator('[name="applicant1.lastName"]').fill(mainApplicant.applicantLastName);
      await page.locator('[name="applicant1.mobileNumber"]').fill(mainApplicant.applicantMobileNumber);
      await page.locator('[name="applicant1.email"]').fill(mainApplicant.applicantEmail);

      await page.getByText(mainApplicant.applicantRelationshipStatus).click();

      let counter = 0;
      for (let item of mainApplicant.applicantCitizenships) {
         await page.locator(`#citizenship_${counter}`).click();
         await page.locator(`#citizenship_${counter}`).locator("li").filter({ hasText: item }).click();

         let b = page.getByRole("button", { name: "lägg till medborgarskap" });
         if (counter < mainApplicant.applicantCitizenships.length - 1) {
            await b.click();
         }
         counter++;
      }

      await page
         .getByTestId("applicant1.countryOfResidence")
         .locator("label", { hasText: mainApplicant.applicantCountryOfResidenceSweden ? "Sverige" : "annat land" })
         .click();

      let otherResidency = page.getByTestId("applicant1.otherCountryOfResidence");
      if (await otherResidency.isVisible()) {
         await otherResidency.click();
         await otherResidency.locator("li").filter({ hasText: mainApplicant.applicantOtherCountryOfResidence }).click();
      }

      let counter2 = 0;
      for (let item of mainApplicant.applicantTaxResidences) {
         await page.locator(`#taxResidence_${counter2}`).click();
         await page.locator(`#taxResidence_${counter2}`).locator("li").filter({ hasText: item.country }).click();
         if (item.country !== "sverige")
            await page.locator(`[name="applicant1.taxResidences.${counter2}.tin"]`).fill(item.tin);

         let b = page.getByRole("button", { name: "skatterättslig hemvist" });
         if (counter2 < mainApplicant.applicantTaxResidences.length - 1) {
            await b.click();
         }
         counter2++;
      }

      await page.getByTestId("applicant1.pep").click();
      await page.getByTestId("applicant1.pep").locator("li").filter({ hasText: mainApplicant.applicantPep }).click();

      if (mainApplicant.applicantPep !== "Ingen av dessa") {
         await page.getByTestId("applicant1.pepRelative").click();
         await page
            .getByTestId("applicant1.pepRelative")
            .locator("li")
            .filter({ hasText: mainApplicant.applicantPep })
            .click();
      }
   }

   async function applicantEconomyStep3(page: Page): Promise<void> {
      await page.locator("[name=affectYourInterest]").fill("6");
      await page.getByTestId("doKidsLiveWithYou").locator("label", { hasText: "ja" }).click();

      let arrKids: kid[] = [
         {
            age: "18",
            custody: "halvtid",
            childSupportGet: true,
            childSupportPay: true,
         },
         {
            age: "1",
            custody: "heltid",
            childSupportGet: false,
            childSupportPay: true,
         },
      ];
      let counter = 0;
      for (let kid of arrKids) {
         await page.getByTestId(`kids.${counter}.age`).click();
         await page.getByTestId(`kids.${counter}.age`).locator("li").filter({ hasText: kid.age }).first().click();
         await page.getByTestId(`kids.${counter}.custody`).locator("label", { hasText: kid.custody }).click();
         await page
            .getByTestId(`kids.${counter}.childSupportGet`)
            .locator("label", { hasText: kid.childSupportGet ? "Ja" : "nej" })
            .click();
         await page
            .getByTestId(`kids.${counter}.childSupportPay`)
            .locator("label", { hasText: kid.childSupportPay ? "Ja" : "nej" })
            .click();

         let b = page.getByRole("button", { name: "Lägg till ett barn" });
         if (counter < arrKids.length - 1) {
            await b.click();
         }
         counter++;
      }
      let ownsOtherR = true;

      let otherResidencies: otherResidence[] = ["Bostadsrätt", "Villa", "Hyresrätt"];

      let villaData: otherResidenceVillaFritidshus = {
         keepResidence: false,
         operatingCost: "2000",
         hasGroundRent: true,
         groundRentAmount: "2000",
         hasLoan: true,
         sizeOfLoan: "2000000",
         estimatedSaleAmount: "5000000",
         accomodationBrokerFee: "250000",
         accomodationConveyenceDate: "2023-10-31",
      };

      let bostadsrattData: otherResidenceBostadsratt = {
         keepResidence: true,
         fee: "8000",
         operatingCost: "1509",
         hasLoan: true,
         sizeOfLoan: "2000000",
      };

      let hyresrattData: otherResidenceHyresratt = {
         keepResidence: true,
         fee: "8000",
      };

      await page
         .getByTestId("ownsOtherResidencies")
         .locator("label", { hasText: ownsOtherR ? "ja" : "nej" })
         .click();

      if (ownsOtherR) {
         let counter2 = 0;
         for (let r of otherResidencies) {
            await page.getByTestId(`otherResidencies.${counter2}.typeOfOtherResidence`).click();
            await page
               .getByTestId(`otherResidencies.${counter2}.typeOfOtherResidence`)
               .locator("li")
               .filter({ hasText: r })
               .click();
            switch (r) {
               case "Villa":
               case "Fritidshus":
                  await page
                     .getByTestId(`otherResidencies.${counter2}.keepResidence`)
                     .locator("label", { hasText: villaData.keepResidence ? "ja" : "nej" })
                     .click();
                  await page
                     .locator(`[name="otherResidencies.${counter2}.operatingCost"]`)
                     .fill(villaData.operatingCost);
                  await page
                     .getByTestId(`otherResidencies.${counter2}.hasGroundRent`)
                     .locator("label", { hasText: villaData.hasGroundRent ? "ja" : "nej" })
                     .click();
                  if (villaData.hasGroundRent)
                     await page
                        .locator(`[name="otherResidencies.${counter2}.groundRentAmount"]`)
                        .fill(villaData.groundRentAmount);
                  await page
                     .getByTestId(`otherResidencies.${counter2}.hasLoan`)
                     .locator("label", { hasText: villaData.hasLoan ? "ja" : "nej" })
                     .click();
                  if (villaData.hasGroundRent)
                     await page
                        .locator(`[name="otherResidencies.${counter2}.sizeOfLoan"]`)
                        .first()
                        .fill(villaData.sizeOfLoan);
                  await page.keyboard.press("Enter");

                  await page
                     .locator(`[name="otherResidencies.${counter2}.estimatedSaleAmount"]`)
                     .fill(villaData.estimatedSaleAmount);
                  if (villaData.accomodationBrokerFee)
                     await page
                        .locator(`[name="otherResidencies.${counter2}.accomodationBrokerFee"]`)
                        .fill(villaData.accomodationBrokerFee);

                  await page
                     .locator(`[name="otherResidencies.${counter2}.accomodationConveyenceDate"]`)
                     .fill(villaData.accomodationConveyenceDate);
                  await page.locator("body").click();
                  break;

               case "Bostadsrätt":
                  await page
                     .getByTestId(`otherResidencies.${counter2}.keepResidence`)
                     .locator("label", { hasText: bostadsrattData.keepResidence ? "ja" : "nej" })
                     .click();
                  if (bostadsrattData.keepResidence)
                     await page.locator(`[name="otherResidencies.${counter2}.fee"]`).fill(bostadsrattData.fee);
                  await page
                     .locator(`[name="otherResidencies.${counter2}.operatingCost"]`)
                     .fill(bostadsrattData.operatingCost);
                  await page
                     .getByTestId(`otherResidencies.${counter2}.hasLoan`)
                     .locator("label", { hasText: bostadsrattData.hasLoan ? "ja" : "nej" })
                     .click();
                  if (villaData.hasGroundRent)
                     await page
                        .locator(`[name="otherResidencies.${counter2}.sizeOfLoan"]`)
                        .first()
                        .fill(bostadsrattData.sizeOfLoan);
                  await page.keyboard.press("Enter");
                  break;

               case "Hyresrätt":
                  await page
                     .getByTestId(`otherResidencies.${counter2}.keepResidence`)
                     .locator("label", { hasText: hyresrattData.keepResidence ? "ja" : "nej" })
                     .click();
                  if (hyresrattData.keepResidence)
                     await page.locator(`[name="otherResidencies.${counter2}.fee"]`).fill(hyresrattData.fee);
                  break;
            }

            let b = page.getByRole("button", { name: "lägg till ett boende" });
            if (counter2 < otherResidencies.length - 1) {
               await b.click();
            }
            counter2++;
         }
      }

      type typeOfWorkValues =
         | "Tillsvidareanställning"
         | "Pensionär"
         | "Studerande"
         | "Tidsbegränsad anställning"
         | "Egen företagare"
         | "Arbetssökande";

      let typeOfWork: typeOfWorkValues = "Tillsvidareanställning";
      await page.getByTestId("mainApplicantInfo.typeOfWork").click();
      await page.getByTestId("mainApplicantInfo.typeOfWork").locator("li").filter({ hasText: typeOfWork }).click();
   }
});
