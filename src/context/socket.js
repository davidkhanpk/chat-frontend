import io from "socket.io-client";
import React, { createContext, useContext } from "react";
import jwtDecode from "jwt-decode";
const SocketStateContext = createContext();
let socket = null

const token = localStorage.getItem("token");
if (token) {
    const decodedToken = jwtDecode(token);
    const expiresAt = new Date(decodedToken.exp * 1000);
    if (new Date() > expiresAt) {
      console.log("expiring token");
    } else {
        socket = io.connect("http://localhost:8000");
    }
}




export const SocketProvider = ({ children }) => (
    <SocketStateContext.Provider value={socket}>
        {children}
    </SocketStateContext.Provider>
)
export const useSocketState = () => useContext(SocketStateContext);