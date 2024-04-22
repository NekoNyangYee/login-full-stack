import LoginPage from "./auth/login.page";
import SignupPage from "./auth/signup.page";
import "../public/scss/main.scss";

export default function Home() {
  return (
    <div className="container">
      <LoginPage />
      <SignupPage />
    </div>
  );
}
