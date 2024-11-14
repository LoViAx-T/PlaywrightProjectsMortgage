import { apiRequest } from "../api";
import { APIResponse, expect } from "../baseTest2";
import { DateMonthYear, DateMonthYearDigit, dateYearMonthDay } from "../general";

// const URL = `https://apimgw-${process.env.ENV}.ia.icacorp.net/bank/mfbank/applications/funds/v1.0`;
const fundsUrl = `${process.env.BASE_URL_API}/bank/mfbank/applications/funds/v1.0`
const caseUrl = `${process.env.BASE_URL_API}/bank/mfbank/case/v1.0/cases`
const monthlysavingsUrl =  `${process.env.BASE_URL_API}/bank/mfbank/fund/v1.0/monthlysavings`

export type PrevalidatePayload = {
   fund_type: string;
   guardian_personal_number: string;
   personal_number: string;
}


export async function postPrevalidate(ssn:string, body: PrevalidatePayload): Promise<APIResponse> {
   // payload: {"fund_type":"DepotUnderage","guardian_personal_number":"197610266590","personal_number":"200712056183"}
   return await apiRequest("POST", fundsUrl+"/fund/prevalidate", ssn, body)
}

const fundUrl = `${process.env.BASE_URL_API}/bank/mfbank/fund/v1.0`

export type MonthlySavingsCreatePayloadFunds = {
   isin: string;
   percentage: number;
}

export type MonthlySavingsCreatePayload = {
   amount: number;
   depot_id: string;
   funds: MonthlySavingsCreatePayloadFunds[];
   start_month: DateMonthYearDigit;
   withdrawal_account_nbr: string;
}

export async function postMonthlySavingsCreate(
   ssn: string,
   payload: MonthlySavingsCreatePayload,
): Promise<APIResponse> {
   return await apiRequest("POST", fundUrl+"/monthlysavings/create", ssn, payload)
}

export async function getMonthlySavingsGet (
   ssn: string,
   depotAccountNo: string,
): Promise<APIResponse> {
   return await apiRequest("GET", fundUrl + `/monthlysavings/get?depot_id=${depotAccountNo}`, ssn);
}

export async function getCases(ssn: string): Promise<APIResponse> {
   return await apiRequest("GET", caseUrl, ssn)
}

export async function getTodaysCases(ssn: string) {
   let cases = await getCases(ssn);
   await expect(cases).toBeOK();
   let j = await cases.json();
   
   let arrOfCases:Array<any> = j.response.getcaseslist

   const todaysCases = arrOfCases.filter((c) => c.created === dateYearMonthDay());
   return todaysCases
}
