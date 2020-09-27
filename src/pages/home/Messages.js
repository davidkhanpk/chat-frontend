import React, { useEffect, Fragment, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Col, Form, Image } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from "../../context/message";
import Message from "./Message";
import { useAuthState } from "../../context/auth";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
      reactions {
        uuid
        content
      }
    }
  }
`;
const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

export default function Messages({ history }) {
  const { user } = useAuthState();
  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");
  const selectedUser = users?.find((u) => u.selected === true);
  const username = selectedUser ? selectedUser.username : "";
  const messages = selectedUser?.messages;
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
    // onCompleted: data => dispatch({ type: "ADD_MESSAGE", payload: {
    //   username: selectedUser.username,
    //   message: data.sendMessage
    // }})
  });
  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);
  useEffect(() => {
    if (messagesData) {
      console.log(messagesData);
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);
  const startVideoCall = () => {
    let otherUserName = username;
    let currentname = user.username;
    let roomName = [otherUserName, currentname].sort().join(":");
    roomName = roomName.replace(/\s/g, "");
    history.push(`/video-chat/${roomName}`);
  };
  const submitMessage = (e) => {
    e.preventDefault();
    if (!content || !selectedUser) {
      return;
    }
    setContent("");
    sendMessage({ variables: { to: selectedUser.username, content } });
  };
  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">Loading...</p>;
  } else if (messages.length) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.uuid}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length == 0) {
    selectedChatMarkup = (
      <p className="info-text">
        You are now connected! Send your first message
      </p>
    );
  }
  return (
    <Col xs={12} className="flex-main-div">
      <div className="message-box-header">
        <div className="left-portion-div">
          <div
            onClick={() => {
              history.push(`/`);
            }}
            className="back-btn"
          >
            <i role="button" className="fas fa-arrow-left"></i>
          </div>
          <div className="top-image-div">
            <Image
              src={
                (selectedUser && selectedUser.imageUrl) ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              roundedCircle
              className="mr-2"
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          </div>
          <div className="top-name-div">{username}</div>
        </div>
        <div onClick={startVideoCall} className="vid-icon-div">
          <i role="button" className="fas fa-video"></i>
        </div>
      </div>
      <div className="messages-box d-flex flex-column-reverse">
        {selectedChatMarkup}
      </div>
      <div className="send-form-div">
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="p-4 message-input rounded-pill bg-secondary border-0"
              placeholder="Type a message.."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              role="button"
              className="fas fa-paper-plane fa-2x text-primary ml-2"
              onClick={submitMessage}
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}
