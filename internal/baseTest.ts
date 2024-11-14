import { test as baseTest } from '@playwright/test';
import path from 'path';
import fs, { access } from 'fs';
import { getCurityRefreshToken, getCurityToken, getSsn, login, tokenExpiresInSec, updateSession } from "./general";

type loginFixture = {
   login: void
}

// const ssn = "192107160018";
export const test = baseTest.extend<{ updateSessions: any }, loginFixture>({
   updateSessions: [
      async ({ context, page }, use) => {
         let currentCookies = await context.storageState()
         let username = currentCookies.cookies.find((item) => item.name == "username");
         let ssn: string = JSON.parse(atob(username["value"].split("#")[0]))["un"];
         
         await login(ssn) 

         const sessionFolder = ".auth";

         let promises = [];

         const files = await fs.promises.readdir(sessionFolder);
         for (let f of files) {
            if(!f.includes(ssn)) {
               const authFile = path.resolve(`.auth/${f}`);
               promises.push(updateSession(authFile));
            } 
         }

         await Promise.all(promises);
         // if(await page.url().includes('logga-in') || await page.url().includes('utloggad')) {
            // await login(ssn)
         // }
         await use(page);
      },
      { scope: "test", auto: true },
   ],
   login: [
      async ({}, use) => {
         const ssns: string[] = [
            "192107160018",
            "4504128382",
            "197610266590",
            "195712203537",
            "201111110647",
            "194505053415",
            "201505054278",
            "197610266590",
            "202102022387",
            "198809153797",
            "196508261614",
            "201012015796",
            "200712056183",
            "197604027578",
         ];

         // const chunkSize = ssns.length;
         const chunkSize = ssns.length;
         for (let i = 0; i < ssns.length; i += chunkSize) {
         const chunk = ssns.slice(i, i + chunkSize);
            let promises = [];
            for (let ssn of chunk) {
               promises.push(login(ssn));
            }
            await Promise.all(promises);
         }

         await use()
         
      },
      { scope: "worker", auto: true },
   ],
});



export { expect, APIResponse, request } from '@playwright/test'