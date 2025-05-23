import React, { useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth, provider, signInWithPopup } from "../config/firebase-config";
import Loading from "../components/Loading"; 
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);  
  const navigate = useNavigate();
 
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);

    try { 
      console.log("User provider!:", provider); // Log user details  
      const result = await signInWithPopup(auth, provider);
      console.log("User Info!:", result); // Log user details  
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      console.log("Signed in anonymously:", user.uid);
      navigate("/");
      // At this point, the user is signed in with a unique, temporary UID.
      // You can now proceed to interact with other Firebase services (Firestore, Realtime Database, etc.)
      // using this user's UID.
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      // Handle the error (e.g., display a message to the user)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      {loading ? (
        <>
          <Loading />
          <div>{errorMessage}</div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            Welcome to Bookshelf
          </p> 

          <div className="mb-4">
            <button
              className="flex items-center w-full justify-center text-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={handleGoogleSignIn}
            >
              <svg
                className="mr-2 -ml-1 w-6 h-6"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Sign in with Google
            </button>
          </div>
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute left-0 w-full border-t border-black"></div>
            <span className="relative z-10 bg-white px-4 font-semibold text-gray-700">
              OR
            </span>
          </div>
          <div>
            <button
              onClick={signInGuest}
              className="bg-black hover:bg-gray-900 w-full text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >Continue as Guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
