import { test, expect } from "../../internal/baseTest2";
import { apiRequest } from "../../internal/api";

import { ApplicantsEconomy, BorgKycdetails, Kid, MortgageRequest, applicantsEconomyBody, applicantsInformationBody, borgKYCDetailsDefault, buildApplicantsEconomyBody, buildApplicantsInformationBody, buildBorgKYCDetails, buildMortgageDetailsBody, buildResidenceBody, mortgageDetailsBody, mortgageRequestDefault, residenceBody } from "../../internal/api/coral_mortgage_api";


const ssn = "4504128382";

const url = `${process.env.BASE_URL_API}/bank/coral/products/loans/v1.0/mortgage`;

test.describe.skip("Ansök api test", () => {
   test("Ansok om bolan utan curity token", async () => {
      let resp = await apiRequest("POST", url, "");

      expect(resp.status()).toEqual(401);
   });

   test("Ansok om bolan API utan payload", async () => {
      let resp = await apiRequest("POST", url, ssn, null);

      let j: JSON = await resp.json();
      console.log(j);

      expect(resp.status()).toEqual(400);

      expect(j["status"]).toEqual(400);

      expect(j["errors"][""][0]).toEqual("A non-empty request body is required.");
   });

   test("Ansok om bolan lagenhet - 2 personer, sambos", async () => {
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "3",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "3",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
      };

      let residenceBody: residenceBody = {
         typeOfResidence: "lagenhet",
         operatingCost: 1500,
         residenceCost: 2500000,
         apartamentInfoArea: 114,
         apartamentInfoMonthlyFee: 1000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 2000000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         coApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 250000,
         },
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 250000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 4000,
         sharedAccommodation: true,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 2,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);
      expect(resp).toBeOK();

      let j = await resp.json();

      expect(j.flowState).toEqual("AdditionalInformationNeeded");
      expect(j.resultCode).toEqual("Review");
   });

   test("Ansok om bolan lagenhet - manadsavgift lagre än 1000kr ", async () => {
      // Build body
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "1",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: null,
      };

      let residenceBody: residenceBody = {
         typeOfResidence: "lagenhet",
         operatingCost: 1500,
         residenceCost: 2500000,
         apartamentInfoArea: 24,
         apartamentInfoMonthlyFee: 1000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 2000000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         sharedAccommodation: null,
         coApplicant: null,
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 2000,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 1,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);

      let j = await resp.json();

      console.log(j);

      expect(resp).toBeOK();
      expect(j.flowState).toEqual("AdditionalInformationNeeded");
      expect(j.resultCode).toEqual("Review");
      expect(j.resultReason).toEqual("35");
   });

   test("Ansok om bolan lagenhet - månadsavgift högre än 1000kr", async () => {
      // Build body
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "1",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: null,
      };

      let residenceBody: residenceBody = {
         typeOfResidence: "lagenhet",
         operatingCost: 1500,
         residenceCost: 2000000,
         apartamentInfoArea: 24,
         apartamentInfoMonthlyFee: 2001,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 1700000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         sharedAccommodation: null,
         coApplicant: null,
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2022-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 120000,
            otherLoans: null,
            savings: 300000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 2000,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 1,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };
      let resp = await apiRequest("POST", url, ssn, mortgageRequest);

      let j = await resp.json();

      console.log(j);
      expect(resp).toBeOK();
      expect(j.resultCode).toEqual("Rejected");
      expect(j.flowState).toEqual("Rejected");
      expect(j.resultReason).toEqual("33");
   });

   test("Ansok om bolan villa - 2 personer gifta", async () => {
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "3",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "3",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
      };
      let residenceBody: residenceBody = {
         typeOfResidence: "villa",
         operatingCost: 8000,
         residenceCost: 10000000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 90000000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         coApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 4000,
         sharedAccommodation: true,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 2,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);
      expect(resp).toBeOK();

      let j = await resp.json();
      console.log(j);
      expect(j.flowState).toEqual("Review");
      expect(j.resultCode).toEqual("Review");
      expect(j.resultReason).toEqual("41");
   });

   test("Ansok om bolan villa - Gifta och har barn", async () => {
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "3",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "3",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
      };
      let residenceBody: residenceBody = {
         typeOfResidence: "villa",
         operatingCost: 8000,
         residenceCost: 10000000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 90000000,
      };
      let applicantsEconomyKidsDefault: Kid[] = [
         {
            age: 6,
            custodyPercentage: 100,
            childSupportGet: false,
            childSupportPay: false,
         },
         {
            age: 10,
            custodyPercentage: 100,
            childSupportGet: false,
            childSupportPay: false,
         },
      ];

      let applicantsEconomyBody: applicantsEconomyBody = {
         coApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         doKidsLiveWithYou: false,
         kids: applicantsEconomyKidsDefault,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 4000,
         sharedAccommodation: true,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 2,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);
      expect(resp).toBeOK();

      let j = await resp.json();
      console.log(j);
      expect(j.flowState).toEqual("Review");
      expect(j.resultCode).toEqual("Review");
      expect(j.resultReason).toEqual("41");
   });

   test("Ansok om bolan lagenhet - PEP", async () => {
      // Build body
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "1",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "1",
            whoIsPepCode: "1",
         },
         coApplicant: null,
      };

      let residenceBody: residenceBody = {
         typeOfResidence: "lagenhet",
         operatingCost: 1500,
         residenceCost: 2500000,
         apartamentInfoArea: 24,
         apartamentInfoMonthlyFee: 1000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 2000000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         sharedAccommodation: null,
         coApplicant: null,
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 2000,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 1,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);

      let j = await resp.json();

      console.log(j);

      expect(resp).toBeOK();
      expect(j.flowState).toEqual("Review");
      expect(j.resultCode).toEqual("Review");
      expect(j.resultReason).toEqual("37");
   });

   test("Ansok om bolan - behalla annat boende med lan pa 1mn", async () => {
      // Build body
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "1",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: null,
      };

      let residenceBody: residenceBody = {
         typeOfResidence: "lagenhet",
         operatingCost: 1500,
         residenceCost: 2500000,
         apartamentInfoArea: 24,
         apartamentInfoMonthlyFee: 1000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 2000000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         sharedAccommodation: null,
         coApplicant: null,
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         otherResidencies: [
            {
               brokerFee: null,
               conveyanceDate: null,
               expectedSalesAmount: 1500000,
               groundRentAmount: 0,
               keepResidence: true,
               monthlyFee: null,
               operatingCost: 1000,
               sizeOfLoan: 500000,
               typeOfResidency: "2",
               creditor: null,
               otherCreditorName: null,
            },
         ],
         ownsOtherResidencies: true,
         purchasesAtIca: 2000,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 1,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);

      let j = await resp.json();

      console.log(j);

      expect(resp).toBeOK();
      expect(j.flowState).toEqual("AdditionalInformationNeeded");
      expect(j.resultCode).toEqual("Review");
      expect(j.resultReason).toEqual("35");
   });

   test("Ansok om bolan - andra lån", async () => {
      let applicantsInformationBody: applicantsInformationBody = {
         mainApplicant: {
            citizenships: ["SE"],
            citizenshipWithinEes: false,
            countryOfResidence: "SE",
            relationshipStatus: "1",
            taxResidences: [
               {
                  countryCode: "SE",
                  tin: null,
               },
            ],
            pepRoleCode: "X",
            whoIsPepCode: null,
         },
         coApplicant: null,
      };

      let residenceBody: residenceBody = {
         typeOfResidence: "lagenhet",
         operatingCost: 1500,
         residenceCost: 2500000,
         apartamentInfoArea: 24,
         apartamentInfoMonthlyFee: 1000,
      };

      let mortgageDetailsBody: mortgageDetailsBody = {
         mortgageAmount: 2000000,
      };

      let applicantsEconomyBody: applicantsEconomyBody = {
         sharedAccommodation: null,
         coApplicant: null,
         doKidsLiveWithYou: false,
         kids: null,
         mainApplicant: {
            employmentStartDate: "2023-04-01T00:00:00.000Z",
            employmentType: "1",
            monthlyIncome: 50000,
            otherLoans: null,
            savings: 500000,
         },
         otherResidencies: null,
         ownsOtherResidencies: false,
         purchasesAtIca: 2000,
      };

      let mortgageRequest: MortgageRequest = {
         numberOfApplicants: 1,
         applicantsInformation: buildApplicantsInformationBody(applicantsInformationBody),
         residence: buildResidenceBody(residenceBody),
         mortgageDetails: buildMortgageDetailsBody(mortgageDetailsBody),
         applicantsEconomy: buildApplicantsEconomyBody(applicantsEconomyBody),
         borgKYCDetails: buildBorgKYCDetails(),
      };

      let resp = await apiRequest("POST", url, ssn, mortgageRequest);

      let j = await resp.json();

      console.log(j);

      expect(resp).toBeOK();
      expect(j.flowState).toEqual("AdditionalInformationNeeded");
      expect(j.resultCode).toEqual("Review");
      expect(j.resultReason).toEqual("35");
   });
});
// ansök om bolån med en användare under 18 - ssn: 201111110647