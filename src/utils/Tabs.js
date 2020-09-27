import React, { useState, useEffect } from "react";
import { useAuthState } from "../context/auth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Messages from "../pages/home/Messages";
import Users from "../pages/home/Users";
import { Tab, Col, Nav, Row } from "react-bootstrap";
export default function Tabs({ history }) {
  const [activeTab, setActiveTab] = useState("people");
  useEffect(() => {
    toggle("people");
  }, []);
  const toggle = (tab) => {
    console.log(tab);
    if (activeTab !== tab) setActiveTab(tab);
  };
  const { user } = useAuthState();
  if (user) {
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col className="tabs-col">
            <Nav variant="pills" className="flex-row main-nav-bar">
              <Nav.Item className="tab-nav-item">
                <Nav.Link
                  onClick={() => {
                    toggle("people");
                  }}
                  className="nav-item-link"
                  eventKey="people"
                >
                  People
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="tab-nav-item">
                <Nav.Link
                  onClick={() => {
                    toggle("messahe");
                  }}
                  className="nav-item-link"
                  eventKey="message"
                >
                  Chat
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col className="p-0">
            <Tab.Content>
              <Tab.Pane eventKey="people">
                <Users />
              </Tab.Pane>
              <Tab.Pane eventKey="message">
                <Messages history={history} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  } else {
    return (
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Register</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Login />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Register />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}
