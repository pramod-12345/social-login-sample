import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import CommonInput from "./components/CommonInput";
import { jwtDecode } from "jwt-decode";

function App() {
  const clientId = "541906257676-o9mmbf38gg6tq9v871of2cenrdc9f891.apps.googleusercontent.com";

  const location = useLocation();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "", });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userData = params.get("user");

    if (userData) {
      const parsedUser = JSON.parse(decodeURIComponent(userData));
      console.log("User Data:", parsedUser);
      setUser(parsedUser)

      const baseUrl = window.location.origin;
      window.history.replaceState({}, document.title, baseUrl);
    }
  }, [location]);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const handleSuccess = (response) => {
    const userInfo = jwtDecode(response.credential);
    console.log("Google login success:", userInfo);
    setUser(userInfo);
  };

  const handleError = () => {
    console.log("Google Login Failed");
  };

  const handleFacebookResponse = (response) => {
    if (response.accessToken) {
      console.log("Facebook Login Success:", response);
      setUser(response);
      const baseUrl = window.location.origin;
      window.history.replaceState({}, document.title, baseUrl);
    } else {
      console.log("Facebook Login Failed");
    }
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:4040/auth/github";
  };

  const handleTwitterLogin = () => {
    window.location.href = "http://localhost:4040/auth/twitter";
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 mt-4">
              {
                user.provider ? `Welcome Back ${user.username}` : `Welcome Back ! ${user.name || user.username}`
              }

            </h3>
          </div>
          <div className="flex justify-center">
            <button onClick={() => setUser(null)} className="px-4 py-2 bg-rose-600 cursor-pointer rounded-md text-white font-semibold">
              Logout
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">
              Sign in to continue to your account
            </p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <CommonInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              label="Email Address"
              required
            />
            <CommonInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              label="Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none cursor-pointer transition-colors"
            >
              Sign in
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="relative mb-8 mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGithubLogin}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SiGithub className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={handleTwitterLogin}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <div className="absolute opacity-0">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  text=""
                />
              </div>
            </div>


            <button
              onClick={handleTwitterLogin}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTwitter className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Twitter</span>
            </button>
            <FacebookLogin
              appId={599371659718546}
              autoLoad={false}
              callback={handleFacebookResponse}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FaFacebookF className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Facebook</span>
                </button>
              )}
            />
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
