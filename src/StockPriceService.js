import http from "http";

class StockPriceService {
  constructor() {
    this.pendingRequests = new Map();
  }

  async lookupPrice(symbol) {
    if (typeof symbol !== "string" || symbol.trim() === "") {
      throw new Error("Invalid symbol");
    }

    if (this.pendingRequests.has(symbol)) {
      return this.pendingRequests.get(symbol);
    }

    const requestPromise = this.fetchPriceFromAPI(symbol);

    this.pendingRequests.set(symbol, requestPromise);

    try {
      const response = await requestPromise;
      if (response.statusCode !== 200) {
        throw new Error(
          `Request failed with status code ${response.statusCode}`
        );
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      this.pendingRequests.delete(symbol);
    }
  }

  async fetchPriceFromAPI(symbol) {
    return new Promise(async (resolve) => {
      const options = {
        hostname: "127.0.0.1",
        port: 8080,
        path: `/lookupPrice/${symbol}`,
        method: "GET",
      };

      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const statusCode = res.statusCode;
          const responseData = JSON.parse(data);
          resolve({ statusCode, data: responseData });
        });
      });

      req.on("error", (error) => {
        resolve({ statusCode: 500, data: { error: error.message } });
      });

      req.end();
    });
  }
}

export default StockPriceService;
