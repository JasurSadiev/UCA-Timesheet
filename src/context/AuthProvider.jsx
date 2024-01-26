import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});

	useEffect(() => {
		const storedAccessToken = Cookies.get("accessToken");
		if (storedAccessToken) {
			setAuth((prevAuth) => ({ ...prevAuth, accessToken: storedAccessToken }));
		}
	}, []);

	useEffect(() => {
		if (auth.accessToken) {
			Cookies.set("accessToken", auth.accessToken, { expires: 7 }); // Adjust the expiration as needed
		}
	}, [auth.accessToken]);

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
