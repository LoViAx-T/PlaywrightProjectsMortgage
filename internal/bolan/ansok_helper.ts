interface ITestDataAboutResidenceHouse {
   residenceCost: string;
   villaInfoAddress: string;
   villaInfoZipCode: string;
   operatingCost: string;
   mortgageAmount: string;
   insuranceCompanyCode: string;
   hasFireInsuranceFullValue: boolean;
   fireInsuranceValue: string;
   permanentResidency: boolean;
   needsCashDepositLoan: boolean;
   sourceOfCashDeposit: sourceOfCashDepositValues[];
}

interface ITestDataAboutResidenceApartament {
   residenceCost: string;
   apartmentInfoApartmentNumber: string;
   apartmentInfoApartmentArea: string;
   apartmentInfoMonthlyFee: string;
   apartmentInfoAddress: string;
   apartmentInfoZipCode: string;
   operatingCost: string;
   mortgageAmount: string;
   insuranceCompanyCode: string;
   permanentResidency: boolean;
   needsCashDepositLoan: boolean;
   sourceOfCashDeposit: sourceOfCashDepositValues[];
}

interface ITestDataAboutResidenceVacation {
   residenceCost: string;
   cottageInfoAddress: string;
   cottageInfoZipCode: string;
   operatingCost: string;
   mortgageAmount: string;
   insuranceCompanyCode: string;
   hasFireInsuranceFullValue: boolean;
   fireInsuranceValue: string;
   permanentResidency: boolean;
   needsCashDepositLoan: boolean;
   sourceOfCashDeposit: sourceOfCashDepositValues[];
}

type sourceOfCashDepositValues = "Eget sparande" | "Försäljning tidigare bostad" | "Annan försäljning (bil/båt/annat)" | "Gåva/arv" | "Lån";

interface ITestDataAboutApplicant {
   applicantPersonalIdentityNumber?: string;
   applicantFirstName: string;
   applicantLastName: string;
   applicantMobileNumber: string;
   applicantEmail: string;
   applicantRelationshipStatus: applicantRelationshipStatusValues;
   applicantCitizenships: string[];
   applicantCountryOfResidenceSweden: boolean;
   applicantOtherCountryOfResidence?: string;
   applicantTaxResidences: ITaxResidences[];
   applicantPep: applicantPepValues;
   applicantPepRelative?: applicantPepRelativeValues;
}

type ITaxResidences = {
   country: string;
   tin?: string;
};

type applicantRelationshipStatusValues = "Ensamstående" | "Gift/Registrerad partner" | "Sambo";

type applicantPepValues =
   | "Ingen av dessa"
   | "Stats- eller regeringschef, minister eller vice/biträdande minister"
   | "Parlamentsledamot"
   | "Domare i högsta domstolen, konstitutionell domstol eller liknande befattning"
   | "Högre tjänsteman vid revisionsmyndighet eller ledamot i centralbanks styrande organ"
   | "Ambassadör, beskickningschef eller hög officer i försvarsmakten"
   | "Person som ingår i statsägt företags förvaltnings-, lednings- eller kontrollorgan"
   | "Ledande befattning i mellanstatlig organisation eller medlem i dess högsta ledning"
   | "Ledamot i styrelsen för ett politiskt parti";

type applicantPepRelativeValues = "Jag" | "Make/maka, registrerad partner eller sambo" | "Barn" | "Barns make/maka, registrerad partner eller sambo" | "Förälder" | "Medarbetare" | "Annan affärsförbindelse";

type kid = {
   age: string;
   custody: "ingen" | "halvtid" | "heltid";
   childSupportGet: boolean;
   childSupportPay: boolean;
};

type otherResidence = "Villa" | "Fritidshus" | "Bostadsrätt" | "Hyresrätt";

type otherResidenceVillaFritidshus = {
   keepResidence: boolean;
   operatingCost: string;
   hasGroundRent: boolean;
   groundRentAmount?: string;
   hasLoan: boolean;
   sizeOfLoan?: string;
   estimatedSaleAmount: string;
   accomodationBrokerFee?: string;
   accomodationConveyenceDate: string;
};

type otherResidenceBostadsratt = {
   keepResidence: boolean;
   fee?: string;
   operatingCost: string;
   hasLoan: boolean;
   sizeOfLoan?: string;
};

type otherResidenceHyresratt = {
   keepResidence: boolean;
   fee?: string;
};
