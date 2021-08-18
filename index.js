`use strict`;

const express = require("express");
const app = express();
const path = require("path");

//const StockChart = require("./utils/stockChart");

app.use(express.static(path.join(__dirname, "./client/public")));
app.use(express.json());

//const api_key = "5f75c7639947410a99d3551417a18f60";

const stock = "BTC/USD";

// wss.on("open", async () => {
//   console.log("connected");
//   //   await chart.getHistory();
//   //   chart.subscribe();
// });

//setInterval(() => console.log(chart.data), 10000);

//const chart = new StockChart(stock);

//chart.getHistory().then(() => console.log(chart.data));

app.get("/", async (req, res) => {
  // const chart = new StockChart(stock, api_key, wss);

  res.sendFile(path.join(__dirname, "./client/public"));
});

// app.get("/:symbol", async (req, res) => {
//   const { symbol } = req.params;

//   // const wss = await new WebSocket(
//   //   `wss://ws.twelvedata.com/v1/quotes/price?apikey=${api_key}`
//   // );
//   const stock = new StockChart(symbol, api_key);

//   stock.subscribe();
//   console.log("here");

//   res.send(stock);
// });

const port = process.env.PORT || 3001;

app.listen(port, () => console.log("App up on " + port));

// const { JSDOM } = require("jsdom");
// const dom = new JSDOM("<!DOCTYPE html><body><h1>hello world</h1></body>", {
//   url: "http://localhost:3001/",
//   contentType: "text/html",
//   pretendToBeVisual: true,
// });

// app.get("/:symbol", async (req, res) => {
//   const { document } = dom.window;

//   res.send(dom.serialize());
// });
