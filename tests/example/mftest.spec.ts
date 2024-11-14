import { test, expect } from "@playwright/test";
import * as mf from "../../internal/mf";

test.skip("MF query @example", async ({ page }) => {
   let test = await mf.MFQuery(`SELECT * FROM ${process.env.MF_TABLE}.TDLSEMA WHERE ID_PERSNR = '192107160018'`);
   console.log(test);
   expect(test).not.toEqual([]);
});
