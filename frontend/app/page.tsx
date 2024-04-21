import Image from "next/image";
import LoginPage from "./auth/login.page";
import SignupPage from "./auth/signup.page";

export default function Home() {
  return (
    <main>
      <LoginPage />
      <SignupPage />
    </main>
  );
}
