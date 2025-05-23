import { useUser } from "./contexts/user-context";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutBook from "./pages/AboutBook";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SearchResults from "./pages/SearchResults";
import Loading from "./components/Loading";
import { BookCoversProvider } from "./contexts/covers-context";
import { MyBooksProvider } from "./contexts/my-books-context";

function App() {
  const { user, checking } = useUser();

  if (checking) return <Loading />; // or a loading spinner

  return (
    <Router>
      {user ? (
        <div className="flex flex-col min-h-screen">
          <BookCoversProvider>
            <MyBooksProvider>
            <Header />
            <main className="p-4 overflow-auto flex-grow h-[90vh]">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:id" element={<AboutBook />} />
                <Route path="/profile/*" element={<Profile />} /> 
                <Route path="/results" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
            <Footer />
            </MyBooksProvider>
          </BookCoversProvider>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
