import { APIRequest, APIResponse, Locator, Page, expect } from "@playwright/test";
import { apiRequest } from "../api";
import { MFQuery } from "../mf";
import { capitalizeFirstLetter, getSsn } from "../general";
import { getDepots } from "../api/coral_depots_api";

export type OpenSavingsChildStep1 = {
   childSsn: string;
   existingAccount: boolean;
}

export type OpenSavingsChildStep2 = {
   childName: string;
   citizenships: string[];
   occupation?: string
   taxResidence: string[];
   countryOfResidence: string;
   pep: string;
   whoIsPep?: string;
}

export type OpenSavingsChildStep3 = {
   caregiverName: string;
   caregiverPhone: string;
   caregiverEmail: string;
}

export type OpenSavingsChildStep4 = {
   applicationPurpose: string;
   investmentHorizon: string;
   depositFrequency: string;
   depositSource: string;
   depositAmount: string;
   understandRisks: boolean;
   understandValueLoss: boolean;
};

export type AdultStep1DataPersonUppgifter = {
   mobileNbr: string;
   email: string;
   occupation: string;
   monthlyIncome: string;
   citizenships: string[];
   taxResidences: string[];
   countryOfResidence: string;
   pep: string;
};

export interface FundUnderagePayload {
  add_new_account: boolean
  applicants: Applicant[]
  approve_marketing_insurance: boolean
  approved_timestamp: string
  customer_classification_timestamp: string
  fund_type: string
  ident_bankid: boolean
  md16_investment_horizon_code: string
  md19_normal_saving_code: string
  md81_main_purpose_saving_code: string
  md86_frequence_saving_code: string
  md87_money_source_code: string
  redirect_link: string
}

export interface Applicant {
  applicant_type: string
  authentication_level: string
  city: string
  co_attention_name: string
  email_address: string
  first_name: string
  kdk_timestamp: string
  last_name: string
  mobile: string
  personal_number: number
  phone: string
  street: string
  zip_code: number
}

export async function openSavingsChildStep1(page: Page, data: OpenSavingsChildStep1) {
   await page.locator("[name=personalIdentityNbr]").fill(data.childSsn);
   if (data.existingAccount) await page.getByTestId("ukAccount").locator("label").first().click();
   else await page.getByTestId("ukAccount").locator("label").nth(1).click();
}

export async function openSavingsChildStep2(
   page: Page,
   isMobile: boolean,
   data: OpenSavingsChildStep2,
) {
   await expect(page.locator('xpath=//div[contains(@class, "user-badge_name")]')).toHaveText(
      data.childName,
      { ignoreCase: true, timeout: 10_000 },
   );

   let btns;
   if (isMobile) {
      btns = await page.locator("xpath=//button[contains(@class, 'form-repeater-item_deleteBtn')]").all();
   }else {
      btns = await page.locator("button", { hasText: "Ta bort" }).all();
   }
   for (let i = 0; i < btns.length; i++) {
      await btns[0].click();
   }

   let ic = 0;
   for (let ele of data.citizenships) {
      if (isMobile) {
         await page.locator("select[name='kyc.citizenships']").nth(ic).selectOption(ele);
      } else {
         await page.getByTestId(`kyc.citizenships.${ic}.code`).click();
         await page.getByTestId(`kyc.citizenships.${ic}.code`).locator("li", { hasText: ele }).click();
      }

      if (ic !== data.citizenships.length - 1)
         await page.getByRole("button", { name: "lägg till medborgarskap" }).click();
      ic++;
   }

   if (data.occupation) {
      if (isMobile) {
         await page.locator("select[name='kyc.occupation']").selectOption(data.occupation);
      } else {
         await page.getByTestId("kyc.occupation").click();
         await page
            .getByTestId("kyc.occupation")
            .locator("li", { hasText: data.occupation })
            .click();
      }
   }

   let it = 0;
   for (let ele of data.taxResidence) {
      if (isMobile) {
         await page
            .locator("select[name='kyc.taxResidences']")
            .nth(it)
            .selectOption({ label: ele });
      } else {
         // kyc.taxResidences.0.country.code
         await page.getByTestId(`kyc.taxResidences.${it}.country.code`).click();
         await page
            .getByTestId(`kyc.taxResidences.${it}.country.code`)
            .locator("li", { hasText: ele })
            .click();
      }
      if (it !== data.taxResidence.length - 1)
         await page.getByRole("button", { name: "skatterättslig hemvist" }).click();
      it++;
   }

   if (data.countryOfResidence.toLocaleLowerCase() === "sverige")
      await page
         .getByTestId("kyc.countryOfResidence")
         .locator("label", { hasText: "sverige" })
         .click();
   else {
      await page
         .getByTestId("kyc.countryOfResidence")
         .locator("label", { hasText: "annat land" })
         .click();
      if (isMobile) {
         await page
            .locator("select[name='kyc.otherCountryOfResidence']")
            .selectOption({ label: data.countryOfResidence });
      } else {
         await page.getByTestId("kyc.otherCountryOfResidence").click();
         let re = new RegExp(`^${data.countryOfResidence}`, "i");
         await page
            .getByTestId("kyc.otherCountryOfResidence")
            .locator("li", { hasText: re })
            .click({ force: true });
      }
   }

   if (isMobile) {
      await page.locator("select[name='kyc.pep']").selectOption({ label: data.pep });
      if (data.pep.toLowerCase() !== "ingen av dessa" && data.whoIsPep) {
         await page
            .locator("select[name='kyc.pepRelative']")
            .selectOption({ label: data.whoIsPep });
      }
   } else {
      await page.getByTestId("kyc.pep").click();
      await page.getByTestId("kyc.pep").locator("li", { hasText: data.pep }).click({ force: true });
      if (data.pep.toLowerCase() !== "ingen av dessa" && data.whoIsPep) {
         await page.getByTestId("kyc.pepRelative").click();
         await page
            .getByTestId("kyc.pepRelative")
            .locator("li", { hasText: data.whoIsPep })
            .click({ force: true });
      }
   }
}

export async function openSavingsChildStep3(page: Page, data: OpenSavingsChildStep3) {
   await expect(page.locator('xpath=//div[contains(@class, "user-badge_name")]')).toHaveText(data.caregiverName, { ignoreCase: true });
   await page.locator("[name=mobileNbr]").fill(data.caregiverPhone)
   await page.locator("[name=email]").fill(data.caregiverEmail)
}

export async function openSavingsChildStep3With2Adults(page:Page, dataGuardian: OpenSavingsChildStep3, dataOtherGuardian: OpenSavingsChildStep3) {
   await expect(page.locator('xpath=//div[contains(@class, "user-badge_name")]').first()).toHaveText(dataGuardian.caregiverName, { ignoreCase: true });
   await page.locator("[name=mobileNbr]").fill(dataGuardian.caregiverPhone);
   await page.locator("[name=email]").fill(dataGuardian.caregiverEmail);

   await expect(page.locator('xpath=//div[contains(@class, "user-badge_name")]').nth(1)).toHaveText(dataOtherGuardian.caregiverName, { ignoreCase: true });
   await page.locator("[name=otherGuardianMobileNbr]").fill(dataOtherGuardian.caregiverPhone);
   await page.locator("[name=otherGuardianEmail]").fill(dataOtherGuardian.caregiverEmail);
}

export async function openSavingsChildStep4(page: Page, isMobile:boolean, data: OpenSavingsChildStep4) {
   if (isMobile) {
      await page.locator("select[name=applicationPurposeId]").selectOption({ label: data.applicationPurpose});
      await page.locator("select[name=investmentHorizonId]").selectOption({ label: data.investmentHorizon});
      await page.locator("select[name=depositFrequencyId]").selectOption({ label: data.depositFrequency});
      await page.locator("select[name=depositSourceId]").selectOption({ label: data.depositSource});
      await page.locator("select[name=depositAmountId]").selectOption({ label: data.depositAmount});
   } else {
      await page.getByTestId("applicationPurposeId").click();
      await page
         .getByTestId("applicationPurposeId")
         .locator("li", { hasText: data.applicationPurpose })
         .click();
      await page.getByTestId("investmentHorizonId").click();
      await page
         .getByTestId("investmentHorizonId")
         .locator("li", { hasText: data.investmentHorizon })
         .click();
      await page.getByTestId("depositFrequencyId").click();
      await page
         .getByTestId("depositFrequencyId")
         .locator("li", { hasText: data.depositFrequency })
         .click();
      await page.getByTestId("depositSourceId").click();
      await page
         .getByTestId("depositSourceId")
         .locator("li", { hasText: data.depositSource })
         .click();
      await page.getByTestId("depositAmountId").click();
      await page
         .getByTestId("depositAmountId")
         .locator("li", { hasText: data.depositAmount })
         .click();
   }
   
   await page
      .getByTestId("understandRisks")
      .locator("label")
      .filter({ hasText: data.understandRisks ? /^Ja$/ : /^Nej$/ })
      .click();
   await page
      .getByTestId("understandValueLoss")
      .locator("label")
      .filter({ hasText: data.understandRisks ? /^Ja$/ : /^Nej$/ })
      .click();
}

export async function openSavingsChildStep5(page:Page): Promise<void> {
   await page.locator("label").click();
}

export async function openSavingsChildStepFinal(page:Page): Promise<void> {
   await expect(page.locator("label").nth(0)).toBeVisible();
   await page.locator("label").nth(0).click();
   await page.locator("label").nth(1).click();
   // await page.locator("label").nth(2).click();
}

export async function verifyScrive(
   page: Page,
   newAccount: boolean,
   dataStep1: OpenSavingsChildStep1,
   dataStep2: OpenSavingsChildStep2,
   dataStep3: OpenSavingsChildStep3,
   guardianSsn: string,
   guardian2Ssn?: string
) {
   await expect(page.locator('#page1').getByText(dataStep3.caregiverName, { exact: false })).toBeVisible();
   await expect(page.locator('#page1').getByText(dataStep2.childName, { exact: false })).toBeVisible();
   await expect(page.locator('#page1').getByText(dataStep1.childSsn, { exact: false})).toBeVisible();
   await expect(page.locator("#page1").getByText(guardianSsn, { exact: false })).toBeVisible();
   if (guardian2Ssn) expect(page.locator('#page1').getByText(guardian2Ssn, { exact: false })).toBeVisible();
   if (newAccount) {
      await expect(page.locator('#page2').getByText(dataStep3.caregiverName, { exact: false })).toBeVisible();
      await expect(page.locator('#page2').getByText(dataStep2.childName, { exact: false })).toBeVisible();
      await expect(page.locator('#page2').getByText(dataStep1.childSsn, { exact: false})).toBeVisible();
      await expect(page.locator("#page2").getByText(guardianSsn, { exact: false })).toBeVisible();
   }
}

export async function scriveRejectSigning(page:Page): Promise<void> {
   await page.getByRole('button', { name: 'avvisa och svara' }).click();
   await expect(page.getByRole('heading', { name: 'Bekräfta avvisa' })).toBeVisible();
   await page.getByRole('button', { name: 'avvisa'}).click();
}

export async function scriveSignDocument(page:Page): Promise<void> {
   await page.getByRole('button', { name: 'Nästa' }).click();
   await page.getByRole('button', {name: 'Signera'}).click();
}

export async function clickContinueButton(page: Page): Promise<void> {
   await expect(page.getByRole("button", { name: "Fortsätt" })).toBeEnabled();
   await page.getByRole("button", { name: "Fortsätt" }).click();
}

export async function clickOpenSavingButton(page:Page): Promise<void> {
   await page
      .getByRole("button", { name: "signera avtal" })
      .or(page.getByRole("button", { name: "öppna depå" }))
      .click();
   await page.route('*/**/bank/mfbank/applications/funds/v1.0/fund/underage', async route => {
      let reqBody = await route.request().postDataJSON();
      // assert this...
      expect(reqBody.redirect_link).toEqual(expect.stringContaining('?'));
      await route.continue();
   });
   await page.waitForURL(/testbed\.scrive\.com/, { timeout: 40000 });
}

// ##### Adult helpers #####

export async function openSavingsAdultStep1(page:Page, data: AdultStep1DataPersonUppgifter): Promise<void> {
   await page.locator("[name=mobileNbr]").fill(data.mobileNbr);
   await page.locator("[name=email]").fill(data.email);
   await page.getByTestId("kyc.occupation").scrollIntoViewIfNeeded();
   await page.getByTestId("kyc.occupation").click();
   await page.getByTestId("kyc.occupation").locator("li", { hasText: data.occupation }).click();
   await page.locator("[name='kyc.monthlyIncome']").fill("")
   await page.locator("[name='kyc.monthlyIncome']").fill(data.monthlyIncome);

   let ic = 0;
   if (data.citizenships.length > 0) {
      for (let ele of data.citizenships) {
         await page.getByTestId("kyc.citizenships").nth(ic).click();
         await page.getByTestId("kyc.citizenships").locator("li", { hasText: ele }).nth(ic).click();
         if (ic !== data.citizenships.length - 1) await page.getByRole("button", { name: "lägg till medborgarskap" }).click();
         ic++;
      }
   } else {
      await page.getByTestId("kyc.citizenships").click();
      await page.getByTestId("kyc.citizenships").locator("li", { hasText: data.citizenships[0] }).click();
   }

   if (data.occupation) {
      await page.getByTestId("kyc.occupation").click();
      await page.getByTestId("kyc.occupation").locator("li", { hasText: data.occupation }).click();
   }

   let it = 0;
   if (data.taxResidences.length > 0) {
      for (let ele of data.taxResidences) {
         await page.getByTestId("kyc.taxResidences").nth(it).click();
         await page.getByTestId("kyc.taxResidences").locator("li", { hasText: ele }).nth(it).click();
         if (it !== data.taxResidences.length - 1) await page.getByRole("button", { name: "skatterättslig hemvist" }).click();
         it++;
      }
   } else {
      await page.getByTestId("kyc.citizenships").locator("li", { hasText: data.citizenships[0] }).click();
   }

   if (data.countryOfResidence.toLocaleLowerCase() === "sverige") await page.getByTestId("kyc.countryOfResidence").locator("label", { hasText: "sverige" }).click();
   else {
      await page.getByTestId("kyc.countryOfResidence").locator("label", { hasText: "annat land" }).click();
      await page.getByTestId("kyc.otherCountryOfResidence").click();
      await page.getByTestId("kyc.otherCountryOfResidence").locator("li", { hasText: data.countryOfResidence }).click();
   }

   await page.getByTestId("kyc.pep").click();
   await page.getByTestId("kyc.pep").locator("li", { hasText: data.pep }).click();
}

export async function cleanUsersAccounts(ssn: string) {
   try {
      const resp = await apiRequest(
         "GET",
         `${process.env.BASE_URL_API}/bank/mfbank/customer/v1.0/basic?personal_number=${
            ssn.length == 12 ? ssn.substring(2) : ssn
         }`,
         ssn,
      );
      let j = await resp.json();
      expect(
         await MFQuery(
            `delete from ${process.env.MF_TABLE}.tbadepa where id_kundnr_1 = ${j.customer_number};`,
         ),
      ).toHaveLength(0);
      expect(
         await MFQuery(
            `delete from ${process.env.MF_TABLE}.tksdira where id_kundnr_rel = ${j.customer_number};`,
         ),
      ).toHaveLength(0);
      expect(
         await MFQuery(
            `delete from ${process.env.MF_TABLE}.tkskont where id_kundnr = ${j.customer_number};`,
         ),
      ).toHaveLength(0);
      expect(
         await MFQuery(
            `delete from ${process.env.MF_TABLE}.tkskore where id_kundnr = ${j.customer_number};`,
         ),
      ).toHaveLength(0);
      expect(
         await MFQuery(
            `delete from ${process.env.MF_TABLE}.tksarhu where id_persnr_1 = ${
               ssn.length == 12 ? ssn.substring(2) : ssn
            };`,
         ),
      ).toHaveLength(0);
   } catch (e) {
      throw e;
   }
}

export async function verifyIskAccIsCreated(
   ssn: string,
   accountHolderFullName: string,
): Promise<void> {
   const getDepotsResp = await getDepots(ssn);
   const getDepotRespJson = await getDepotsResp.json();

   const childIskAccount = getDepotRespJson["depotsDetailList"].filter(
      (depot) =>
         depot.startDate.includes(new Date().toISOString().slice(0, 10)) &&
         depot.type === "ISK" &&
         depot.depotName.includes(accountHolderFullName.split(" ")[0].toUpperCase()) &&
         depot.depotName.includes("ISK"),
   );
   expect(childIskAccount.length).not.toEqual(0);
   expect(childIskAccount[childIskAccount.length - 1]).toEqual(
      expect.objectContaining({ role: "AuthorityToDispose" }),
   );
   expect(childIskAccount[childIskAccount.length - 1].depotName).toEqual(
      expect.stringContaining("ISK"),
   );
}

export async function verifyDepotAccIsCreated(ssn: string, accountHolderFullName: string): Promise<void> {
   const getDepotsResp = await getDepots(ssn);
   await expect(getDepotsResp).toBeOK();
   const getDepotRespJson = await getDepotsResp.json();

   const childDepotAccount = getDepotRespJson["depotsDetailList"].filter(
      (depot) =>
         depot.startDate.includes(new Date().toISOString().slice(0, 10)) &&
         depot.type === "Depot" &&
         depot.depotName.includes(accountHolderFullName.split(" ")[0].toUpperCase()) &&
         depot.depotName.includes("depå"),
   );
   // console.log(childIskAccount)
   expect(childDepotAccount.length).not.toEqual(0);
   expect(childDepotAccount[childDepotAccount.length - 1]).toEqual(
      expect.objectContaining({ role: "AuthorityToDispose" }),
   );
   expect(childDepotAccount[childDepotAccount.length - 1].depotName).toEqual(expect.stringContaining("depå"));
}


// ##### API HELPERS #####



