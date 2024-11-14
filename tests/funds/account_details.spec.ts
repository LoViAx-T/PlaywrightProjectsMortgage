import { getAccountDetails } from "../../internal/api/coral_depots_api";
import { test, expect } from "../../internal/baseTest2";
import { accountDetails } from "../../internal/funds/move_funds_helpers";
import { chooseEnvTestData } from "../../internal/testdata";

let testData = chooseEnvTestData().accountDetails;

test.describe("User over 18", () => {
   test.use({ ssn: testData.normalUser.ssn });

   test.beforeEach(async ({ page }) => {
      await page.goto("/min-ekonomi/mitt-fondsparande/kontoinformation/");
   });

   test("Check that user details are visible", { tag: "@functional" }, async ({ page }) => {
      await expect(page.locator("dd", { hasText: testData.normalUser.name })).toBeVisible();
   });
});
