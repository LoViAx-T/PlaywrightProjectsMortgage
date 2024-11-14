import { expect, test as baseTest, Page } from '@playwright/test';

export const test = baseTest.extend<{ ssn: string }, {}>({
   ssn: "",
   page: async ({ page, ssn }, use) => {
      if (ssn != "") {
         var startDate = new Date().getTime();
         const sessionFile = `.auth/${ssn}.json`;
         await page.context().addCookies([
            {
               name: "user_consent",
               value: `111`,
               domain: ".icabanken.se",
               path: "/",
            },
         ]);

         await page.context().storageState({ path: undefined });
         await page.goto(`${process.env.BASE_URL}/logga-in/?refUrl=/min-ekonomi/`);
         await page.getByRole("heading", { name: "Logga in" }).click({ force: true });
         await page.getByRole("link", { name: "icabanken-username-bankid" }).click();
         await page.getByRole("textbox").click();
         await page.getByRole("textbox").fill(ssn);

         await page.getByRole("button", { name: "Logga in" }).click();
         await expect(page.getByText("Någonting gick fel.")).not.toBeVisible();

         await page.waitForURL(`${process.env.BASE_URL}/min-ekonomi/**`, { timeout: 15_000 });

         await page.context().storageState({ path: sessionFile });

         // remove importantMessages popup
         await page.context().addInitScript(() => {
            window.sessionStorage.setItem(
               "ICABanken:importantMessagesChecked",
               '{"hasClosedImportantMessagesAtLogin":true}',
            );
         });
         // catch curity token
         const getTokensSessionStorage = await page.evaluate(() =>
            JSON.parse(JSON.stringify(sessionStorage)),
         );
         let tokens = JSON.parse(getTokensSessionStorage["icabanken-tokens"]);
         let curityToken = tokens.accessToken.replaceAll("'", "");
         process.env[`CURITY_TOKEN_${ssn}`] = curityToken;

         await use(page);

         var endDate = new Date().getTime();
         console.log(
            "[i] Test execution time (including login):",
            (endDate - startDate) / 1000 + "s",
         );
      } else {
         console.log("Missing ssn, use: test.use({ ssn: <your_ssn> })");
         await page.close();
         await use(undefined);
      }
   },
});

export { expect, APIResponse, request } from '@playwright/test'