import React, { useEffect, useState } from "react";
import Select from "../select";
import "./main.css";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

// TODO:
// 1) Remove API stuff from Component
// 2) Replace key values
// 3) Add style
// 4) Disconnect when ComponentWillUnmount
// 5) TS
// 6) Preloader

const app_id = 1089;
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const active_symbols_request = {
  active_symbols: "brief",
  product_type: "basic",
};

const ticks_request = {
  ticks_history: null,
  adjust_start_time: 1,
  count: 10,
  end: "latest",
  start: 1,
  style: "ticks",
  subscribe: 1,
};

const Main = () => {
  const [availibleMarkets, setAvailibleMarkets] = useState([]);
  const [availibleSymbols, setAvailibleSymbols] = useState([]);
  const [choosenSymbol, setChoosenSymbol] = useState(null);
  const [serverResponse, setServerResponse] = useState([]);
  const [tick, setTick] = useState(null);
  const [prevChoosenSymbol, setPrevChoosenSymbol] = useState(null);
  const [tickColor, setTickColor] = useState("green");

  const activeResponse = async (res) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error : ", data.error?.message);
      connection.removeEventListener("message", activeResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === "active_symbols") {
      console.log(data.active_symbols);
      setServerResponse(data.active_symbols);
      setAvailibleMarkets([
        ...new Set(data.active_symbols.map((item) => item.market_display_name)),
      ]);
    }

    if (data.msg_type === "tick") {
      console.log(data);
      console.log(data.tick.bid);
      setTick(data.tick.bid);
    }
  };

  const selectMarketHandler = (e) => {
    if (e.target.value === "Select Market") {
      return;
    }

    setAvailibleSymbols(
      serverResponse
        .filter((item) => item.market_display_name === e.target.value)
        .map((item) => item.display_name)
    );
  };

  const selectSymbolHandler = (e) => {
    if (e.target.value === "Select trade symbol") {
      return;
    }

    setChoosenSymbol((prev) => {
      setPrevChoosenSymbol(prev);
      return serverResponse.find((item) => item.display_name === e.target.value)
        .symbol;
    });
  };

  const tickSubscriber = () => api.subscribe(ticks_request);

  const unsubscribeTicks = async () => {
    console.log("rttr 0", tickSubscriber());
    connection.removeEventListener("message", activeResponse, false);
    console.log("rttr", await tickSubscriber());
    tickSubscriber().unsubscribe();
    console.log("ok");
  };

  useEffect(() => {
    if (choosenSymbol === null) {
      return;
    }

    if (prevChoosenSymbol !== null) {
      // const unsubscribeTicks = async () => {
      //   connection.removeEventListener("message", activeResponse, false);
      //   await tickSubscriber().unsubscribe();
      //   console.log("ok");
      // };

      // unsubscribeTicks();
      api.send({
        forget_all: "ticks",
      });
    }

    ticks_request.ticks_history = choosenSymbol;

    const subscribeTicks = async () => {
      //connection.addEventListener("message", activeResponse);
      tickSubscriber();
    };

    subscribeTicks();
    // return () => {
    //   tickSubscriber().unsubscribe();
    // };
  }, [choosenSymbol]);

  useEffect(() => {
    const getActiveSymbols = async () => {
      connection.addEventListener("message", activeResponse);
      await api.send(active_symbols_request);
    };
    getActiveSymbols();

    return () => {
      connection.removeEventListener("message", activeResponse, false);
    };
  }, []);

  return (
    <div className="main">
      <Select
        cbSelectMarketHandler={selectMarketHandler}
        defaultOption={"Select Market"}
        availibleOptions={availibleMarkets}
      />

      <Select
        cbSelectMarketHandler={selectSymbolHandler}
        defaultOption={"Select trade symbol"}
        availibleOptions={availibleSymbols}
      />
      <div className="tick" style={{ color: tickColor }}>
        {tick}
      </div>
      <button onClick={unsubscribeTicks}>Unsubscribe</button>
    </div>
  );
};
export default Main;
