import "./Dashboard.css";
import CustomLineChart from "../utils/LineChart";
import TableChart from "../utils/TableChart";   
import Averages from "../utils/Averages";

function Dashboard() {
  

  return (
    //BLACK
    //Main wrapper for dashboard
    //Comments are in parentheses from here on out because
    //anything below this just doesnt accept //
    // ¯\_(ツ)_/¯
    <div className="dashboard"> 
    {/* RED */}
      <div className="layout">
      {/* BLUE */}
      <h2 >Live Air Quality Data</h2>
      {/* //ORANGE */}
      <div className="orange">
        {/* //PURPLE */}
        <div className="purple chart-container">

          {/* Line chart showing live PM2.5 and PM10 data */}
          <CustomLineChart style={{display: "flex",flexShrink: 1, }} />

        </div>
        
        {/* Table showing recent air quality readings */}
        <div className="purple table-container">

          <h3>Current Air Quality Data</h3>
          <TableChart />

        </div>

      </div>

      {/* Boxes for min/max PM values */}
      <Averages />

        </div> 
    </div>
  );
}

export default Dashboard;
