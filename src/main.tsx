import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import ReactDOM from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

const savedPreferences = localStorage.getItem("settings_preferences");
if (savedPreferences) {
  try {
    const parsed = JSON.parse(savedPreferences);
    const themeClass = parsed.darkMode === true ? "theme-dark" : "theme-light";
    document.documentElement.classList.add(themeClass);
  } catch (e) {
    document.documentElement.classList.add("theme-light");
  }
} else {
  document.documentElement.classList.add("theme-light");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </GoogleOAuthProvider>,
);
