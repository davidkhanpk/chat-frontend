import React, { Fragment, useEffect } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Users from './Users';
import Messages from './Messages';
import {gql, useSubscription } from '@apollo/client'

import { useAuthDispatch, useAuthState } from '../../context/auth'
import { useMessageDispatch } from '../../context/message'

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid content from to createdAt
    }
  }
`

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid 
      content
      message {
        uuid from to
      }
    }
  }
`

export default function Home({ history }) {
  const authDispatch = useAuthDispatch()
  const messageDispatch = useMessageDispatch()
  const { user } = useAuthState()
  const { data: messageData, error: messageError} = useSubscription(NEW_MESSAGE);
  const { data: reactionData, error: reactionError} = useSubscription(NEW_REACTION);

  useEffect(() => {
    if(messageError) console.log(messageError);
    if(messageData) {
      console.log(messageData)
      const message = messageData.newMessage
      const otherUser = user.username === message.to ? message.from : message.to
      messageDispatch({ type: "ADD_MESSAGE", payload: {
        username: otherUser,
        message
      }})
    }
  }, [messageError, messageData])

  useEffect(() => {
    if(reactionError) console.log(reactionError);
    if(reactionData) {
      // console.log(messageData)
      const reaction = reactionData.newReaction
      const otherUser = user.username === reaction.message.to ? reaction.message.from : reaction.message.to
      messageDispatch({ type: "ADD_REACTION", payload: {
        username: otherUser,
        reaction
      }})
    }
  }, [reactionError, reactionData])

  const logout = () => {
    authDispatch({ type: 'LOGOUT' })
     window.location.href = '/login'
    // history.push('/login')
  }
  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link  to="/login">
          <Button className={user ? 'btn-disabled' : ''} variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button className={user ? 'btn-disabled' : ''} variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row className="bg-white messages-row">
        <Users  />
        <Messages />
      </Row>
    </Fragment>
  )
}