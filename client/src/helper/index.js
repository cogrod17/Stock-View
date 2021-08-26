import axios from "axios";
import { twelveDataKey } from "../topSecret";
import { bisector } from "d3";

const bisect = bisector((d) => d.datetime).left;

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
    this.isValid = true;
    this.apiLimit = false;
    this.symbol = symbol;
    this.api_key = twelveDataKey;
    this.quote = [];
    this.timeSeries = {
      "1d": [],
      "1w": [],
      "1m": [],
      All: [],
    };
  }

  getShortHistory = async () => {
    const { data } = await axios.post(
      `https://api.twelvedata.com/complex_data?apikey=${this.api_key}`,
      {
        symbols: [this.symbol],
        intervals: [`5min`],
        start_date: timeIntervals["1m"],
        end_date: new Date(),
        methods: ["time_series"],
        timezone: "America/New_York",
      }
    );

    if (data.code === 429) {
      this.apiLimit = true;
      return;
    }

    if (data.data[0].code === 400) {
      this.isValid = false;
      return;
    }

    const { values } = data.data[0];

    const final = values
      .map((d) => {
        return { ...d, datetime: new Date(d.datetime) };
      })
      .sort((a, b) => a.datetime - b.datetime);

    this.timeSeries["1m"] = final;
    this.timeSeries["1w"] = final.slice(bisect(final, timeIntervals["1w"]));
    this.timeSeries["1d"] = final.slice(final.length - 72, final.length);
  };

  getLongHistory = async () => {
    const { data } = await axios.post(
      `https://api.twelvedata.com/complex_data?apikey=${this.api_key}`,
      {
        symbols: [this.symbol],
        intervals: [`1day`],
        end_date: new Date(),
        methods: ["quote", "time_series", "price"],
        timezone: "America/New_York",
      }
    );

    if (data.code === 429) {
      this.apiLimit = true;
      return;
    }

    if (data.data && data.data[0].code === 400) {
      this.isValid = false;
      return;
    }

    const final = data.data[1].values
      .map((d) => {
        return { ...d, datetime: new Date(d.datetime) };
      })
      .sort((a, b) => a.datetime - b.datetime);

    this.price = data.data[2].price;
    this.quote = data.data[0];
    this.timeSeries["All"] = final;
  };
}
