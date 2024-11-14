import { test, expect } from "@playwright/test";
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

test("ongoingErrands", async ({ page }) => {
   await page.goto("https://ver.icabanken.se/");
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
   await page.getByRole("button", { name: "Logga in" }).click();
   await page.getByRole("heading", { name: "Logga in" }).click();
   await page.getByRole("link", { name: "icabanken-username-bankid" }).click();
   await page.getByRole("textbox").click();
   await page.getByRole("textbox").fill(data.applicant1personalIdentityNumber);
   await page.getByRole("button", { name: "Logga in" }).click();
   await page.getByRole("button", { name: "OK" }).click();
   await page.getByRole("link", { name: "Pågående ärenden" }).click();
   expect({ name: "Pågående ärenden" });
   //await page.getByRole("link", { name: "Ansökan om bolån Skapades 2024-03-20" }).click();
   await page.getByRole("button", { name: "Logga ut" }).click();
   page.close();
});
