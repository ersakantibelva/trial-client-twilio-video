import { useEffect, useState } from 'react'
import Video from 'twilio-video'
import Participant from './Participant'
import RemoteParticipantList from './RemoteParticipantList'

export default function Room({ roomName, token, handleLogout }) {
  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])

  const logout = (debugFrom) => {
    handleLogout(room, debugFrom);
  }

  const participantConnected = (participant) => {
    console.log("CONNECTED", participant.identity);
    setParticipants([...participants, participant]);
  };

  const participantDisconnected = (participant) => {
    console.log("DISCONNECTED", participant.identity);
    setParticipants(
      participants.filter(p => p.state !== "disconnected")
    );
  };

  useEffect(() => {
    Video.connect(token, {
      name: roomName
    })
      .then((room) => {
        setRoom(room)
        room.on('participantConnected', participantConnected)
        room.on('participantDisconnected', participantDisconnected)
        console.log(room.participants);
        const roomParticipants = [];
        for (const [k, p] of room.participants) roomParticipants.push(p);
        console.log(roomParticipants);
        setParticipants(roomParticipants);
      })
  }, [roomName, token])

  useEffect(() => () => logout("UNMOUNT LOGOUT"), []);

  return (
    <div className='room'>
      <h2>Room: {roomName}</h2>
      <button onClick={logout}>Log out</button>
      <div className='local-participant'>
        {
        room ? (
          <Participant key={room.localParticipant.sid} participant={room.localParticipant} />
        ) : (
            ''
          )
      }
      </div>
      <div className='remote-participants'>
        <RemoteParticipantList participants={participants}/></div>
    </div>
  )
}
