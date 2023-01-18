import { useEffect, useState, useCallback, useContext } from "react";
import {
  connection,
  api,
  active_symbols_request,
  ticks_request,
} from "../../api/api";
import Select from "../ui/select";
import Preloader from "../ui/preloader";
import MainSummary from "./main-summary";
import Btn from "../ui/btn";
import UserContext from "../../store/user-context";
import classes from "./main.module.css";

// TODO:
// 1) Add custom input type range
// 2) Add icon

const Main = () => {
  const [availibleMarkets, setAvailibleMarkets] = useState([]);
  const [availibleSymbols, setAvailibleSymbols] = useState([]);
  const [availibleTradeTypes, setavailibleTradeTypes] = useState([]);
  const [allTradeTypes, setAllTradeTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [choosenSymbol, setChoosenSymbol] = useState(null);
  const [serverResponse, setServerResponse] = useState([]);
  const [btnNamesArray, setBtnNamesArray] = useState([]);
  const [tick, setTick] = useState(null);
  const [tickColor, setTickColor] = useState("#047553");

  const ctx = useContext(UserContext);

  const activeResponse = useCallback(async (res) => {
    setIsLoading(true);

    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      setError(true);
      console.log("Error : ", data.error?.message);
      //connection.removeEventListener("message", activeResponse, false);
      setIsLoading(false);
      return;
      //await api.disconnect();
    }

    if (data.msg_type === "active_symbols") {
      setServerResponse(data.active_symbols);
      setAvailibleMarkets([
        ...new Set(data.active_symbols.map((item) => item.market_display_name)),
      ]);
    }

    if (data.msg_type === "tick") {
      setTick((prev) => {
        if (prev > data.tick.bid) {
          setTickColor("#8a2b06");
        } else {
          setTickColor("#047553");
        }
        return data.tick.bid;
      });
    }

    if (data.msg_type === "contracts_for") {
      setAllTradeTypes(data.contracts_for.available);
      setavailibleTradeTypes([
        ...new Set(
          data.contracts_for.available.map(
            (item) => item.contract_category_display
          )
        ),
      ]);
    }

    setError(false);
    setIsLoading(false);
  }, []);

  const selectMarketHandler = (e) => {
    setChoosenSymbol(null);
    setTick(null);

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
    setTick(null);
    setChoosenSymbol(null);

    if (e.target.value === "Select trade symbol") {
      return;
    }
    setChoosenSymbol(
      serverResponse.find((item) => item.display_name === e.target.value).symbol
    );
  };

  const selectTradeTypeHandler = (e) => {
    if (e.target.value === "Select trade symbol") {
      return;
    }

    setBtnNamesArray([
      ...new Set(
        allTradeTypes
          .filter((item) => item.contract_category_display === e.target.value)
          .map((item) => item.contract_display)
      ),
    ]);
  };

  useEffect(() => {
    api.send({
      forget_all: "ticks",
    });

    if (choosenSymbol === null) {
      return;
    }

    ticks_request.ticks_history = choosenSymbol;

    api.subscribe(ticks_request);

    if (ctx.isAuthorized) {
      const contracts_for_symbol_request = {
        contracts_for: choosenSymbol,
        currency: ctx?.userData?.authorize?.currency
          ? ctx?.userData?.authorize?.currency
          : "USD",
        landing_company: "svg",
        product_type: "basic",
      };

      api.send(contracts_for_symbol_request);
    }
  }, [choosenSymbol, ctx]);

  useEffect(() => {
    setIsLoading(true);

    const getActiveSymbols = async () => {
      connection.addEventListener("message", activeResponse);
      await api.send(active_symbols_request);
    };

    getActiveSymbols();

    return () => {
      connection.removeEventListener("message", activeResponse, false);
    };
  }, [activeResponse]);

  let message = null;
  if (tick) {
    message = (
      <div className={classes["tick-container"]}>
        <div className={classes.tick} style={{ color: tickColor }}>
          {tick}
        </div>
        {ctx.isAuthorized && (
          <div className={classes["trade-interface"]}>
            <Select
              cbSelectMarketHandler={selectTradeTypeHandler}
              defaultOption={"Select Trade type"}
              availibleOptions={availibleTradeTypes}
            />
            <input type="range"></input>
            <Btn
              btnName={btnNamesArray[0] ? btnNamesArray[0] : "Up"}
              isGreen={true}
            />
            <Btn btnName={btnNamesArray[1] ? btnNamesArray[1] : "Down"} />
          </div>
        )}
      </div>
    );
  }
  if (isLoading) {
    message = <Preloader />;
  }
  if (error) {
    message = <h2 className={classes.warning}>Oops...Something went wrong!</h2>;
  }

  return (
    <main className="main">
      <MainSummary />
      <section>
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
      </section>
      <section>{message}</section>
    </main>
  );
};
export default Main;
