import React, {} from 'react';
import { gql, useQuery, from } from '@apollo/client' 
import { Col, Image } from 'react-bootstrap';
import { useMessageDispatch, useMessageState } from '../../context/message';
import classNames from 'classnames';

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      language
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`

export default function Users() {
    const disptach = useMessageDispatch();
    const { users } = useMessageState()
    console.log(users);
    const selectedUser = users?.find(u => u.selected === true)?.username
    const { loading } = useQuery(GET_USERS, {
        onCompleted: data => disptach({ type: 'SET_USERS', payload: data.getUsers }),
        onError: err => console.log(err)
    })
    let usersMarkup
    if (!users || loading) {
        usersMarkup = <p>Loading..</p>
    } else if (users.length === 0) {
        usersMarkup = <p>No users have joined yet</p>
    } else if (users.length > 0) {
        usersMarkup = users.map((user) => {
            const selected = selectedUser === user.username
            return (
                <div
                    className={classNames("user-div d-flex p-3 justify-content-center justify-content-md-start", {'bg-white': selected})}
                    role="button"
                    key={user.username}
                    onClick={() => disptach({type: 'SET_SELECTED_USER', payload: user.username})}
                >
                    <Image
                    src={user.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    className="user-image"
                    />
                    <div className="d-none d-md-block ml-2">
                    <p className="text-success">{user.username}</p>
                    <p className="font-weight-light">
                        {user.latestMessage
                        ? user.latestMessage.content
                        : 'You are now connected!'}
                    </p>
                    </div>
                </div>
            )
        })
    }
    return (
        <Col xs={2} md={4} className="p-0 bg-secondary">
          {usersMarkup}
        </Col>
    )
}