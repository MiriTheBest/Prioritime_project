import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AuthorizationPage from "./AuthorizationPage";
import DayPage from "./DayPage";
import MonthPage from "./MonthPage";
import AddPage from "./AddPage";
import ButtonAppBar from "./design/ButtonAppBar";
import AddEventPage from "./AddEventPage";
import TaskPage from "./TaskPage";
import Footer from "./design/Footer";
import FAQPage from "./FAQPage";
import SignInSide from "./LoginPage";
import SignUp from "./SignUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User authentication state
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for DayPage

  useEffect(() => {
    // Check for existing authentication (e.g., local storage, cookies)
    const storedAuth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(storedAuth === 'true');
  }, []);  // Run only on initial render

  const handleAuthorization = (success) => {
    setIsAuthenticated(success);
    if (success) {
      // Store authentication state (e.g., local storage)
      localStorage.setItem("isAuthenticated", "true");
    } else {
      // Handle failed authorization
      localStorage.removeItem("isAuthenticated");
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <Router>
      <ButtonAppBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <>
                <DayPage selectedDate={new Date()} />
              </>
            ) : (
              <>
                <SignInSide onAuthorization={handleAuthorization} />
              </>
            )
          }
        />
        <Route path="/day" element={<DayPage />} />
        <Route path="/month" element={<MonthPage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/add_event" element={<AddEventPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/signup" element={<SignUp onAuthorization={handleAuthorization} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
