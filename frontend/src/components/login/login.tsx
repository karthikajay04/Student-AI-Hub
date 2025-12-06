"use client";

import { useState, useEffect } from "react";
import { SplineScene } from "@/components/login/splite";
import { Spotlight } from "@/components/login/spotlight";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

import axios from "axios";
import { useAuth } from "@/store/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../api";

// 🚀 MAIN LOGIN + SIGNUP SCREEN
export function Login() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  // 🔥 Handle Google Redirect (token in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    console.log("Google redirect params:", { token, name, email });

    if (token) {
      // Optional: persist auth so refresh keeps user logged in
      try {
        localStorage.setItem(
          "auth",
          JSON.stringify({ token, user: { name, email } })
        );
      } catch (e) {
        console.error("Failed to store auth in localStorage", e);
      }

      login({ token, user: { name, email } });
      navigate("/tools");
    }
  }, [login, navigate]);

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-60" fill="white" />

      <div className="flex flex-col md:flex-row h-full">
        {/* LEFT SIDE – AUTH CARD */}
        <div className="flex-1 flex items-center justify-center p-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={cn(
              "w-full max-w-md p-10 rounded-2xl",
              "border border-white/10",
              "bg-gradient-to-br from-black/40 via-black/20 to-black/60",
              "backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]",
              "text-white"
            )}
          >
            <h1 className="text-4xl font-bold text-center mb-8">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <AuthForm mode={mode} />

            {/* Switch Login <-> Signup */}
            <p className="text-center text-gray-300 text-sm mt-6">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    className="text-white underline cursor-pointer"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-white underline cursor-pointer"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE – SPLINE SCENE */}
        <div className="flex-1 hidden md:block relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

/* ===============================
      FORM COMPONENT
==================================*/

function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuth((s) => s.login);
  const navigate = useNavigate();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    try {
      if (mode === "login") {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email,
          password,
        });
        login(res.data);
        navigate("/tools");
        return;
      }

      // SIGN UP
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      login(res.data);
      navigate("/tools");
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "signup" && (
        <FloatingInput label="Full Name" type="text" name="name" required />
      )}

      <FloatingInput label="Email" type="email" name="email" required />

      <PasswordInput
        show={showPassword}
        toggle={() => setShowPassword(!showPassword)}
        name="password"
      />

      {mode === "signup" && (
        <PasswordInput
          label="Confirm Password"
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
          name="confirmPassword"
        />
      )}

      {/* GOOGLE LOGIN BUTTON */}
      <button
        type="button"
        onClick={() => {
          window.location.href = `${API_BASE_URL}/api/auth/google`;
        }}
        className="w-full py-3 flex items-center gap-3 justify-center 
                   bg-white/10 border border-white/20 
                   rounded-xl hover:bg-white/20 transition-all"
      >
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png"
          alt="google"
          className="w-5 h-5"
        />
        Continue with Google
      </button>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/80 transition-all"
      >
        {mode === "login" ? "Login" : "Sign Up"}
      </button>

      {/* ERROR MESSAGE */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-center text-sm"
        >
          {error}
        </motion.p>
      )}
    </form>
  );
}

/* ===============================
      INPUT COMPONENTS
==================================*/

function FloatingInput({
  label,
  type,
  name,
  required,
}: {
  label: string;
  type: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        required={required}
        type={type}
        name={name}
        className="
          w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
          text-white outline-none peer focus:border-white/40
        "
      />
      <label
        className="
          absolute left-4 top-3 text-gray-300 transition-all pointer-events-none
          peer-focus:-top-3 peer-focus:text-xs peer-valid:-top-3 peer-valid:text-xs 
          peer-focus:text-white/90
        "
      >
        {label}
      </label>
    </div>
  );
}

function PasswordInput({
  show,
  toggle,
  label = "Password",
  name,
}: {
  show: boolean;
  toggle: () => void;
  label?: string;
  name: string;
}) {
  return (
    <div className="relative">
      <input
        required
        name={name}
        type={show ? "text" : "password"}
        className="
          w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
          text-white outline-none peer focus:border-white/40
        "
      />
      <label
        className="
          absolute left-4 top-3 text-gray-300 transition-all pointer-events-none
          peer-focus:-top-3 peer-focus:text-xs peer-valid:-top-3 peer-valid:text-xs
          peer-focus:text-white/90
        "
      >
        {label}
      </label>

      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-3 text-white/60 hover:text-white transition"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
