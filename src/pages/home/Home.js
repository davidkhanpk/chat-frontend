import React, { Fragment, useEffect } from "react";
import { gql, useSubscription, useQuery } from "@apollo/client";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/message";
import Tabs from "../../utils/Tabs";

const GET_USER = gql`
  query getUser {
    getUser {
      username
      imageUrl
      language
      email
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`;

export default function Home({ history }) {
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();
  const { user } = useAuthState();
  const { loading } = useQuery(GET_USER, {
    onCompleted: (data) => {
      console.log(data);
      authDispatch({ type: "SET_CURRENT_USER", payload: data.getUser });
    },
    onError: (err) => console.log(err),
  });
  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE
  );
  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION
  );

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      console.log(messageData);
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: otherUser,
          message,
        },
      });
    }
  }, [messageError, messageData]);

  useEffect(() => {
    if (reactionError) console.log(reactionError);
    if (reactionData) {
      // console.log(messageData)
      const reaction = reactionData.newReaction;
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;
      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [reactionError, reactionData]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
    // history.push('/login')
  };
  return (
    <Fragment>
      <Tabs history={history} />
    </Fragment>
  );
}
