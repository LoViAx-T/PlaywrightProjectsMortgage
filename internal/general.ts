import { Page, expect, request } from "@playwright/test";
import { chromium } from "playwright";

import fs from "fs";
import path from "path";

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function waitForSpinner(page: Page) {
   // await expect(page.getByText("Laddar sida")).not.toBeVisible({ timeout: 60000 });
   await expect(page.getByTestId("loading")).not.toBeVisible({ timeout: 30_000})
}

export async function importantMessagesClick(page: Page) {
   // Important messages popup
   if (await page.getByRole("button", { name: "OK" }).isVisible()) await page.getByRole("button", { name: "OK" }).click();
   await expect(page.getByRole("button", { name: "OK" })).not.toBeVisible();
   // await page.getByRole("button", { name: "OK" }).click({ timeout: 10_000});
}

export function getCurityToken(ssn: string): string {
   try {
      return process.env[`CURITY_TOKEN_${ssn}`]
   } catch(e) {
      console.error(e);
      return
   }
}

export function getCurityRefreshToken(ssn: string): string {
   try {
      const fileName = path.resolve(`.auth/${ssn}.json`);
      // const cookies = require(fileName);
      const cookies = JSON.parse(fs.readFileSync(fileName, "utf8"));

      let token = cookies.cookies.find((item) => item.name == "refresh_token");
   
      return token["value"].replaceAll("%22", "");
   } catch(e) {
      return undefined
   }
}

export function getSsn(authFile: string): string {

   const cookies = JSON.parse(fs.readFileSync(authFile, "utf8"));
   let ssn: string;

   cookies.cookies.forEach((c) => {
      if (c.name === "username") {
         let cval: string = c.value;
         let split = cval.split("#");
         let val: string = JSON.parse(atob(split[0]));
         ssn = val["un"];
      }
   });
   return ssn;
}

export function tokenExpiresInSec(authFile: string): number {
   // const cookies = require(authFile);
   const cookies = JSON.parse(fs.readFileSync(authFile, "utf8"));
   let currentTimestamp = Date.now();

   let cookieArr = cookies.cookies;
   let cookieExpiry = cookieArr.find((item) => item.name == "access_token_expiry");
   let c: number = cookieExpiry.value.replaceAll("%22", "");
   let countDown: number = (c - currentTimestamp) / 1000;
   return countDown;
   // return null;
}

export function sessionFileEnv(authFile:string): string {
   const cookies = JSON.parse(fs.readFileSync(authFile, "utf8"));

   let origin:string = cookies.origins[0].origin;
   if (origin.includes("test")) {
      return "test"
   } else if(origin.includes("ver")) {
      return "ver"
   } else if (origin.includes("sandbox")) {
      return "sandbox"
   }
}

export async function login(ssn: string) {
   // const authFile = path.resolve(`.auth/${ssn}.json`);
   // let curityToken = getCurityToken(ssn);

   // if (fs.existsSync(authFile) && curityToken !== undefined && process.env.ENV === sessionFileEnv(authFile)) {
   // let tokenExpiresIn = tokenExpiresInSec(authFile);
   // // console.log("SSN:          ", ssn);
   // // console.log("Curity token: ", curityToken);
   // // console.log("Token expiry: ", tokenExpiresIn);

   // // if (tokenExpiresIn > 300) {
   // // // await updateSession(context.request, authFile);
   // // // await ;
   // // return authFile;
   // // // return authFile
   // // }
   // }

   // console.log("Login with:", `${ssn}.json`);
   const browser = await chromium.launch({ headless: true });
   const context = await browser.newContext({ storageState: undefined });
   const page = await context.newPage();

   await page.context().addCookies([
      {
         name: "user_consent",
         value: `111`,
         domain: ".icabanken.se",
         path: "/",
      },
   ]);

   await page.goto(`${process.env.BASE_URL}/logga-in/?refUrl=/min-ekonomi/`);
   await page.getByRole("heading", { name: "Logga in" }).click();
   await page.getByRole("link", { name: "icabanken-username-bankid" }).click();
   await page.getByRole("textbox").click();
   await page.getByRole("textbox").fill(ssn);
   await page.getByRole("button", { name: "Logga in" }).click();
   await expect(page.getByText("Någonting gick fel.")).not.toBeVisible();
   await page.waitForURL(`${process.env.BASE_URL}/min-ekonomi/**`, { timeout: 30_000 });
   // catch curity token
   const getTokensSessionStorage = await page.evaluate(() =>
      JSON.parse(JSON.stringify(sessionStorage)),
   );
   let tokens = JSON.parse(getTokensSessionStorage["icabanken-tokens"]);
   let curityToken = tokens.accessToken.replaceAll("'", "");
   process.env[`CURITY_TOKEN_${ssn}`] = curityToken;
   await page.context().storageState({ path: `.auth/${ssn}.json` });
   await page.close();
   await context.close();
}

export async function updateSession(authFile:string): Promise<void> {
   try {
      let cookies = JSON.parse(await fs.promises.readFile(authFile, "utf-8"));
      // let cookiesSession = (await request.storageState()).cookies;
      // console.log(cookiesSession)
      let c: string = "";
      for (let cookie of cookies["cookies"]) {
      // for (let cookie of cookiesSession) {
         // for (let cookie of cookies) {
         if (cookie.name === "refresh_token") {
            c = cookie.value.replaceAll("%22", "");
            // console.log("REFRESH_TOKEN", cookie.value);
         }
      }
      const context = await request.newContext();
      let resp = await context.post(`${process.env.BASE_URL_LOGIN}/oauth/v2/token`, {
         form: {
            grant_type: "refresh_token",
            refresh_token: c,
            client_id: process.env.CURITY_CLIENT_ID,
         },
      });

      let respPriv = await context.get(`${process.env.BASE_URL_PRIVATE}/api/customer/checkloggedinstate`);
      expect(respPriv).toBeTruthy();

      let j = await resp.json();
      // console.log(j);

      let d = Date.now() + j.expires_in * 1000;
      // update session file
      for (let cookie of cookies["cookies"]) {
         switch (cookie.name) {
            case "access_token":
               cookie.value = `%22${j.access_token}%22`;
               break;
            case "refresh_token":
               cookie.value = `%22${j.refresh_token}%22`;
               break;
            case "access_token_expiry":
               cookie.value = `%22${d}%22`;
               break;
            case "scope_expiry":
               cookie.value = `%22${d}%22`;
               break;
         }
      }
      await fs.promises.writeFile(authFile, JSON.stringify(cookies));
   } catch (e) {
      console.error(e);
   }
}

export type DateMonthYear = string;

export function dateMonthYear(customDate?: string): DateMonthYear {
   // returns: Mars 2024
   let date = customDate ? new Date(customDate) : new Date();
   let month = date.toLocaleString("default", { month: "long" }).toLowerCase();
   let year = date.getFullYear();
   let monthYear = month + " " + year;
   return monthYear;
}

export type DateYearMonthDay = string;

export function dateYearMonthDay(customDate?: string): DateYearMonthDay {
   // returns: 2024-03-08
   let date = customDate ? new Date(customDate) : new Date();
   return date.toLocaleDateString("se")
}

export type DateMonthYearDigit = string;

export function dateMonthYearDigit(customDate?: string): DateMonthYearDigit {
   // returns: 2024-04
   let date = customDate ? new Date(customDate) : new Date();
   return date.toLocaleString('se', { year: 'numeric', month: '2-digit' });
}