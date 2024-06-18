import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";

import { InputForm, TwButton } from "components";
import { useAppDispatch, useAppSelector } from "hooks";
import { makePendingMsg } from "toastSlice";
import {
  clearUserStateErr,
  getUserState,
  googleLogin,
  emailLogin,
} from "./userSlice";

// Import your logo/image
import logo from "./smartstudentlogo.png";

interface SignInProps {
  setIsSigningIn: (state: boolean) => void;
  setKeepSignedIn: (state: boolean) => void;
  keepSignedIn: Boolean;
}

const SignIn = ({
  setIsSigningIn,
  setKeepSignedIn,
  keepSignedIn,
}: SignInProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { status, errorMsg } = useAppSelector(getUserState);
  const dispatch = useAppDispatch();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(emailLogin({ email, password }));
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  useEffect(() => {
    dispatch(clearUserStateErr());
  }, [email, password]);

  useEffect(() => {
    status === "pending" && dispatch(makePendingMsg("Signing in..."));

    return () => {
      dispatch(makePendingMsg(""));
    };
  }, [status]);

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-2">
      <div className="relative">
        {/* added image and styled it round */}
        <img
          src={logo}
          alt="Logo"
          className="rounded-full h-24 w-24 mx-auto -mt-12"
        />

        <div className="flex flex-col gap-1">
          <label className="text text-3xl font-semibold text-center">
            SmartMessenger
          </label>
          <label className="text-muted text-sm text-center mb-4">
            Enter your credentials
          </label>
        </div>
      </div>

      <p
        className={`text-red-600 text-md text-center ${
          errorMsg ? "visible block" : "absolute invisible"
        }`}
      >
        {errorMsg}
      </p>

      <InputForm
        label="Email"
        autoFocus={true}
        type="email"
        state={email}
        setState={setEmail}
        placeholder="e.g example123@example.com"
      />
      <InputForm
        label="Password"
        type="password"
        state={password}
        setState={setPassword}
        placeholder="*********"
      />

      <TwButton
        type="submit"
        className="mt-4"
        disabled={!email || !password || (status === "pending" && true)}
      >
        {status === "pending" ? "Signing in..." : "Sign in"}
      </TwButton>

      <p className="text-muted text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setIsSigningIn(false)}
          className="text-primary-main hover:text-primary-tinted dark:text-primary-tinted dark:hover:text-primary-main font-semibold cursor-pointer duration-300"
        >
          Sign up
        </button>
      </p>

      <div className="flex flex-col gap-2 mt-4">
        <TwButton
          type="button"
          onClick={handleGoogleLogin}
          disabled={status === "pending" && true}
          className="justify-center text-primary-tinted dark:text-primary-shaded"
          variant="transparent"
        >
          Sign In With Google
        </TwButton>
      </div>
    </form>
  );
};

export default SignIn;
