import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const VideoCall = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const [userStream, setUserStream] = useState();
  const peerRef = useRef();

  useEffect(() => {
    const newSocket = io('https://vc-backend-l30g.onrender.com'); // Your server URL
    setSocket(newSocket);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        userVideo.current.srcObject = stream;
        setUserStream(stream);

        newSocket.emit('join-room', roomId);

        newSocket.on('user-connected', userId => {
          callUser(userId);
        });

        newSocket.on('signal', async ({ from, signal }) => {
          if (signal.type === 'offer') {
            await answerCall(from, signal);
          } else if (signal.type === 'answer') {
            peerRef.current.signal(signal);
          } else {
            peerRef.current.addIceCandidate(new RTCIceCandidate(signal));
          }
        });
      })
      .catch(error => {
        console.error("Error accessing media devices.", error);
        alert("Error accessing media devices. Please check permissions.");
      });

    return () => newSocket.close();
  }, [roomId]);

  const callUser = (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerRef.current = peer;

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { to: userId, signal: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      partnerVideo.current.srcObject = event.streams[0];
    };

    userStream.getTracks().forEach(track => peer.addTrack(track, userStream));

    peer.createOffer().then(offer => {
      peer.setLocalDescription(offer).then(() => {
        socket.emit('signal', { to: userId, signal: offer });
      });
    });
  };

  const answerCall = (userId, offer) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerRef.current = peer;

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { to: userId, signal: event.candidate });
      }
    };

    peer.ontrack = (event) => {
      partnerVideo.current.srcObject = event.streams[0];
    };

    userStream.getTracks().forEach(track => peer.addTrack(track, userStream));

    peer.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
      peer.createAnswer().then(answer => {
        peer.setLocalDescription(answer).then(() => {
          socket.emit('signal', { to: userId, signal: answer });
        });
      });
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <video ref={userVideo} autoPlay muted style={{ width: '100%', maxWidth: '600px' }} />
        <video ref={partnerVideo} autoPlay style={{ width: '100%', maxWidth: '600px' }} />
      </div>
      {userStream ? <p>Connected</p> : <p>Connecting...</p>}
    </div>
  );
};

export default VideoCall;
