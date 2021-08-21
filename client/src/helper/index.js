import axios from "axios";
//import WebSocket from "ws";

export const timeIntervals = () => {
  const now = new Date();
  const xYearAgo = (x) =>
    new Date(now.setFullYear(new Date().getFullYear() - x));
  const xMonthAgo = (x) => new Date(now.setMonth(new Date().getMonth() - x));
  const xDayAgo = (x) => new Date(now.setDate(new Date().getDate() - x));

  return {
    oneD: xDayAgo(1),
    oneW: xDayAgo(7),
    oneM: xMonthAgo(1),
    threeM: xMonthAgo(3),
    sixM: xMonthAgo(6),
    oneY: xYearAgo(1),
    twoY: xYearAgo(2),
    fiveY: xYearAgo(5),
    tenY: xYearAgo(10),
  };
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

// const tsla = new StockChart("TSLA");

// tsla.getHistory();
// console.log(tsla);
