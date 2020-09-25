import React from 'react';
import { useAuthState } from '../context/auth';
import Login from '../pages/Login';
import Register from '../pages/Register';

export default function Tabs(props) {
    const { user } = useAuthState()
    if(user) {
        return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row>
                <Col>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                        <Nav.Link eventKey="first">Tab 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="second">Tab 2</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col>
                    <Tab.Content>
                        <Tab.Pane eventKey="first">
                            <Sonnet />
                        </Tab.Pane>
                        <Tab.Pane eventKey="second">
                            <Sonnet />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    )

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
        )
    }
    
}