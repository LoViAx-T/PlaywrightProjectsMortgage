export interface MortgageRequest {
   numberOfApplicants: number;
   residence: Residence;
   mortgageDetails: MortgageDetails;
   applicantsInformation: ApplicantsInformation;
   applicantsEconomy: ApplicantsEconomy;
   borgKYCDetails: BorgKycdetails;
}

export interface Residence {
   objectId?: string;
   typeOfResidence: string;
   villaInfo: VillaInfo;
   cottageInfo: CottageInfo;
   apartmentInfo: ApartmentInfo;
   operatingCost: number;
   isInsured: boolean;
   currentValue: number;
   purchasePrice: number;
   insuranceCompany: string;
   otherInsuranceCompanyName: string;
   hasFireInsuranceFullValue: boolean;
   fireInsuranceOtherValue: number;
   permanentResidency: boolean;
}

export interface VillaInfo {
   address: string;
   postalCode: string;
}

export interface CottageInfo {
   address: string;
   postalCode: string;
}

export interface ApartmentInfo {
   address: string;
   postalCode: string;
   apartmentNumber: string;
   monthlyfee: number;
   area: number;
}

export interface MortgageDetails {
   purposeOfLoan: string;
   mortgageAmount: number;
   commitmentPeriod: number;
   extraLoanAmount: number;
   extraLoanPurpose: string;
   extraLoanPurposeDescription?: string;
   creditor: string;
   otherCreditorName: string;
   currentMortgageLoans?: CurrentMortgageLoan[];
}

export interface CurrentMortgageLoan {
   creditor: string;
   otherCreditorName: string;
   accountNumber: string;
   accountId: string;
   fixationPeriod: number;
   amortization: number;
   currentDebtAmount: number;
}

export interface ApplicantsInformation {
   mainApplicant: MainApplicant;
   coApplicant: CoApplicant;
}

export interface MainApplicant {
   personalIdentityNumber: string;
   firstname: string;
   lastname: string;
   mobileNumber: string;
   email: string;
   relationshipStatus: string;
   citizenshipWithinEes?: boolean;
   citizenships: string[];
   countryOfResidence: string;
   whoIsPepCode: string;
   pepRoleCode: string;
   taxResidences: TaxResidence[];
   partnerName: string;
   partnerNationalId: string;
}

export interface TaxResidence {
   countryCode: string;
   tin?: string;
}

export interface CoApplicant {
   personalIdentityNumber: string;
   firstname: string;
   lastname: string;
   mobileNumber: string;
   email: string;
   relationshipStatus: string;
   citizenshipWithinEes: boolean;
   citizenships: string[];
   countryOfResidence: string;
   whoIsPepCode: string;
   pepRoleCode: string;
   taxResidences: TaxResidence2[];
   partnerName: string;
   partnerNationalId: string;
}

export interface TaxResidence2 {
   countryCode: string;
   tin: string;
}

export interface ApplicantsEconomy {
   purchasesAtIca: number;
   sharedAccommodation: boolean;
   doKidsLiveWithYou: boolean;
   kids: Kid[];
   ownsOtherResidencies: boolean;
   otherResidencies: OtherResidency[];
   mainApplicant: MainApplicant2;
   coApplicant: CoApplicant2;
}

export interface Kid {
   age: number;
   custodyPercentage: number;
   childSupportGet: boolean;
   childSupportPay: boolean;
}

export interface OtherResidency {
   typeOfResidency: string;
   monthlyFee: number;
   operatingCost: number;
   sizeOfLoan: number;
   expectedSalesAmount: number;
   keepResidence: boolean;
   creditor?: string;
   otherCreditorName?: string;
   groundRentAmount: number;
   conveyanceDate: string;
   brokerFee: number;
}

export interface MainApplicant2 {
   employmentType: string;
   employer: string;
   employerOrganizationNumber: string;
   employmentStartDate: string;
   employmentEndDate?: string;
   branch: string;
   monthlyIncome: number;
   monthlyIncomeType?: string;
   savings: number;
   otherLoans: OtherLoan[];
   taxDefermentAmount: number;
}

export interface OtherLoan {
   loanAmount: number;
   typeOfOtherLoan: string;
   studentAmortization: number;
   wantToMoveTheLoanToUs: boolean;
   isShared: boolean;
}

export interface CoApplicant2 {
   employmentType: string;
   employer: string;
   employerOrganizationNumber: string;
   employmentStartDate: string;
   employmentEndDate?: string;
   branch: string;
   monthlyIncome: number;
   monthlyIncomeType?: string;
   savings: number;
   otherLoans: OtherLoan2[];
   taxDefermentAmount: number;
}

export interface OtherLoan2 {
   loanAmount: number;
   typeOfOtherLoan: string;
   studentAmortization: number;
   wantToMoveTheLoanToUs: boolean;
   isShared: boolean;
}

export interface BorgKycdetails {
   purpose: string;
   fundingOrigination?: string;
   fundingOriginations: string[];
   isCashDepositLoanRequired: boolean;
}


export let applicantsEconomyMainApplicantDefault: MainApplicant2 = {
   branch: null,
   employer: "Qway AB",
   employerOrganizationNumber: null,
   employmentStartDate: "2023-04-01T00:00:00.000Z",
   monthlyIncome: 50000,
   employmentType: "1",
   savings: 500000,
   otherLoans: null,
   taxDefermentAmount: 0
};

export let applicantsEconomyCoApplicantDefault: CoApplicant2 = {
   branch: null,
   employer: "Qway AB",
   employerOrganizationNumber: null,
   employmentStartDate: "2023-04-01T00:00:00.000Z",
   monthlyIncome: 50000,
   employmentType: "1",
   savings: 500000,
   otherLoans: null,
   taxDefermentAmount: 0
}

export let applicantsEconomyKidsDefault: Kid[] = [
   {
      age: 1,
      custodyPercentage: 100,
      childSupportGet: false,
      childSupportPay: false
   },
   {
      age: 18,
      custodyPercentage: 100,
      childSupportGet: false,
      childSupportPay: false
   }
]

export let applicantsEconomyOtherResidencies: OtherResidency[] = [
   {
      typeOfResidency: "2",
      monthlyFee: null,
      operatingCost: 2000,
      sizeOfLoan: null,
      expectedSalesAmount: 500000,
      keepResidence: true,
      groundRentAmount: 0,
      conveyanceDate: null,
      brokerFee: null 
   }
];

export let applicantsEconomyDefault: ApplicantsEconomy = {
   mainApplicant: applicantsEconomyMainApplicantDefault,
   coApplicant: applicantsEconomyCoApplicantDefault,
   doKidsLiveWithYou: true,
   kids: applicantsEconomyKidsDefault,
   purchasesAtIca: 2000,
   ownsOtherResidencies: true,
   otherResidencies: applicantsEconomyOtherResidencies,
   sharedAccommodation: null,
}


export let applicantsInformationMainTaxResidenciesDefault: TaxResidence[] = [
   {
      countryCode: "SE",
      tin: null
   }
]

export let applicantsInformationMainApplicant: MainApplicant = {
   firstname: "Fredde",
   lastname: "Schiller",
   email: "fredde.schiller@test.com",
   personalIdentityNumber: null,
   mobileNumber: "0768360000",
   citizenships: ["SE"],
   citizenshipWithinEes: false,
   countryOfResidence: "SE",
   relationshipStatus: "1",
   partnerName: null,
   partnerNationalId: null,
   taxResidences: applicantsInformationMainTaxResidenciesDefault,
   pepRoleCode: "X",
   whoIsPepCode: null
}

export let applicantsInformationCoTaxResidenciesDefault: TaxResidence2[] = [
   {
      countryCode: "SE",
      tin: null
   }
]

export let applicantsInformationCoApplicantDefault: CoApplicant = {
   countryOfResidence: "SE",
   email: "mikaela.schiller@test.com",
   firstname: "mikaela",
   lastname: "schiller",
   mobileNumber: "0768360000",
   citizenships: ["SE"],
   partnerName: null,
   partnerNationalId: null,
   taxResidences: applicantsInformationCoTaxResidenciesDefault ,
   pepRoleCode: "X",
   whoIsPepCode: null,
   personalIdentityNumber: "197102034191",
   relationshipStatus: "2",
   citizenshipWithinEes: false
}

export let applicantsInformationDefault: ApplicantsInformation = {
   mainApplicant: applicantsInformationMainApplicant,
   coApplicant: applicantsInformationCoApplicantDefault, 
}

export let mortgageDetailsCottageInfoDefault: CottageInfo = {
   address: "Infanterigatan 90",
   postalCode: "11227"
}

export let mortgageDetailsVillaInfoDefault: VillaInfo = {
   address: "Infanterigatan 6",
   postalCode: "11227"
}

export let mortgageDetailsApartmentInfo: ApartmentInfo = {
   address: "Lovartsvägen 44",
   apartmentNumber: "1101",
   monthlyfee: 2500,
   postalCode: "18135",
   area: 80,
};


export let residenceDefault: Residence = {
   currentValue: 5000000,
   isInsured: true,
   insuranceCompany: "2",
   otherInsuranceCompanyName: null,
   hasFireInsuranceFullValue: null,
   fireInsuranceOtherValue: null,
   operatingCost: 3000,
   purchasePrice: 5000000,
   typeOfResidence: "2",
   apartmentInfo: mortgageDetailsApartmentInfo,
   cottageInfo: null,
   villaInfo: null,
   permanentResidency: true
}

export let mortgageDetailsDefault: MortgageDetails = {
   commitmentPeriod: 3,
   mortgageAmount: 4000000,
   creditor: null,
   otherCreditorName: null,
   purposeOfLoan: "1",
   extraLoanAmount: 0,
   extraLoanPurpose: null,
   currentMortgageLoans: null,
}

export let borgKYCDetailsDefault: BorgKycdetails = {
   fundingOriginations: ["5", "1"],
   isCashDepositLoanRequired: true,
   purpose: "1"
}

export let mortgageRequestDefault: MortgageRequest = {
   numberOfApplicants: 1,
   residence: residenceDefault,
   mortgageDetails: mortgageDetailsDefault,
   applicantsInformation: applicantsInformationDefault,
   applicantsEconomy: applicantsEconomyDefault,
   borgKYCDetails: borgKYCDetailsDefault,
}


export type residenceBody = {
   typeOfResidence: "villa" | "lagenhet" | "fritidshus";
   residenceCost: number;
   operatingCost: number;
   apartamentInfoArea?: number;
   apartamentInfoMonthlyFee?: number
}

export function buildResidenceBody(data:residenceBody): Residence {
   // typeOfResidence: 1: villa, 2: lagenhet, 3: fritidshus
   let residenceDefault: Residence = {
      currentValue: data.residenceCost,
      isInsured: true,
      insuranceCompany: "2", // Ica försäkringar
      otherInsuranceCompanyName: null,
      hasFireInsuranceFullValue: null,
      fireInsuranceOtherValue: null,
      operatingCost: data.operatingCost,
      purchasePrice: data.residenceCost,
      typeOfResidence: "",
      apartmentInfo: null,
      cottageInfo: null,
      villaInfo: null,
      permanentResidency: true,
   };
   
   switch (data.typeOfResidence) {
      case "villa":
         residenceDefault.villaInfo = mortgageDetailsVillaInfoDefault;
         residenceDefault.typeOfResidence = "1";
         break;
      case "lagenhet":
         let mortgageDetailsApartmentInfo: ApartmentInfo = {
            address: "Lovartsvägen 44",
            apartmentNumber: "1101",
            monthlyfee: data.apartamentInfoMonthlyFee,
            postalCode: "18135",
            area: data.apartamentInfoArea,
         };
         residenceDefault.typeOfResidence = "2";
         residenceDefault.apartmentInfo = mortgageDetailsApartmentInfo;
         break;
      case "fritidshus":
         residenceDefault.cottageInfo = mortgageDetailsCottageInfoDefault;
         residenceDefault.typeOfResidence = "3";
         break;
   }

   return residenceDefault; 
}

export type mortgageDetailsBody = {
   mortgageAmount: number;
}

export function buildMortgageDetailsBody(data: mortgageDetailsBody): MortgageDetails {
   let mortgageDetailsDefault: MortgageDetails = {
      commitmentPeriod: 3,
      mortgageAmount: data.mortgageAmount,
      creditor: null,
      otherCreditorName: null,
      purposeOfLoan: "1",
      extraLoanAmount: 0,
      extraLoanPurpose: null,
      currentMortgageLoans: null,
   };
   return mortgageDetailsDefault
}

export type applicantsInformationBody = {
   mainApplicant: {
      citizenships: string[]; // ex: ["SE"]
      citizenshipWithinEes: boolean;
      countryOfResidence: string; //ex: "SE"
      relationshipStatus: "1" | "2" | "3"; // ex: 1
      taxResidences: TaxResidence[];
      pepRoleCode: "X" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
      whoIsPepCode: null | "1" | "2" | "3" | "4" | "5" | "6" | "7";
   };
   coApplicant?: {
      citizenships: string[]; // ex: ["SE"]
      citizenshipWithinEes: boolean;
      countryOfResidence: string; //ex: "SE"
      relationshipStatus: "1" | "2" | "3"; // ex: 1
      taxResidences: TaxResidence2[];
      pepRoleCode: "X" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
      whoIsPepCode: null | "1" | "2" | "3" | "4" | "5" | "6" | "7";
   };
};

export function buildApplicantsInformationBody(data: applicantsInformationBody): ApplicantsInformation {
   let applicantsInformationMainApplicant: MainApplicant = {
      firstname: "Fredde",
      lastname: "Schiller",
      email: "fredde.schiller@test.com",
      personalIdentityNumber: null,
      mobileNumber: "0768360000",
      citizenships: data.mainApplicant.citizenships,
      citizenshipWithinEes: data.mainApplicant.citizenshipWithinEes,
      countryOfResidence: data.mainApplicant.countryOfResidence,
      relationshipStatus: data.mainApplicant.relationshipStatus,
      partnerName: null,
      partnerNationalId: null,
      taxResidences: data.mainApplicant.taxResidences,
      pepRoleCode: data.mainApplicant.pepRoleCode,
      whoIsPepCode: data.mainApplicant.whoIsPepCode,
   };

   let applicantsInformationCoApplicantDefault: CoApplicant;

   if (data.coApplicant) {
      applicantsInformationCoApplicantDefault = {
         countryOfResidence: "SE",
         email: "mikaela.schiller@test.com",
         firstname: "mikaela",
         lastname: "schiller",
         mobileNumber: "0768360000",
         citizenships: data.coApplicant.citizenships,
         partnerName: null,
         partnerNationalId: null,
         taxResidences: data.coApplicant.taxResidences,
         pepRoleCode: data.coApplicant.pepRoleCode,
         whoIsPepCode: data.coApplicant.whoIsPepCode,
         personalIdentityNumber: "197102034191",
         relationshipStatus: data.coApplicant.relationshipStatus,
         citizenshipWithinEes: data.coApplicant.citizenshipWithinEes,
      };
   }

   let applicantsInformationDefault: ApplicantsInformation = {
      mainApplicant: applicantsInformationMainApplicant,
      coApplicant: applicantsInformationCoApplicantDefault,
   };
   return applicantsInformationDefault;
}

export type applicantsEconomyBody = {
   mainApplicant: {
      employmentStartDate: string; // ex. "2023-04-01T00:00:00.000Z"
      monthlyIncome: number;
      employmentType: "1" | "2" | "4" | "5" | "6" |  "7";
      savings: number;
      otherLoans: OtherLoan[];  // can be null 
   };
   coApplicant: {
      employmentStartDate: string; // ex. "2023-04-01T00:00:00.000Z"
      monthlyIncome: number;
      employmentType: "1" | "2" | "4" | "5" | "6" |  "7";
      savings: number;
      otherLoans: OtherLoan[];
   };
   doKidsLiveWithYou: boolean;
   kids: Kid[];
   purchasesAtIca: 0 | 1 | 1000 | 2000 | 4000 | 6000 | 8000;
   ownsOtherResidencies: boolean;
   otherResidencies: OtherResidency[];
   sharedAccommodation: boolean;
}

export function buildApplicantsEconomyBody(data: applicantsEconomyBody) {
   let applicantsEconomyMainApplicantDefault: MainApplicant2 = {
      branch: null,
      employer: "Qway AB",
      employerOrganizationNumber: null,
      employmentStartDate: data.mainApplicant.employmentStartDate,
      monthlyIncome: data.mainApplicant.monthlyIncome,
      employmentType: data.mainApplicant.employmentType,
      savings: data.mainApplicant.savings,
      otherLoans: data.mainApplicant.otherLoans,
      taxDefermentAmount: 0,
   };

   let applicantsEconomyCoApplicantDefault: CoApplicant2
   if (data.coApplicant) {
      applicantsEconomyCoApplicantDefault = {
         branch: null,
         employer: "Qway AB",
         employerOrganizationNumber: null,
         employmentStartDate: data.coApplicant.employmentStartDate,
         monthlyIncome: data.coApplicant.monthlyIncome,
         employmentType: data.coApplicant.employmentType,
         savings: data.coApplicant.savings,
         otherLoans: data.coApplicant.otherLoans,
         taxDefermentAmount: 0,
      };
   }
   // let applicantsEconomyKidsDefault: Kid[] = [
      // {
         // age: 1,
         // custodyPercentage: 100,
         // childSupportGet: false,
         // childSupportPay: false,
      // },
      // {
         // age: 18,
         // custodyPercentage: 100,
         // childSupportGet: false,
         // childSupportPay: false,
      // },
   // ];

   // let applicantsEconomyOtherResidencies: OtherResidency[] = [
      // {
         // typeOfResidency: "2",
         // monthlyFee: null,
         // operatingCost: 2000,
         // sizeOfLoan: null,
         // expectedSalesAmount: 500000,
         // keepResidence: true,
         // groundRentAmount: 0,
         // conveyanceDate: null,
         // brokerFee: null,
      // },
   // ];

   let applicantsEconomyDefault: ApplicantsEconomy = {
      mainApplicant: applicantsEconomyMainApplicantDefault,
      coApplicant: applicantsEconomyCoApplicantDefault,
      doKidsLiveWithYou: true,
      kids: applicantsEconomyKidsDefault,
      purchasesAtIca: data.purchasesAtIca,
      ownsOtherResidencies: data.ownsOtherResidencies,
      otherResidencies: data.otherResidencies,
      sharedAccommodation: data.sharedAccommodation,
   };
   return applicantsEconomyDefault;
}

export function buildBorgKYCDetails(): BorgKycdetails {
   let borgKYCDetailsDefault: BorgKycdetails = {
      fundingOriginations: ["1", "5"],
      isCashDepositLoanRequired: true,
      purpose: "1"
   }   
   return borgKYCDetailsDefault;
}