export function isAuthenticated() {
    return typeof window !== "undefined" && localStorage.getItem("token");
  }
  