import { Box } from "@mui/material";
// import { tokens } from "../../theme";
// import { mockTransactions } from "../../data/mockData";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
// import LineChart from "../../components/LineChart"
// import GeographyChart from "../../components/GeographyChart";
// import BarChart from "../../components/BarChart";
// import StatBox from "../../components/StatBox";
// import ProgressCircle from "../../components/ProgressCircle";

const Dashboard = () => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  return (
    <Box mt={0} ml={3} pb={5}>  
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Crime Analysis Dashboard" subtitle="Crime Statistics of Islamabad City" />
      </Box>
    
        <Box >
        <tableau-viz id='tableau-viz' src='https://prod-apnortheast-a.online.tableau.com/t/anaeembscs23seecs262cc2e63c/views/FinalTableau/Sheet10' width='900' height='485' hide-tabs toolbar='bottom' ></tableau-viz>
        </Box>
    </Box>
  );
};

export default Dashboard;
