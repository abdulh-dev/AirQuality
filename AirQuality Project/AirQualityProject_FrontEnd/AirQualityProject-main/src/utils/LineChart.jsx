import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine  } from 'recharts';
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";



//credentials
const supabaseUrl = "https://uyppqibfrwteczkrtybk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cHBxaWJmcnd0ZWN6a3J0eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzk3MzgsImV4cCI6MjA1NTkxNTczOH0.239lhxFNWEEDxDQ2w9k2n4elSlC-ZiLr0kWTjd0gGW4"
const supabase = createClient(supabaseUrl, supabaseKey)

//Function that pulls data from real time database table
//Pulls the whole table, will update later
async function fetch_RealTime_AirQualityData() {
  const { data, error } = await supabase
    .from('airqualitydata')
    .select('*')
    // newest first
    .order("timestamp", { ascending: false })
    //grab only 500 rows  
    .limit(100);                               
  if (error) {
    console.error('Error fetching air quality data:', error)
    return null;
  }

  //Fixes bug with chart not showing values properly.
  return data.reverse()
}

function CustomLineChart() {

  //State to store the data we get from Supabase
  const [rows, setRows] = useState([]);


  //TEST
  const [warningThreshold, setWarningThreshold] = useState(4);


  //Run this when component loads
  useEffect(() => {

    //fetches data from Supabase
      const load = async () => {
        try {
          //latest readings
          const data = await fetch_RealTime_AirQualityData();
          
          // console.log("Supabase rows:", data);

          //Save to state   
          setRows(data);
        } catch (e) {
          //Show error if fetch fails
          console.error(e);
        }
      };
      //run once when page first loads
      load();
      // poll every 10 s
      const id = setInterval(load, 10000);   
      //cleanup, stop the interval if component unmounts
      return () => clearInterval(id);
    }, []);


    // convert ISO string to Date
  function tickFormatter(iso) {
    //2025‑02‑13T20:48:02
    const dateObj = new Date(iso);
  
    // let the browser format it as HH:MM:SS
    return dateObj.toLocaleTimeString();
  }
  
  return (
    <div>
      {/* Recharts info */}
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={rows} >
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="timestamp" tickFormatter={tickFormatter} />
          <YAxis />
          <Tooltip labelFormatter={tickFormatter} formatter={(value, name) => [value.toFixed(4), name]}/>
          <Legend />
          <ReferenceLine y={warningThreshold} label="Warning" stroke="red" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="pm2_5" name="PM 2.5" stroke="#8884d8" dot={false} />
          <Line type="monotone" dataKey="pm10"  name="PM 10"  stroke="#2e7d32" dot={false} />
        </LineChart>
      </ResponsiveContainer>

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

export default CustomLineChart;
