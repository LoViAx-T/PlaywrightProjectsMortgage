import { test, expect, Page } from "@playwright/test";
import { data } from "../../internal/bolan/testdataPagaende";

test("test", async ({ page }) => {
   await page.goto("https://ver.icabanken.se/");
   await page.getByRole("button", { name: "Godkänn alla cookies" }).click();
   await page.getByRole("button", { name: "Logga in" }).click();
   await page.getByRole("heading", { name: "Logga in" }).click();
   await page.getByRole("link", { name: "icabanken-username-bankid" }).click();
   await page.getByLabel("Personnummer").click();
   await page.getByLabel("Personnummer").fill(data.applicant_KDK);
   await page.getByRole("button", { name: "Logga in" }).click();
   await page.getByRole("button", { name: "Stäng" }).click();
   await page.getByRole("link", { name: "Pågående ärenden" }).click();
   await page.getByRole("link", { name: "Ansökan om bolån Skapades" }).first().click();
   await page.goto(data.mortgage_url);
   await page.getByRole("button", { name: "Spara" }).click();
   await page.getByRole("button", { name: "Logga ut" }).click();
   close();
});
