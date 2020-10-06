import React from "react";
import "./App.scss";
import ApolloProvider from "./apolloProvider";
import { Container } from "react-bootstrap";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import VideoChat from "./pages/home/VideoChat";
import VideoCall from "./pages/home/VideoCall";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from "./utils/DynamicRoute";
import Messages from "./pages/home/Messages";
import { EventDispatcher } from "peer-data";
import { PeerDataProvider } from "react-peer-data";
// import "webrtc-adapter";

const dispatcher = new EventDispatcher();
const iceServers = [
  { urls: 'stun:stun1.l.google.com:19302' },
      {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
      }
];

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
        <PeerDataProvider
          servers={{ iceServers }}
          constraints={{ ordered: true }}
          signaling={{
            dispatcher: dispatcher,
            url: "http://localhost:8080"
          }}
        >
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
                <DynamicRoute
                  path="/video-call"
                  exact
                  component={VideoCall}
                />
              </Switch>
            </Container>
          </BrowserRouter>
          </PeerDataProvider>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
