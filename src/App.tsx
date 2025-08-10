import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import AppLayout from "@/components/AppLayout";

// intially thought of using the single component and use conditional render but felt like spillting coede into seperated files
// one UX idea popped in mind was we can show the zipcodesearch box once the user fills something and click search we jus show some animation which box turned as small header area and render the search results on same page

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
