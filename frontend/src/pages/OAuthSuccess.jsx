import { useEffect } from "react";

const OAuthSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const token = params.get("token");

    const user = {
      id: params.get("id"),
      name: params.get("name"),
      email: params.get("email"),
    };

    if (!token) {
      window.location.href = "/login";
      return;
    }
    localStorage.setItem(
      "accessToken",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
    // Use window.location instead of React Router navigate
    window.location.href = "/dashboard";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
};

export default OAuthSuccess;