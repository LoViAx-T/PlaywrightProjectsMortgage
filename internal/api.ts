import * as generalHelpers from "./general";
import { v4 as uuidv4 } from 'uuid';
import { exit } from "process";
import { APIResponse, request } from "@playwright/test";

// console.log("######################", test.info().parallelIndex)
export async function apiRequest(method: string, url: string, ssn: string, payload?: object): Promise<APIResponse> {
   // const token = await curityTokenLightning(ssn);
   let token = generalHelpers.getCurityToken(ssn);
   let requestId = uuidv4();
   // console.log(token.access_token)
   const reqContext = await request.newContext({
      baseURL: url,
      extraHTTPHeaders: {
         Authorization: `Bearer ${token}`,
         "X-Request-ID": requestId,
         "Content-Type": "application/json",
         Accept: "application/json",
      },
   });

   let res: APIResponse;
   switch (method.toLowerCase()) {
      case "get":
         res = await reqContext.get(url);
         console.log("GET", res.status(), url, ssn, requestId);
         break;
      case "post":
         res = await reqContext.post(url, {
            data: payload,
         });
         console.log("POST", res.status(), url, ssn, requestId);
         break;
      case "delete":
         res = await reqContext.delete(url);
         console.log("DELETE", res.status(), url, ssn, requestId);
         break;
      default:
         console.error("HTTP method not supported");
         exit;
         break;
   }

   return res;
}
