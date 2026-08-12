import { useEffect, useState } from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,ResponsiveContainer, ReferenceLine, Legend} from "recharts";
import { createClient } from "@supabase/supabase-js";

//credentials
const supabaseUrl = "https://uyppqibfrwteczkrtybk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cHBxaWJmcnd0ZWN6a3J0eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzk3MzgsImV4cCI6MjA1NTkxNTczOH0.239lhxFNWEEDxDQ2w9k2n4elSlC-ZiLr0kWTjd0gGW4"
const supabase = createClient(supabaseUrl, supabaseKey)

function ArchivedLineChart() {
  //State to store the data we get from Supabase
  const [rows, setRows] = useState([]);
  //Warning line value
  const [warningThreshold, setWarningThreshold] = useState(4);
  //default year
  const [selectedYear, setSelectedYear] = useState("2025");
  //default to all
  const [selectedMonth, setSelectedMonth] = useState("all");

  // convert ISO string to Date
  function tickFormatter(iso) {
    //2025‑02‑13T20:48:02
    const dateObj = new Date(iso);
  
    // let the browser format it as HH:MM:SS
    return dateObj.toLocaleTimeString();
  }

  //Function that pulls data from real time database table
  //Pulls the whole table, will update later
  const fetchFilteredData = async () => {
    const { data, error } = await supabase
      .from("airqualitydata")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error('Error fetching air quality data:', error)
      return null;
    }

    //Fixes bug with chart not showing values properly.
    data.reverse()

    // apply filters
    const filtered = data.filter((entry) => {
      //parse timestamp to Date
      const date = new Date(entry.timestamp);
      //extract year as string
      const year = date.getFullYear().toString();
      //1-based
      const month = (date.getMonth() + 1).toString(); 

      // check if year and month match filters
      const matchYear = selectedYear === "all" || year === selectedYear;
      const matchMonth = selectedMonth === "all" || month === selectedMonth;

      return matchYear && matchMonth;
    });

    setRows(filtered);
  };

  //run fetchFilteredData again whenever year or month changes
  useEffect(() => {
    fetchFilteredData();
  }, [selectedYear, selectedMonth]);

  return (
  <div  style={{padding: '20px', textAlign: "center"}}>
    <h3>Archive of Public Sensor Data</h3>

    {/* Select Year */}
    <div style={{ marginBottom: "10px" }}>
      <label>Year: </label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="all">All</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
    </div>

    {/* Select Month */}
    <div style={{ marginBottom: "20px" }}>
      <label>Month: </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
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

    {/* Chart */}
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={rows}>
        <Line type="monotone" dataKey="pm2_5" name="PM 2.5" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="pm10" name="PM 10" stroke="#2e7d32" dot={false} />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="timestamp" tickFormatter={tickFormatter} />
        <YAxis />
        <Tooltip labelFormatter={tickFormatter} formatter={(v, n) => [v.toFixed(2), n]} />
        <Legend />
        <ReferenceLine y={warningThreshold} label="Warning" stroke="red" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>

    {/* Threshold Control */}
    {/* Copied from linechart.jsx */}
    <div style={{ marginTop: "10px", textAlign: "center" }}>
        <label>Set Warning Threshold: </label>
        <input
          type="number"
          value={warningThreshold}
          onChange={(e) => setWarningThreshold(parseFloat(e.target.value))}
          step="0.1"
          style={{ width: "60px", textAlign: "center" }}
        />
      </div>
  </div>
);
}

export default ArchivedLineChart;
