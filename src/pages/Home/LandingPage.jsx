import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      dispatch({ type: "LOGIN_SUCCESS", payload: token });
      navigate("/home", { replace: true });
    }
  }, []);

  const handleLogin = () => {
    navigate('/login')
  };

  const handleSignUp = () => {
    navigate('/signup')
  };

  const handleGetStarted = () => {
    navigate('/login')
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="cursor-pointer h-8 w-20 sm:h-10 sm:w-24 lg:h-12 lg:w-32 bg-cover bg-center rounded flex-shrink-0"
              style={{ backgroundImage: "url('/Assets/team.jpg')" }}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#features" className="hover:text-gray-600 transition text-sm xl:text-base">Features</a>
            <a href="#pricing" className="hover:text-gray-600 transition text-sm xl:text-base">Pricing</a>
            <a href="#more" className="hover:text-gray-600 transition text-sm xl:text-base">More</a>
            <a href="#support" className="hover:text-gray-600 transition text-sm xl:text-base">Support</a>
            <button
              onClick={handleLogin}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 xl:px-6 py-2 rounded-md transition text-sm xl:text-base"
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 xl:px-6 py-2 rounded-md transition text-sm xl:text-base"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <button
              onClick={handleLogin}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition text-xs sm:text-sm"
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition text-xs sm:text-sm"
            >
              Sign Up
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 p-2 hover:bg-gray-100 rounded-md"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="hover:text-gray-600 transition text-sm">Features</a>
              <a href="#pricing" className="hover:text-gray-600 transition text-sm">Pricing</a>
              <a href="#more" className="hover:text-gray-600 transition text-sm">More</a>
              <a href="#support" className="hover:text-gray-600 transition text-sm">Support</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 sm:gap-10 lg:gap-8 xl:gap-12">
          {/* Left Content */}
          <div className="flex-1 w-full text-center lg:text-left lg:pt-4 xl:pt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight text-gray-900">
              Real-Time<br />Collaboration
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-base mb-6 sm:mb-7 lg:mb-8 max-w-md mx-auto lg:mx-0">
              Work together seamlessly in real-time from anywhere. Boost team's productivity and success.
            </p>

            {/* User Avatars */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 sm:mb-7 lg:mb-8">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-blue-400 border-2 border-white shadow-md"></div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-green-400 border-2 border-white shadow-md"></div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-purple-400 border-2 border-white shadow-md"></div>
              </div>
            </div>

            <button
              onClick={handleGetStarted}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-7 lg:px-8 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>

          {/* Center Content - Globe Image with Border */}
          <div className="flex-1 w-full flex justify-center relative order-last lg:order-none my-8 lg:my-0">
            <div className="relative inline-block">
              {/* Blue border frame */}
              <div className="border-2 sm:border-3 lg:border-4 border-blue-400 rounded-lg p-2 sm:p-3 lg:p-4 bg-white inline-block">
                {/* Orange oval border */}
                <div className="w-44 h-52 sm:w-52 sm:h-60 md:w-60 md:h-72 lg:w-64 lg:h-80 xl:w-72 xl:h-80 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-2xl">
                  {/* Globe image */}
                  <div
                    className="w-36 h-44 sm:w-44 sm:h-52 md:w-52 md:h-64 lg:w-56 lg:h-72 xl:w-60 xl:h-72 rounded-full bg-gray-800 overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: "url('/Assets/landingPage.jpg')" }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Testimonial Card */}
          <div className="flex-1 w-full lg:pt-4 xl:pt-8">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-5 lg:p-6 w-full max-w-sm sm:max-w-md lg:max-w-none xl:max-w-sm mx-auto border border-gray-100">
              {/* Star Rating */}
              <div className="flex gap-1 mb-3 justify-center lg:justify-start">
                <span className="text-orange-400 text-base sm:text-lg lg:text-xl">★</span>
                <span className="text-orange-400 text-base sm:text-lg lg:text-xl">★</span>
                <span className="text-orange-400 text-base sm:text-lg lg:text-xl">★</span>
                <span className="text-orange-400 text-base sm:text-lg lg:text-xl">★</span>
                <span className="text-orange-400 text-base sm:text-lg lg:text-xl">★</span>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-orange-400 flex-shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/Assets/harsh-patel.jpg')" }}
                ></div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base mb-1.5 sm:mb-2 text-gray-900">Harsh Patel</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    "The live chat and collaboration features make communication smooth and efficient."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 text-gray-900">
            Powerful Features
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-10 lg:mb-12 text-sm sm:text-base">
            Everything you need to collaborate effectively
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-blue-500 rounded-lg mb-3 sm:mb-4"></div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Real-time Sync</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                See changes instantly as your team collaborates
              </p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-green-500 rounded-lg mb-3 sm:mb-4"></div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Team Management</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Organize projects and track progress effortlessly
              </p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-purple-500 rounded-lg mb-3 sm:mb-4"></div>
              <h3 className="font-bold text-base sm:text-lg mb-2 text-gray-900">Secure & Private</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Your data is encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
            © 2024 Collaboration Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}