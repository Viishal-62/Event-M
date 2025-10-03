import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../Apicalls/authApi.js";
import { toast } from "react-toastify";

export default function Auth() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Detect system dark mode preference
  useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "signup":
        return <SignupPage navigateTo={navigateTo} />;
      case "forgotPassword":
        return <ForgotPasswordPage navigateTo={navigateTo} />;
      case "login":
      default:
        return <LoginPage navigateTo={navigateTo} />;
    }
  };

  const dotStyleDark = {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
    backgroundSize: "25px 25px",
  };

  return (
    <div
      className="relative font-sans text-gray-900 bg-gray-100 dark:bg-black min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={isDarkMode ? dotStyleDark : {}}
    >
      <div className="w-full max-w-md z-10">{renderPage()}</div>
    </div>
  );
}

// ---------------- PAGES ----------------

const LoginPage = ({ navigateTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await login({ email, password });
      if (response.success) {
        console.log("Login success!");
        toast.success(response.message);
        // Redirect or do something after login
      } else {
        console.error(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Welcome Back"
        subtitle="Log in to continue your journey."
      />
      <form className="space-y-6" onSubmit={handleLogin}>
        <InputField
          id="email"
          type="email"
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isVisible={passwordVisible}
          toggleVisibility={() => setPasswordVisible(!passwordVisible)}
        />
        <div className="flex items-center justify-end">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("forgotPassword");
            }}
            className="text-sm font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            Forgot password?
          </a>
        </div>
        <AuthButton>{loading ? "Loading..." : "Log in"}</AuthButton>
      </form>
      <AuthFooter
        text="Not a member yet?"
        linkText="Sign up"
        onClick={() => navigateTo("signup")}
      />
    </AuthCard>
  );
};

const SignupPage = ({ navigateTo }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signup } = useAuthStore();

  const handleSignup = async (event) => {
    event.preventDefault();
    const response = await signup({ name: fullName, email, password });
    if (response.success) {
      navigateTo("login");
    } else {
      console.error(response.message);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Create Your Account"
        subtitle="Let's get you started."
      />
      <form className="space-y-6" onSubmit={handleSignup}>
        <InputField
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <InputField
          id="signup-email"
          type="email"
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isVisible={passwordVisible}
          toggleVisibility={() => setPasswordVisible(!passwordVisible)}
        />
        <AuthButton>Create Account</AuthButton>
      </form>
      <AuthFooter
        text="Already a member?"
        linkText="Log in"
        onClick={() => navigateTo("login")}
      />
    </AuthCard>
  );
};

const ForgotPasswordPage = ({ navigateTo }) => {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Reset Password"
        subtitle="Enter your email to get reset instructions."
      />
      <form className="space-y-6" onSubmit={handleReset}>
        <InputField
          id="reset-email"
          type="email"
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthButton>Send Instructions</AuthButton>
      </form>
      <AuthFooter
        text="Remembered it?"
        linkText="Back to Log in"
        onClick={() => navigateTo("login")}
        icon={<ArrowLeft className="h-4 w-4 mr-1" />}
      />
    </AuthCard>
  );
};

// ---------------- REUSABLE COMPONENTS ----------------

const AuthCard = ({ children }) => (
  <div className="bg-white/80 dark:bg-black/20 p-8 rounded-2xl shadow-2xl dark:shadow-black/50 w-full transition-all duration-300 backdrop-blur-lg border border-white/20 dark:border-white/10">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 rounded-full p-3 mb-4 ring-8 ring-cyan-100/50 dark:ring-cyan-900/30">
        <Lock className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
      </div>
    </div>
    {children}
  </div>
);

const AuthHeader = ({ title, subtitle }) => (
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      {title}
    </h1>
    <p className="text-gray-500 dark:text-gray-300 mt-2">{subtitle}</p>
  </div>
);

const InputField = ({ id, type, label, placeholder, value, onChange }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
      required
    />
  </div>
);

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  isVisible,
  toggleVisibility,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={id}
        type={isVisible ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
        required
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
      >
        {isVisible ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
);

const AuthButton = ({ children }) => (
  <button
    type="submit"
    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black focus:ring-cyan-500 transition-all transform hover:scale-105 hover:shadow-cyan-500/50"
  >
    {children}
  </button>
);

const AuthFooter = ({ text, linkText, onClick, icon = null }) => (
  <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
    {icon}
    {text}
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300 ml-1"
    >
      {linkText}
    </a>
  </p>
);
