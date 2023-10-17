/*
 * exampleServer.js
 *
 * This code was written quickly for the purposes of recruiting,
 * and is not indicative of how we write code at Bright.
 */
const http = require('http');

let reqId = 0;
let currentlyRunning = 0;

async function lookupPrice(symbol) {
  reqId += 1;
  const myReqId = reqId;

  console.info(`lookupPrice: ${symbol}`);
  const uniqueAtStart = currentlyRunning === 0;
  currentlyRunning += 1;
  const jitter = ((Math.random() - 0.5) * 200);
  await new Promise(resolve => setTimeout(resolve, 1000 + jitter));
  currentlyRunning -= 1;
  const uniqueAtEnd = myReqId === reqId;

  if (uniqueAtStart && uniqueAtEnd) {
    const price = Math.random();
    const symbolIsValid = symbol.toUpperCase().slice(0, 5) === symbol && (/^[A-Z]+$/g).test(symbol);
    if (!symbolIsValid) {
      console.info(`lookupPrice: ${symbol} is invalid`);
      return {
        statusCode: 404,
        data: {
          error: `Stock ${symbol} not found`,
        },
      };
    }
    return {
      statusCode: 200,
      data: { price, symbol },
    };
  }
  console.warn(`lookupPrice: ${symbol} was concurrent with other requests`);
  return {
    statusCode: 409,
    data: {
      error: 'Too many concurrent requests',
    },
  };
}

const server = http.createServer(async (request, response) => {
  const { method, url } = request;
  if (url.startsWith('/lookupPrice/') && method === 'GET') {
    const symbol = url.substring('/lookupPrice/'.length);
    const { statusCode, data } = await lookupPrice(symbol);

    const respData = JSON.stringify(data);
    response.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(respData),
    });

    response.end(respData);
    return;
  }

  const respData = JSON.stringify({
    error: 'not found',
  });

  response.writeHead(404, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(respData)
  });

  response.end(respData);
  return;
});

const port = 8080;
server.listen(port);
console.info(`Server listening on :${port}`);
