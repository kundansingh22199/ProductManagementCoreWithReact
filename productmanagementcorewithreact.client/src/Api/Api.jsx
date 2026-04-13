const API_URL = import.meta.env.VITE_API_URL;

const api = async (endpoint, navigate, options = {}) => {
    debugger;
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;

    if (!token) {
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return null;
    }

    const isFormData = options.body instanceof FormData;

    try {
        debugger;
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: options.method || "GET",
            headers: {
                "X-Auth-Token": token,
                ...(isFormData ? {} : { "Content-Type": "application/json" })
            },
            body: options.body
                ? (isFormData ? options.body : JSON.stringify(options.body))
                : null
        });
        debugger;
        if (res.status === 401) {
            sessionStorage.clear();
            navigate("/login", { replace: true });
            return null;
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("API error:", error);
        alert("Server error. Please try again.");
        return null;
    }
};

export default api;