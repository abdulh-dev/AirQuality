import "./History.css";
//import CustomLineChart from "../utils/LineChart";
import Button from '@mui/material/Button';
import PublicDataArchive from "../utils/PublicDataArchive";
import PrivateSensorArchive from "../utils/PrivateSensorArchive";
import { useState } from "react";

function History() {
  
  // toggle between PublicDataArchive and PrivateSensorArchive
  const [usePrivate, setUsePrivate] = useState(false); 
  
  let chartToShow;
  if (usePrivate) {
    chartToShow = <PrivateSensorArchive style={{ display: "flex" }} />;
  } else {
    chartToShow = <PublicDataArchive style={{ display: "flex" }} />;
  }

  return (
    //Main container, centers text (could remove?)
    //Comments after this break, no clue why
    <div className="text-center" style={{ marginTop: "10px", textAlign: "center" }}>
      
      {/* Heading and description */}
      <h2 className="text-2xl font-bold">Archive</h2>
      <p>Take a look at past readings.</p>

        {/* Placeholder for now, will make it 
        so it swaps out the element when clicked */}
      <Button onClick={() => setUsePrivate(true)}>Click hero to switch to private sensor</Button>
      <Button onClick={() => setUsePrivate(false)}>Click hero to switch to public data</Button>


      {/* Chart showing past Air Quality data */}
      <div className="chart">
        {/* Actual */}
          {chartToShow}
        </div>
    </div>
  );
}

export default History;
