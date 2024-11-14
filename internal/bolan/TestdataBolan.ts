import { test, expect, Page } from "@playwright/test";

//Om Bostaden
export const data = {
   residenceCost: "10000000",
   mortgageAmount: "200000",
   operatingCost: "900",
   creditor: "DANSKE BOLÅN",
   isInsured: { hasText: /^Ja$/ },
   insuranceCompanyCode: "DINA",
   permanentResidency: { hasText: /^Ja$/ },

   //Om Bostaden - Brf
   apartmentInfoapartmentNumber: "1208",
   apartmentInfoapartmentArea: "100",
   apartmentInfomonthlyFee: "3000",
   apartmentInfoaddress: "Herrviken 3",
   apartmentInfozipCode: "11227",

   //Om Bostaden - Villa
   villaInfoaddress: "Fröjel Stora Hajdes 717",
   villaInfozipCode: "17144",
   hasFireInsuranceFullValue: { hasText: /^Ja$/ },
   cashDepositOrigin: { hasText: "Sålt bostad" },

   //"Om dig" Sökande 1.
   applicant1personalIdentityNumber: "196312172486",
   applicant1firstName: "Test",
   applicant1lastName: "Testare",
   applicant1mobileNumber: "0700000000",
   applicant1email: "test@test.se",
   applicant1relationshipStatus: { hasText: "Gift/Registrerad partner" },
   applicant1citizenships: "Sverige",
   applicant1CitizenshipsUtomlands: "Danmark",
   applicant1countryOfResidence: { hasText: /^Sverige$/ },
   applicant1countryOfResidenceUtomlands: { hasText: /^Annat land$/ },
   applicant1otherCountryOfResidence: "Danmark",
   applicant1taxResidences: "Sverige",
   applicant1taxResidencesUtomlands: "Norge",
   taxResidenceTIN: "99999999999",
   applicant1pep: "Ingen av dessa",

   // "Om dig" Sökande 2.
   applicant2personalIdentityNumber: "196705111596",
   applicant2firstName: "Tester",
   applicant2lastName: "Testsson",
   applicant2mobileNumber: "0700000000",
   applicant2email: "test@test.se",
   applicant2relationshipStatus: { hasText: "Gift/Registrerad partner" },
   applicant2citizenships: "Sverige",
   applicant2citizenshipsUtomlands: "Danmark",
   applicant2countryOfResidence: { hasText: /^Sverige$/ },
   applicant2countryOfResidenceUtomlands: { hasText: /^Annat land$/ },
   applicant2otherCountryOfResidence: "Danmark",
   applicant2taxResidences: "Sverige",
   applicant2taxResidencesUtomlands: "Norge",
   applicant2taxResidenceTIN: "99999999999",
   applicant2pep: "Ingen av dessa",

   //"Din ekonomi" Sökande 1
   stammis: "1-999",
   doKidsLiveWithYou: { hasText: /^Nej$/ },
   isSharedAccommodation: { hasText: /^Ja$/ },
   ownsOtherResidencies: { hasText: /^Nej$/ },
   ownsOtherResidenciesOBL: { hasText: /^Ja$/ },
   mainApplicantInfotypeOfWork: "Tillsvidareanställning",
   mainApplicantInfoemployer: "Tempo",
   mainApplicantInfoemploymentStartDate: "19990101",
   mainApplicantInfomonthlyIncome: "120000",
   mainApplicantInfosavings: "700000",
   mainApplicantInfoincomeInSek: { hasText: /^Ja$/ },
   mainApplicantInfoanyOtherLoans: { hasText: /^Nej$/ },
   wantToLoanMore: "Nej",

   // "Din ekonomi" Sökande 2
   coApplicantInfotypeOfWork: "Tillsvidareanställning",
   coApplicantInfoemployer: "SAAB",
   coApplicantInfoemploymentStartDate: "20080203",
   coApplicantInfomonthlyIncome: "95000",
   coApplicantInfosavings: "100000",
   coApplicantInfoincomeInSek: { hasText: /^Ja$/ },
   coApplicantInfoanyOtherLoans: { hasText: /^Nej$/ },
   wantToLoanMore1: { hasText: /^Nej$/ },

   //"Din Ekonomi" för höj-ansökan.
   wantToLoanMore2: { hasText: /^Ja$/ },
   extraLoanAmount: "500000",
   extraLoanPurpose: "Lösa/amortera andra lån/",

   //Köp-ansökan
   //HPL
   needsCashDepositLoan: { hasText: /^Nej$/ },
   needsCashDepositLoanYES: { hasText: /^Ja$/ },
   needsCashDepositLoanNO: { hasText: /^Nej$/ },

   //Behålla annan bostad
   otherResidencieskeepResidence: { hasText: /^Nej$/ },
   otherResidenciesoperatingCost: "500",
   otherResidencieshasLoan: { hasText: /^Nej$/ },
   otherResidenciesestimatedSaleAmount: "6000000",
   otherResidenciesBrokerFee: "100000",
   otherResidenciesaccomodationConveyenceDate: "20241201",
   mainApplicantInfohasTaxDeferment: { hasText: /^Nej$/ },
   coApplicantTaxDeferment: { hasText: /^Nej$/ },
   typeOfOtherResidencies: "Bostadsrätt",
   keepOtherResidencies: { hasText: /^Nej$/ },

   freetext: "Det här är en test-anteckning för fritext - Autotester",

   lastPage1: { name: "Vi kunde inte ta emot ansökan" },
   lastPage2: { name: "Vi går igenom din ansökan" },
};
