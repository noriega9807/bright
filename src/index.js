import StockPriceService from "./StockPriceService.js";

const stockPriceService = new StockPriceService();

const stocks = [
  "TSLA",
  "AAPL",
  "GOOGL",
  "AMZN",
  "MSFT",
  "NVDA",
  "FB",
  "NFLX",
  "GOOG",
  "CRM",
];

// Set the number of loops you want
const inputLoop = 5;

async function getStockPrice(loops) {
  if (loops <= 0) {
    return;
  }

  const randomStock = stocks[Math.floor(Math.random() * stocks.length)];

  try {
    const response = await stockPriceService.lookupPrice(randomStock);
    console.log(response);
    getStockPrice(loops - 1);
  } catch (error) {
    console.error(`Failed to fetch the price for ${ticker}: ${error.message}`);
  }
}

getStockPrice(inputLoop);
