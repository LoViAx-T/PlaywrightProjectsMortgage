import crypto from "crypto";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from 'tough-cookie';

// const CLIENT_ID = "c10764d3-7221-4fde-9a27-754d064f562e"; // test
const CLIENT_ID = process.env.CURITY_CLIENT_ID; //ver
// const SECRET = "UMCGASYqvYbBoYMqBtcr_6htaQLNZxU0cRtxJRiPddoL4CjPkqENXaRAH4FSI2Aa"; // test
const SECRET = "rVV-u7EBUS9jxBtCXL32aGqxLQyVobs5wMu83bsshgxnurRPTb2vZbM-jq-QpoYm"; // ver
const ACR = "urn:se:curity:authentication:username:icabanken-username-bankid";
const SCOPE = "openid bank_public_user bank_public_long bank_public_short";
let ENV = process.env.ENV;
if (ENV == "sandbox") ENV = "test"
const SSN = "192107160018";

const verifier = base64URLEncode(crypto.randomBytes(32));
const challenge = base64URLEncode(sha256(verifier));

const jar = new CookieJar();

// create axios instance
const request = wrapper(axios.create({
  jar: jar,
  headers: {
    Accept: "*/*",
  },
}));

export async function curityTokenLightning(ssn) {
  await request
    .get(`https://login-${ENV}.icabanken.se/oauth/v2/authorize`, {
      params: {
        response_type: "code",
        acr: encodeURIComponent(ACR),
        client_id: CLIENT_ID,
        scope: SCOPE,
        client_secret: SECRET,
        redirect_uri: `https://${ENV}.icabanken.se/assisted.html`,
        code_challenge: challenge,
        code_challenge_method: "S256",
      },
    })
    .then(function (response) {
      return response.headers["set-cookie"];
    })
    .catch(function (error) {
      console.log(error);
      console.log("first request error");
      process.exit(1);
    });

  const stateAndToken = await request
    .post(
      `https://login-${ENV}.icabanken.se/authn/authenticate/icabanken-username-bankid`,
      {
        username: ssn,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      return parseHtml(response.data);
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      console.log("second request error");
      process.exit(1);
    });

  let getCode = await request
    .post(
      `https://login-${ENV}.icabanken.se/oauth/v2/authorize`,
      {
        token: stateAndToken.token,
        state: stateAndToken.state,
      },
      {
        params: {
          client_id: CLIENT_ID,
          acr: encodeURIComponent(ACR),
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        maxRedirects: 0,
        validateStatus: function (status) {
          return status <= 303; // Resolve only if the status code is less than 303
        },
      }
    )
    .then((response) => {
      const searchParams = new URLSearchParams(response.headers.location);
      return searchParams.get("code");
    })
    .catch((error) => {
      console.error(error);
      console.log("third request error");
    });

  let curity = await request
    .post(
      `https://login-${ENV}.icabanken.se/oauth/v2/token`,
      {
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: getCode,
        scope: SCOPE,
        redirect_uri: `https://${ENV}.icabanken.se/assisted.html`,
        code_verifier: verifier,
        client_secret: SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // Handle the error
      console.error(error);
      console.log("third request error");
      process.exit(1);
    });

  // let icasess = await request.post(`https://${ENV}.privat.icabanken.se/api/ids/create`, 
    // {
      // token: curity.access_token
    // },
    // {
      // headers: {
        // "Content-Type": "application/json",
      // }
    // }
  // )
  // .then((response) => {
      // console.log("YES")
      // return response.data;
    // })
    // .catch((error) => {
      // // Handle the error
      // console.error(error);
      // console.log("icasess request error");
      // process.exit(1);
    // });

  return curity
}


function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

function parseHtml(htmlString) {
  var regexToken = /name=\"(token)\"\s+value=\"([^\"]*)\"/g;

  var matchesToken = htmlString.match(regexToken);
  var token = matchesToken.map(function (match) {
    // split the match by double quotes and return the third element
    return match.split('"')[3];
  });

  var regexState = /name=\"(state)\"\s+value=\"([^\"]*)\"/g;

  var matchesState = htmlString.match(regexState);
  var state = matchesState.map(function (match) {
    // split the match by double quotes and return the third element
    return match.split('"')[3];
  });

  return { token: token[0], state: state[0] };
}