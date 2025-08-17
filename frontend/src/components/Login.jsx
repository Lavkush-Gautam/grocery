import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import gsap from "gsap";

const Login = () => {
  const [state, setState] = useState("login"); // login or register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
  const formRef = useRef(null);

  useEffect(() => {
    // GSAP animation when modal appears
    gsap.fromTo(
      formRef.current,
      { y: -50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const payload =
      state === "login" ? { email, password } : { name, email, password };

    try {
      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (data?.success) {
        setUser(data.user);
        navigate("/");
        toast.success(data.message || "Success");
        setShowUserLogin(false);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        ref={formRef}
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full relative">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10"
            type={showPassword ? "text" : "password"}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500 text-sm"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
