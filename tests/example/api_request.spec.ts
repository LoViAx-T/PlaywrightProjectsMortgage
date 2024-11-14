// import { test, expect } from "@playwright/test";
import { test, expect } from "../../internal/baseTest2";
import * as coralApi from "../../internal/api/coral_depots_api";
import { login } from "../../internal/general";

const ssn = "192107160018";


test.skip("buy fund using api", async () => {
   await login(ssn)
   await coralApi.buyFund(ssn, "900203456", "900203456", "SE0000356099", 1000);
});
