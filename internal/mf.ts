
const cn = `DATABASE=${process.env.MF_DATABASE};HOSTNAME=${process.env.MF_HOSTNAME};UID=${process.env.MFUSERNAME};PWD=${process.env.MFPASS};PORT=${process.env.MF_PORT};PROTOCOL=TCPIP;`;

export async function MFQuery(query: string) {
   try {
      const ibmdb =require("ibm_db");
      var conn = await ibmdb.open(cn);
      var result = await conn.query(query);

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
      console.error("Something went wrong when querying MF data", e);
      throw e;
   } finally {
      await conn.close();
   }
}
