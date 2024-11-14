import { test, expect } from "@playwright/test";
import * as sql from "../../internal/sql";

test.skip("MSSQL query @example", async () => {
   let test = await sql.SQLQuery(
      `SELECT * FROM [${process.env.DB_SQL_AB}].[dbo].[CUSTOMER_PRIME] where ID_Number = '2107160018'`,
   );
   console.log(test);
});
