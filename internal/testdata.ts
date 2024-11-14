type TestData = {
   ver: TestDataEnv;
   test?: TestDataEnv;
};

type TestDataEnv = {
   monthlySavings?: MonthlySavings;
   buyFunds?: BuyFunds;
   sellFunds?: SellFunds;
   fundOverview?: FundOverview;
   openSavingsAccountChild?: OpenSavingsAccountChild;
   accountDetails?: AccountDetails;
   switchFunds?: SwitchFunds;
};

type SwitchFunds = {
   ssn: string;
   childSsn: string;
   depotAccountNo: string;
   iskAccountNo: string;
   childDeoptAccountNo: string;
   childIskAccountNo: string;
   savingsAccountNo: string;
};

type AccountDetails = {
   normalUser: {
      ssn: string;
      name: string;
   };
   childUser: {
      childSsn: string;
      guardianSsn: string;
      name: string;
   };
};

type MonthlySavings = {
   ssn: string;
   childSsn: string;
   depotAccountNo: string;
   savingsAccountNo: string;
   iskAccountNo: string;
   childIskAccountNo: string;
   childDepotAccountNo: string;
   childSavingsAccountNo: string;
};

type BuyFunds = {
   ssn: string;
   childSsn: string;
   depotAccountNo: string;
   iskAccountNo: string;
   childDeoptAccountNo: string;
   childIskAccountNo: string;
   savingsAccountNo: string;
   savingsAccountId: number;
};

type SellFunds = {
   ssn: string;
   childSsn: string;
   depotAccountNo: string;
   iskAccountNo: string;
   childDepotAccountNo: string;
   childIskAccountNo: string;
};

type FundOverview = {
   ssn: string;
   childSsn: string;
   depotAccountNo: string;
   iskAccountNo: string;
   savingsAccountNo: string;
};

type OpenSavingsAccountChildPerson = {
   ssn: string;
   name: string;
};

type OpenSavingsAccountChild = {
   guardian1: OpenSavingsAccountChildPerson;
   guardian2: OpenSavingsAccountChildPerson;
   guardian3: OpenSavingsAccountChildPerson;
   childOver16Yo: OpenSavingsAccountChildPerson;
   childOver18Yo: OpenSavingsAccountChildPerson;
   childUnder16Yo: OpenSavingsAccountChildPerson;
   child2Guardians: OpenSavingsAccountChildPerson;
   childProtectedIdentity: OpenSavingsAccountChildPerson;
};

export let testData: TestData = {
   ver: {
      switchFunds: {
         ssn: "197604235502",
         childSsn: "200811169507",
         depotAccountNo: "9002 141 64",
         iskAccountNo: "8003-79745",
         childDeoptAccountNo: "9002 143 70",
         childIskAccountNo: "8003-79943",
         savingsAccountNo: "9273-769 038 2",
      },
      accountDetails: {
         normalUser: {
            ssn: "197604235502",
            name: "JENNY MALMSTEEN",
         },
         childUser: {
            childSsn: "200811169507",
            guardianSsn: "197604235502",
            name: "ANGELINA MALMSTEEN",
         },
      },
      monthlySavings: {
         ssn: "197604235502",
         childSsn: "200811169507",
         depotAccountNo: "9002 141 64",
         savingsAccountNo: "9273-769 038 2",
         iskAccountNo: "8003-79745",
         childIskAccountNo: "8003-79943",
         childDepotAccountNo: "9002 143 70",
         childSavingsAccountNo: "9273-769 078 1",
      },
      buyFunds: {
         ssn: "197604235502",
         savingsAccountId: 92737690382,
         childSsn: "200811169507",
         depotAccountNo: "9002 141 64",
         iskAccountNo: "8003-79745",
         childDeoptAccountNo: "9002 143 70",
         childIskAccountNo: "8003-79943",
         savingsAccountNo: "9273-769 038 2",
      },
      sellFunds: {
         ssn: "197604235502",
         // ssn2: "196508261614",
         childSsn: "200811169507",
         depotAccountNo: "9002 141 64",
         iskAccountNo: "8003-79745",
         childIskAccountNo: "8003-79943",
         childDepotAccountNo: "9002 143 70",
      },
      fundOverview: {
         ssn: "197604235502",
         childSsn: "200811169507",
         // depotAccountNo: "900013228",
         depotAccountNo: "9002 141 64",
         iskAccountNo: "8003-79745",
         // savingsAccountNo: "92707354244"
         savingsAccountNo: "92737690382",
      },
      openSavingsAccountChild: {
         guardian1: {
            ssn: "197610266590",
            name: "DENISE ETT",
         },
         guardian2: {
            ssn: "198006010030",
            name: "Laban Nitton",
         },
         guardian3: {
            ssn: "197706194094",
            name: "INGBERT HYLTÉN",
         },
         childUnder16Yo: {
            ssn: "202102022387",
            name: "ELLA ELIASSON",
         },
         childOver16Yo: {
            ssn: "200802149997",
            name: "SON ETT",
         },
         childOver18Yo: {
            ssn: "200505082388",
            name: "HELGE HELGESSON",
         },
         child2Guardians: {
            ssn: "202001018726",
            name: "HON HYLTEN",
         },
         childProtectedIdentity: {
            ssn: "202002147441",
            name: "DOTTER ETT",
         },
      },
   },
   test: {
      openSavingsAccountChild: {
         guardian1: {
            ssn: "197610266590",
            name: "DENISE ETT",
         },
         guardian2: {
            ssn: "196508261614",
            name: "Magnus Malmsteen",
         },
         guardian3: {
            ssn: "197604235502",
            name: "Jenny Malmsteen",
         },
         childUnder16Yo: {
            ssn: "201012015796",
            name: "FRITTE MALMSTEEN",
         },
         childOver16Yo: {
            ssn: "200802149997",
            name: "SON ETT",
         },
         childOver18Yo: {
            ssn: "200505082388",
            name: "HELGE HELGESSON",
         },
         child2Guardians: {
            ssn: "201012015796",
            name: "FRITTE MALMSTEEN",
         },
         childProtectedIdentity: {
            ssn: "202002147441",
            name: "DOTTER ETT",
         },
      },
   },
};

export function chooseEnvTestData(): TestDataEnv {
   return testData[process.env.ENV];
}
