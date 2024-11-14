const sql = require("mssql/msnodesqlv8");
export async function SQLQuery(query: string) {
   try {
      let config = {
         driver: "msnodesqlv8",
         server: process.env.SQL_SERVER,
         options: { trustedConnection: true },
      };

      var conn = await sql.connect(config);
      var result = await conn.query(query);
      result = result.recordset;
      result.forEach((element) => {
         for (const key in element) {
            if (element.hasOwnProperty(key)) {
               if (typeof element[key] === "string") {
                  element[key] = element[key].trim();
               }
            }
         }
      });

      return result;
   } catch (e) {
      console.error("Something went wrong when querying SQL data", e);
      throw e;
   } finally {
      await conn.close();
   }
}
