import axios from "axios";
//import WebSocket from "ws";

const xYearAgo = (x) =>
  new Date(new Date().setFullYear(new Date().getFullYear() - x));
const xMonthAgo = (x) =>
  new Date(new Date().setMonth(new Date().getMonth() - x));
const xDayAgo = (x) => new Date(new Date().setDate(new Date().getDate() - x));

export const timeIntervals = {
  "1d": xDayAgo(1),
  "1w": xDayAgo(7),
  "1m": xMonthAgo(1),
  "3m": xMonthAgo(3),
  "6m": xMonthAgo(6),
  "1y": xYearAgo(1),
  "2y": xYearAgo(2),
  "5y": xYearAgo(5),
  "10y": xYearAgo(10),
};

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

export class StockChart {
  constructor(symbol) {
    this.symbol = symbol;
    this.api_key = "5f75c7639947410a99d3551417a18f60";
    this.isConnected = false;
    this.wss = new WebSocket(
      `wss://ws.twelvedata.com/v1/quotes/price?apikey=${this.api_key}`
    );
    this.timeSeries = {};
    this.quote = [];
  }

  subscribe = () => {
    this.wss.on("open", () => {
      this.isConnected = true;
      this.wss.send(this.sendMsg("subscribe"));
      this.wss.on("message", (x) => {
        let msg = JSON.parse(x);
        if (msg.event === "price" && msg.symbol === this.symbol) {
          const { timestamp, price } = msg;
          this.data.push({ timestamp, price });
          console.log("///////////////////////////////");
          console.log(this.data);
        }
      });
    });
  };

  closeSocket = () => {
    this.wss.close();
    this.isConnected = false;
  };

  unsubscribe = () => {
    this.wss.send(this.sendMsg("unsubscribe"));
  };

  sendMsg = (action) => {
    return JSON.stringify({
      action,
      params: {
        symbols: this.symbol,
      },
    });
  };

  getHistory = async () => {
    const { data } = await axios.post(
      `https://api.twelvedata.com/complex_data?apikey=${this.api_key}`,
      {
        symbols: [this.symbol],
        intervals: [`1day`],
        // start_date: "2021-08-13 09:30:00",
        //start_date: ,
        end_date: new Date(),
        methods: ["quote", "time_series", "price"],
        timezone: "America/New_York",
      }
    );

    console.log(data);
    this.price = data.data[2].price;
    this.quote = data.data[0];
    this.timeSeries = data.data[1].values;
    localStorage.setItem("stock", JSON.stringify(this));
  };
}

// const tsla = new StockChart("AAPL");

// tsla.getHistory();
// console.log(tsla);
