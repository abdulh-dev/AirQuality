import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";



//credentials
const supabaseUrl = "https://uyppqibfrwteczkrtybk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cHBxaWJmcnd0ZWN6a3J0eWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzk3MzgsImV4cCI6MjA1NTkxNTczOH0.239lhxFNWEEDxDQ2w9k2n4elSlC-ZiLr0kWTjd0gGW4"
const supabase = createClient(supabaseUrl, supabaseKey)

//Limit because formatting is weird with less and more than 8.
//No time to fix, sad!
const limit = 8;

//Function that pulls data from real time database table
//Pulls the whole table, will update later
async function fetch_RealTime_AirQualityData() {
    const { data, error } = await supabase
      .from('airqualitydata')
      .select('*')
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching air quality data:', error)
      return null
    }
  
    return data
}


function TableChart() {

  //State to store the table rows
    const [rows, setRows] = useState([]);

    //Run this when component loads
    useEffect(() => {

        // fetch data on first load and every 10s
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
        const id = setInterval(load, 10_000);
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
      //basic table with headings for 
      // timestamp. PM 2.5 and
      //PM 10
      <table className="air-quality-table">
        
        {/* Table header row */}
        <thead>
          <tr>
            <th>Date / Time</th>
            <th>PM2.5</th>
            <th>PM10</th>
          </tr>
        </thead>

        {/* table body, loop through 
        each data row and show values */}
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {/* format timestamp to HH:MM:SS */}
              <td>{tickFormatter(r.timestamp)}</td>

              {/* Round the values to 4 decimal places
              MIGHT CHANGE */}
              <td>{r.pm2_5.toFixed(4)}</td>
              <td>{r.pm10.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      );
}

export default TableChart;