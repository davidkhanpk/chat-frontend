import React from "react";
import "./App.scss";
import ApolloProvider from "./apolloProvider";
import { Container } from "react-bootstrap";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
// import VideoChat from "./pages/home/VideoChat";
import VideoCall from "./pages/home/VideoCall";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import { SocketProvider } from "./context/socket";
import DynamicRoute from "./utils/DynamicRoute";
import Messages from "./pages/home/Messages";
// import "webrtc-adapter";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <SocketProvider>
          <MessageProvider>
            <BrowserRouter>
              <Container style={{ height: "100%" }}>
                <Switch>
                  <DynamicRoute path="/" exact component={Home} authenticated />
                  <DynamicRoute
                    path="/messages/:username"
                    exact
                    component={Messages}
                    authenticated
                  />
                  <DynamicRoute path="/login" exact component={Login} guest />
                  <DynamicRoute
                    path="/register"
                    exact
                    component={Register}
                    guest
                  />
                  {/* <DynamicRoute
                    path="/video-chat/:roomName"
                    exact
                    component={VideoChat}
                    authenticated
                  /> */}
                  <DynamicRoute
                    path="/video-call"
                    exact
                    component={VideoCall}
                    authenticated
                  />
                </Switch>
              </Container>
            </BrowserRouter>
          </MessageProvider>
        </SocketProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
