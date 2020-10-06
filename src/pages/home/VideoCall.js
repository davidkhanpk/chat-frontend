import React, { useEffect, useRef } from 'react';
import { usePeerData } from 'react-peer-data';

function VideoCall () {
    const peerData = usePeerData();
    let participants = []
    const room = useRef();
    useEffect(() => {
        if(room.current) {
            return
        }
        async function init() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        room.current = peerData.connect('sdfggrsdfgsfmy-room-adfafwdewesdfa', stream);
        // const room = peerData.connect('my-room-adfafw', stream);
        room.current.on("participant", participant => {
              console.log(participant)
              participants.push(participant.id)
              participant
                  .on("disconnected", () => { console.log('disconnected', participant.id); })
                  .on("track", event => { console.log('stream', participant.id, event.streams[0]); })
                  .on("message", payload => { console.log(participant.id, payload); })
                  .on("error", event => {
                      console.error('peer', participant.id, event);
                      participant.renegotiate();
                  });
        })
        .on("error", event => { console.error('room',  event); });
   
        return () => room.disconnect()
        }
        init();
    }, [peerData]);
    let markup = 'Hello2';
    if(participants.length) {
        markup = participants.map((member) => (
        <p>hello3</p>
        ))
    }
    return (
        <div>
            <p>Hello</p>
            {markup}
        </div>
    )
}

export default VideoCall;