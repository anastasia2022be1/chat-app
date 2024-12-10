import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { authState } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 ">
      {/* Hero Section */}
      <div className="text-center bg-green-500 text-white p-12 rounded-xl ">
        <h1 className="text-4xl font-bold">Welcome to talki!!</h1>
        <p className="mt-4 text-lg">
          Your favorite place to connect and chat with friends.
        </p>

        {/* Call to action buttons */}
        <div className="mt-6 flex justify-center gap-4">
          {!authState ? (
            <>
              <Link to="/login">
                <button className="px-6 py-3 bg-orange-500 text-white  rounded-lg hover:bg-orange-400 transition">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-6 py-3 bg-blue-600 text-white  rounded-lg hover:bg-blue-500 transition">
                  Join Now
                </button>
              </Link>
            </>
          ) : (
            <div>
              <p className="text-lg">Welcome back! Ready to chat?</p>
              <Link to="/profile">
                <button className="px-6 py-3 bg-purple-600 text-white  rounded-lg hover:bg-purple-500 transition mt-4">
                  Go to Profile
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="text-center mt-16 ">
        <h2 className="text-3xl ">Why talki!?</h2>
        <ul className="mt-6 space-y-4 text-lg">
          <li>🔹 Instant messaging with friends</li>
          <li>🔹 Secure and private chats</li>
          <li>🔹 Join groups and make new connections</li>
          <li>🔹 Simple and easy-to-use interface</li>
        </ul>
      </div>
    </div>
  );
}
