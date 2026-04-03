import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    } else if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white px-6 py-12">
      <div className="max-w-md w-full space-y-10 border border-gray-100 p-8 md:p-12 shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium tracking-wide">
            Join our community of tea lovers.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm font-semibold bg-red-50 p-3 text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                placeholder="Alex Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 tracking-widest uppercase mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D3748] hover:bg-black text-white py-4 text-xs font-bold tracking-[0.2em] transition-colors uppercase mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs font-medium text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
