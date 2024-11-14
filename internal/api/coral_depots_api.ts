import { APIResponse, expect } from "@playwright/test";
import { apiRequest } from "../api";

const coralDepotsUrl = `${process.env.BASE_URL_API}/bank/coral/products/depots/v1.0`;

// Buy funds properties
export interface FundsBuyPayload {
   buyOrderBatches: FundsBuyOrderBatch[];
   customerNumber?: string;
   personalNumber?: string;
}

export interface FundsBuyOrderBatch {
   debitAccountNumber: string;
   depotId: string;
   updateFundsBundle: boolean;
   buyOrders: BatchBuyOrder[];
}

export interface BatchBuyOrder {
   isin: string;
   buyAmount: number;
   id: string;
}

// Sell funds Properties
export interface FundsSellPayload {
   sellOrderBatches: FundsSellOrderBatch[];
   customerNumber?: string;
}

export interface FundsSellOrderBatch {
   depotId: string;
   updateFundsBundle: boolean;
   sellOrders: BatchSellOrder[];
}

export interface BatchSellOrder {
   isin: string;
   units: number;
   id: string;
}

export type BundleDeletePayload = {
   deleteAll: boolean;
   sellOrderIds?: string[];
   buyOrderIds?: string[];
   tradeOrderIds?: string[];
   customerNumber?: string;
};

export interface BundleBuyOrder {
   isin: string;
   amount: number;
   fromAccountNbr?: string;
   depotId?: string;
   id?: string;
}

export interface BundleSellOrder {
   depotId: string;
   isin: string;
   shares: number;
}

export interface FundsBundlePayload {
   buyOrders?: BundleBuyOrder[];
   sellOrders?: BundleSellOrder[];
   customerNumber?: string;
}

export async function deleteBundle(ssn: string, payload: BundleDeletePayload): Promise<JSON> {
   let res = await apiRequest("post", `${coralDepotsUrl}/fundorders/deletebundle`, ssn, payload);
   await expect(res).toBeOK();
   if ((await res.text()) === "") {
      return null;
   }
   return res.json();
}

export async function getDepotId(ssn: string, depotAccountNr: string): Promise<string> {
   let res = await apiRequest("GET", `${coralDepotsUrl}/?PersonalNumber=${ssn}`, ssn);
   expect(res).toBeOK();
   let j = await res.json();

   let id: string;
   j["depotsDetailList"].forEach((depot) => {
      if (depot.depotNumber === depotAccountNr) id = depot.id;
   });
   return id;
}

export async function getOrders(ssn: string, depotAccountNr: string, pageSize: number): Promise<JSON> {
   let depotId = await getDepotId(ssn, depotAccountNr);
   let orders = await apiRequest("get", `${coralDepotsUrl}/${encodeURIComponent(depotId)}/orders?PageSize=${pageSize}`, ssn);
   await expect(orders).toBeOK();
   return orders.json();
}

export async function deleteOrder(ssn: string, id: string): Promise<JSON> {
   let res = await apiRequest("DELETE", `${coralDepotsUrl}/fundorders/${id}`, ssn);
   if ((await res.text()) === "") {
      return null;
   }
   return res.json();
}

export async function verifyLastOrderIsOk(ssn: string, depotAccountNr: string, fundName: string, amount?:string): Promise<void> {
   let orders = await getOrders(ssn, depotAccountNr.replace("-", "").replaceAll(" ", ""), 500);
   let ordersCount = orders["orders"].length;
   let lastOrder = orders["orders"][ordersCount - 1];

   expect(lastOrder.fundName).toEqual(fundName);
   if (amount) expect(lastOrder.totalAmount).toEqual(parseInt(amount));
   expect(lastOrder.isCancelable).toEqual(true);
}

export async function deleteTodaysOrders(ssn: string, depotAccountNr: string) {
   let date = new Date();
   let todaysDate = date.toISOString().split("T")[0];

   let orders = await getOrders(ssn, depotAccountNr, 500);
   for (const order of orders["orders"]) {
      if (
         order.date.includes(todaysDate) &&
         order.isCancelable === true &&
         order.isAggregated === false
      ) {
         await deleteOrder(ssn, order.orderId);
      }
   }
}

export async function addFundToBundle(ssn: string, bundle: FundsBundlePayload): Promise<APIResponse> {
   let res = await apiRequest("POST", `${coralDepotsUrl}/fundorders/bundle`, ssn, bundle);
   return res;
}

export async function buyFundInBundle(ssn: string, depotId: string, fromAccountNo: string): Promise<APIResponse> {

   let bundleJson = await (await apiRequest("GET", `${coralDepotsUrl}/fundorders/bundle`, ssn)).json();

   let listOfOrders: BatchBuyOrder[] = [];

   for (let order of await bundleJson["buyOrders"]) {
      let buyOrder: BatchBuyOrder = {
         isin: order.isin,
         buyAmount: order.amount,
         id: order.id,
      };
      listOfOrders.push(buyOrder);
   }

   let buyOrderBatch: FundsBuyOrderBatch[] = [
      {
         buyOrders: listOfOrders,
         debitAccountNumber: fromAccountNo,
         depotId: depotId,
         updateFundsBundle: true,
      },
   ];

   let buyReq: FundsBuyPayload = {
      buyOrderBatches: buyOrderBatch,
   };

   let buyRes = await apiRequest("POST", `${coralDepotsUrl}/fundorders/buy`, ssn, buyReq);

   return buyRes;
}

export async function buyFund(ssn: string, depotAccount: string, fromAccountNo: string, isin: string, amount: number): Promise<void> {
   // let depotAccount = '900203456';
   // let fromAccountNo =  '900203456'

   let depotId = await getDepotId(ssn, depotAccount);

   let bundle: FundsBundlePayload = {
      buyOrders: [
         {
            isin: isin,
            amount: amount,
            fromAccountNbr: fromAccountNo,
            depotId: depotId,
         },
      ],
   };

   let bundleRes = await addFundToBundle(ssn, bundle);
   expect(bundleRes).toBeOK();

   let buyRes = await buyFundInBundle(ssn, depotId, fromAccountNo);
   expect(buyRes).toBeOK();
}

export async function sellFundInBundle(ssn: string, depotId: string): Promise<APIResponse> {
   let bundleJson = await (await apiRequest("GET", `${coralDepotsUrl}/fundorders/bundle`, ssn)).json();

   let listOfOrders: BatchSellOrder[] = [];

   for (let order of await bundleJson["sellOrders"]) {
      let sellOrder: BatchSellOrder = {
         isin: order.isin,
         units: order.shares,
         id: order.id,
      };
      listOfOrders.push(sellOrder);
   }

   let sellOrderBatch: FundsSellOrderBatch[] = [
      {
         sellOrders: listOfOrders,
         depotId: depotId,
         updateFundsBundle: true,
      },
   ];

   let buyReq: FundsSellPayload = {
      sellOrderBatches: sellOrderBatch,
   };

   let buyRes = await apiRequest("POST", `${coralDepotsUrl}/fundorders/sell`, ssn, buyReq);

   return buyRes;
}

export async function sellFund(ssn: string, depotAccount: string, isin: string, shares: number): Promise<void> {
   let depotId = await getDepotId(ssn, depotAccount);

   let bundle: FundsBundlePayload = {
      sellOrders: [
         {
            depotId: depotId,
            isin: isin,
            shares: shares,
         },
      ],
   };

   let bundleRes = await addFundToBundle(ssn, bundle);
   expect(bundleRes).toBeOK();

   let sellRes = await sellFundInBundle(ssn, depotId);
   expect(sellRes).toBeOK();
}

export async function getDepots(ssn:string): Promise<APIResponse> {
   return await apiRequest('get', `${coralDepotsUrl}/`, ssn);
}

export async function getISKAccountsOwnedByUser(ssn:string): Promise<JSON> {
   const getDepotsResp = await getDepots(ssn);
   const getDepotRespJson = await getDepotsResp.json();

   const ISKAccounts = getDepotRespJson["depotsDetailList"].filter(
      (depot) =>
         depot.type === "ISK" &&
         depot.depotName.includes("ISK"),
   );
   return ISKAccounts
}

export async function getAccountDetails(ssn: string, depotAccountNo: string): Promise<JSON> {
   // https://apimgw-ver.ia.icacorp.net/bank/coral/products/depots/v1.0/8NOL9PKZ0aTiy2H39D9Upw%3D%3D/accountdetails
   const depotId = await getDepotId(ssn, depotAccountNo);
   const resp = await apiRequest("GET", `${coralDepotsUrl}/${depotId}/accountdetails`, ssn);

   let j = await resp.json();
   return j.persons
}
