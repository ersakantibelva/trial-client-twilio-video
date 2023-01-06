import { useCallback, useState } from "react";
import axios from "axios";
import Lobby from "./Lobby";
import Room from "./Room";

export default function VideoChat() {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handleRoomNameChange = useCallback((e) => {
    setRoomName(e.target.value);
  }, []);

  const handleSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();

      const { data } = await axios.post("http://localhost:5000/join-room", {
        roomName,
        username
      });
      setToken(data.token);
    },
    [username, roomName]
  );

  const handleLogout = useCallback((room, debugFrom) => {
    if (room) {
      for (const trackPublication of room.localParticipant.tracks) {
        trackPublication.track?.stop();
      }

      console.log("DISCONNECTING ROOM");
      room.disconnect();
      console.log("DISCONNECTED ROOM");
      console.log("LOGGING OUT:", debugFrom);
      setToken(null);
    }
  }, []);

  let render;

  if (token) {
    render = (
      <Room
      roomName={roomName}
      token={token}
      handleLogout={handleLogout}
      />
    )
  } else {
    render = (
      <div>
        <Lobby 
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmitForm={handleSubmitForm}
        />
      </div>
    )
  }

  return render
}
