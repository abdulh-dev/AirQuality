import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
// import "../styles/Dashboard.css";

// Supabase credentials
const supabaseUrl = "https://uyppqibfrwteczkrtybk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cHBxaWJmcnd0ZWN6a3J0eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzk3MzgsImV4cCI6MjA1NTkxNTczOH0.239lhxFNWEEDxDQ2w9k2n4elSlC-ZiLr0kWTjd0gGW4";
const supabase = createClient(supabaseUrl, supabaseKey);


//Function that pulls data from real time database table
//Pulls the whole table, will update later
async function fetchData() {
  const { data, error } = await supabase
    .from("airqualitydata")
    .select("timestamp, pm2_5, pm10")
    .order("timestamp", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching air quality data:", error);
    return [];
  }

  return data;
}

// Function to format ISO timestamp
function tickFormatter(iso) {
  //2025‑02‑13T20:48:02
  const dateObj = new Date(iso);

  // let the browser format it as HH:MM:SS
  return dateObj.toLocaleTimeString();
}
function Averages() {
  //Will hold the min and max values 
  // with their timestamps
  const [averages, setAverages] = useState({
    minPM25: { value: 0, timestamp: "" },
    maxPM25: { value: 0, timestamp: "" },
    minPM10: { value: 0, timestamp: "" },
    maxPM10: { value: 0, timestamp: "" }
  });

  useEffect(() => {
    //fetch and calculate the min/max values
    const load = async () => {
      try {
        const data = await fetchData();
        //make sure there's data before doing anything
        if (data.length > 0) {
          //find row with lowest | highest pm 2.5 val
          const minPM25 = data.reduce((min, curr) => curr.pm2_5 < min.pm2_5 ? curr : min, data[0]);
          const maxPM25 = data.reduce((max, curr) => curr.pm2_5 > max.pm2_5 ? curr : max, data[0]);
          //find row with lowest | highest pm 10 val
          const minPM10 = data.reduce((min, curr) => curr.pm10 < min.pm10 ? curr : min, data[0]);
          const maxPM10 = data.reduce((max, curr) => curr.pm10 > max.pm10 ? curr : max, data[0]);

          //update state with the results, rounded to 2 decimals
          setAverages({
            minPM25: { value: minPM25.pm2_5.toFixed(2), timestamp: minPM25.timestamp },
            maxPM25: { value: maxPM25.pm2_5.toFixed(2), timestamp: maxPM25.timestamp },
            minPM10: { value: minPM10.pm10.toFixed(2), timestamp: minPM10.timestamp },
            maxPM10: { value: maxPM10.pm10.toFixed(2), timestamp: maxPM10.timestamp }
          });
        }
      }catch (e){
        //Show error if fetch fails
        console.error(e);
      }
      
    };
    //run once when page first loads
    load();
    
    // poll every 10 s
    const id = setInterval(load, 10_000);
    //cleanup, stop the interval if component unmounts
    return () => clearInterval(id);
  }, []);

  return (
    // container for all the summary cards
    <div className="green">
      <div className="pink">
        <h3>Minimum PM 2.5</h3>
        <strong>{averages.minPM25.value}</strong> <span className="aqi-date">on {tickFormatter(averages.minPM25.timestamp)}</span>
      </div>

      <div className="pink">
        <h3>Maximum PM 2.5</h3>
        <strong>{averages.maxPM25.value}</strong> <span className="aqi-date">on {tickFormatter(averages.maxPM25.timestamp)}</span>
      </div>

      <div className="pink">
        <h3>Minimum PM 10</h3>
        <strong>{averages.minPM10.value}</strong> <span className="aqi-date">on {tickFormatter(averages.minPM10.timestamp)}</span>
      </div>

      <div className="pink">
        <h3>Maximum PM 10</h3>
        <strong>{averages.maxPM10.value}</strong> <span className="aqi-date">on {tickFormatter(averages.maxPM10.timestamp)}</span>
      </div>
    </div>
  );
}

export default Averages;
