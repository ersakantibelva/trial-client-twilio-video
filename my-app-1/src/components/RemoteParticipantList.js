import Participant from "./Participant";

export default function RemoteParticipantList({ participants }) {
  if (participants?.length) {
    return (
      <>
        {
        participants.map(participant => {
          return (
            <Participant key={participant.sid} participant={participant} />
          )
        })
      }
        </>
    );
  }
}
