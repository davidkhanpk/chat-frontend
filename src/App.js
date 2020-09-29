import React from "react";
import "./App.scss";
import ApolloProvider from "./apolloProvider";
import { Container } from "react-bootstrap";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import VideoChat from "./pages/home/VideoChat";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./utils/DynamicRoute";
import Messages from "./pages/home/Messages";
// import "webrtc-adapter";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
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
                <DynamicRoute
                  path="/video-chat/:roomName"
                  exact
                  component={VideoChat}
                  authenticated
                />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
