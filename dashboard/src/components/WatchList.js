import React,{useContext, useState, useEffect} from "react";
import {Tooltip, Grow} from "@mui/material";

import {BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz} from "@mui/icons-material"
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnutChart";
import axios from "axios";

const WatchList = () => {

    const [watchlist, setWatchlist] = useState([]); // State to store fetched data
  
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: "https://indian-stock-exchange-api2.p.rapidapi.com/NSE_most_active",
        headers: {
          "x-rapidapi-host": "indian-stock-exchange-api2.p.rapidapi.com",
          "x-rapidapi-key": "23a5285cf5msh63244f2ed898c19p1da3c9jsn641d6b7684ff",
        },
      };
  
      try {
        const response = await axios.request(options);
        setWatchlist(response.data); // Update state with new data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      fetchData(); 
      const intervalId = setInterval(() => {
        fetchData();
      }, 6000); 
      return () => clearInterval(intervalId);
    }, []);
  
  const data = {
    labels: watchlist.map(stock => stock.ticker),
    datasets: [
      {
        label: 'Price',
        data: watchlist.map(stock => stock.price),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 110, 110, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {
          watchlist.map((stock,idx)=>{
            return(
              <WatchListItem stock={stock}/>
            );
          })
        }
      </ul>
      <DoughnutChart data = {data}/>
    </div>
  );
};

export default WatchList;

const WatchListItem =({stock})=>{
  const [showWatchListActions,setShowWatchListActions] = useState(false);
  const handleMouseEnter = (e)=>{
    setShowWatchListActions(true);
  }
  const handleMouseLeave = (e)=>{
    setShowWatchListActions(false);
  }
  return(
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.ticker}</p>
        <div className="item-info">
          <span className="percent">{stock.percent_change + "%"}</span>
          {stock.percent_change<0 ? (<KeyboardArrowDown className="down"/>):(<KeyboardArrowUp className="up"/>)}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchListActions && <WatchListActions uid={stock.ticker} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  return (
    <div className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="buy" onClick={handleBuyClick}>Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="sell">Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </div>
  );
};
