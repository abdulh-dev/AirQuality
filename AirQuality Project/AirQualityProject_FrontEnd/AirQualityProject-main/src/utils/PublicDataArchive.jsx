import { useEffect, useState } from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import rawData_2020 from "../sources/year_2020.json"; 
import rawData_2021 from "../sources/year_2021.json"; 
import rawData_2022 from "../sources/year_2022.json"; 


function APILineChart() {
  //final chart data
  const [repos, setRepos] = useState([]);
  //default year
  const [selectedYear, setSelectedYear] = useState("2020"); 
  //default to january
  const [selectedMonth, setSelectedMonth] = useState("1");  

  //function to process and filter JSON data
  const fetchData = () => {
    //hold values grouped by date
    const grouped = {};
    //convert month to number
    const targetMonth = parseInt(selectedMonth, 10);

    //choose which year file to use
    let rawData;
    if (selectedYear === "2020") {
      rawData = rawData_2020;
    } else if (selectedYear === "2021") {
      rawData = rawData_2021;
    } else if (selectedYear === "2022") {
      rawData = rawData_2022;
    } else {
      rawData = [];
    }
  
    //loop through each row of the data
    rawData.forEach(item => {
      // parse date as UTC
      const dateStr = item.ObservationTimeUTC.replace(" ", "T") + "Z";
      const dateObj = new Date(dateStr);
      const value = parseFloat(item.Value);

      //skip if it's not in the chosen month, unless selectedMonth = "all"
      if (selectedMonth !== "all") {
        if (dateObj.getMonth() + 1 !== targetMonth) {
          return; 
        }
      }

      //if the value is valid number
      if (!isNaN(value)) {
          //get just the date part 
          //from the ISO string
        const fullDate = dateObj.toISOString().split("T")[0];
        
        //if this date isn't in the group yet, add it
        if (!grouped[fullDate]) {
          grouped[fullDate] = [];
        }

        //add the current value to the list for that date
        grouped[fullDate].push(value);
      }
    });
  
    //Turn the grouped data into an array of objects
    const averaged = Object.entries(grouped).map(([date, values]) => {
      //add all values for day
      const sum = values.reduce((acc, val) => acc + val, 0);

      //divide by # of values to get avg
      const avg = sum / values.length;

      //return the date and avg, round to 2 decimal places
      return { date, value: parseFloat(avg.toFixed(2)) };
    });
    //save the final chart data into state
    setRepos(averaged);
  }; 
  
  //run fetchData again whenever year or month changes
  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);


  return (
    <div>
      <h3>Average PM 2.5 Values</h3>

      {/* Select Year */}
      <div style={{ marginBottom: "10px" }}>
        <label>Year: </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
        </select>
      </div>

      {/* Select Month */}
      <div style={{ marginBottom: "20px" }}>
        <label>Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="all">All</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      
      {/* Recharts stuff */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={repos}>
          <Line type="monotone" dataKey="value" stroke="#1976d2" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
  </div>

  );
}

export default APILineChart;
