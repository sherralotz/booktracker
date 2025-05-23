import React, { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/user-context";
import { db } from "../config/firebase-config";
import { collection, query, onSnapshot } from "firebase/firestore";
import BookCardGrid from "../components/BookCardGrid";
import Loading from "../components/Loading";
import { useMyBooks } from "../contexts/my-books-context";

const MAX_DISPLAY = 6;
const Profile = () => {
  const { user } = useUser();
  const { books, setBooks } = useMyBooks();

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("profile"); //'profile/history/liked

  useEffect(() => {
    // Grab route after /profile/
    const viewFromUrl = location.pathname.split("/profile/")[1];
    if (viewFromUrl) {
      setCurrentView(viewFromUrl);
    } else {
      setCurrentView("profile");
    }
  }, [location]);

  const onClickNavigateView = (view) => {
    navigate(`${view === "profile" ? "/profile" : `/profile/${view}`}`);
  };

  const handleSignOut = () => {
    // Renamed for clarity
    auth
      .signOut()
      .then(() => {
        // Handle the promise from auth.signOut()
        navigate("/");
      })
      .catch((error) => {
        // Handle any errors during sign-out
        console.error("Sign out error:", error);
      });
  };

  useEffect(() => {
    if (user?.uid) {
      const booksRef = collection(db, "users", user.uid, "books");
      const q = query(booksRef); // Initial sort by readDate for efficiency

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          // const fetchedBooks = [];
          const allBooks = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // snapshot.forEach((doc) => {
          //   fetchedBooks.push(doc.data());
          // });
          setBooks(allBooks);
          // setAllBooks(fetchedBooks);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching all books:", err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user, setBooks]);
  const getMillis = (date) => {
    if (!date) return 0;
    if (typeof date.toMillis === "function") return date.toMillis();

    // JS Date
    if (date instanceof Date) return date.getTime();
    // ISO String
    const parsed = Date.parse(date);
    return isNaN(parsed) ? 0 : parsed;
  };

  const readBooks = books
  .filter((book) => book.userBookData?.readEnd || book.userBookData?.readStart)  
  .sort(
    (a, b) => {
      const aDate = a.userBookData?.readEnd || a.userBookData?.readStart; 
      const bDate = b.userBookData?.readEnd || b.userBookData?.readStart;
      return getMillis(bDate) - getMillis(aDate);
    }
  );

  const likedBooks = books
    .filter((book) => book.userBookData?.liked)
    .sort(
      (a, b) =>
        getMillis(b.userBookData?.modifiedDate) - getMillis(a.userBookData?.modifiedDate)
    );
 
  if (loading) {
    return <Loading message="Fetching your books..." />;
  }

  if (error) {
    return <div>Error fetching books. Please try again later.</div>;
  }
  return (
    <div className="max-w-screen-xl mx-auto px-1 sm:px-6 lg:px-8">
      {currentView === "history" || currentView === "liked" ? (
        <div>
          <button onClick={() => onClickNavigateView("profile")}>Back</button>
        </div>
      ) : (
        ""
      )}

      {currentView === "profile" ? (
        <>
          <div className="flex items-center justify-end mb-2">
            <div className="relative">
              <img
                src={
                  user.photoURL
                    ? user.photoURL
                    : `https://dummyimage.com/40x40/d2d3d9/d2d3d9`
                }
                alt={`${user.displayName}'s Profile`}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full mr-4"
              />
              {user.photoURL ? (
                ""
              ) : (
                <span className="absolute top-1/5 left-1/4">G</span>
              )}
            </div>
            <h2>{user.displayName}</h2>
            <div className="ml-auto">
              <button onClick={handleSignOut}>Sign out</button>
            </div>
          </div>

          <div className="flex">
            <h2>History</h2>
            {readBooks.length > 0 ? 
            <a
              className="cursor-pointer ml-auto"
              onClick={() => onClickNavigateView("history")}
            >
              See All
            </a>
            : ''}
          </div>
          <hr></hr>
          <div className="mt-4 mb-4">
            {readBooks.length > 0 ? (
              <BookCardGrid
                books={readBooks.slice(0, MAX_DISPLAY)}
                label="read"
              />
            ) : (
              <p>No books marked as read yet.</p>
            )}
          </div>
          <div className="flex">
            <h2>Liked</h2>
            
            {likedBooks.length > 0 ? 
            <a
              className="cursor-pointer ml-auto"
              onClick={() => onClickNavigateView("liked")}
            >
              See All
            </a>
            : ''}
          </div>
          <hr></hr>
          <div className="mt-4">
            {likedBooks.length > 0 ? (
              <BookCardGrid
                books={likedBooks.slice(0, MAX_DISPLAY)}
                label="liked"
              />
            ) : (
              <p>No books marked as liked yet.</p>
            )}
          </div>
        </>
      ) : (
        ""
      )}

      {currentView === "history" ? (
        <> 
          {readBooks.length > 0 ? (
            <BookCardGrid books={readBooks} label="allRead" />
          ) : (
            <p>No books marked as liked yet.</p>
          )} 
        </>
      ) : (
        ""
      )}

      {currentView === "liked" ? (
        <> 
          {likedBooks.length > 0 ? (
            <BookCardGrid books={likedBooks} label="allLiked" />
          ) : (
            <p>No books marked as liked yet.</p>
          )} 
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
