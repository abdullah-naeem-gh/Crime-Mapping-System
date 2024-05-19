import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Crimes from "./scenes/crimes";
import Victims from "./scenes/victims";
import Criminals from "./scenes/criminals";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import Calendar from "./scenes/calendar/calendar";
import Login from "./Login";
import { useAuth } from "./context/AuthContext";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { user } = useAuth(); // Use the useAuth hook to get the user

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {user && <Sidebar isSidebar={isSidebar} userType={user.UserType} />}
          <main className="content">
            {user && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              {user?.UserType === "Official" && (
                <>
                  <Route path="/crimes" element={<Crimes />} />
                  <Route path="/criminals" element={<Criminals />} />
                  <Route path="/victims" element={<Victims />} />
                  {/* <Route path="/bar" element={<Bar />} /> */}
                  {/* <Route path="/line" element={<Line />} /> */}
                  {/* <Route path="/pie" element={<Pie />} /> */}
                  {/* <Route path="/faq" element={<FAQ />} /> */}
                  <Route path="/geography" element={<Geography />} />
                  {/* <Route path="/calendar" element={<Calendar />} /> */}
                  {/* <Route path="/form" element={<Form />} /> */}
                </>
              )}
              {user?.UserType === "Public" && (
                <>
                  <Route path="/public" element={<Dashboard />} />
                  <Route path="/crimes" element={<Crimes />} />
                  <Route path="/geography" element={<Geography />} />


                  {/* Add other routes for public users if necessary */}
                </>
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
