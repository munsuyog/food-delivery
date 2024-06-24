import React, { useRef, useState, useEffect } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('https://vc-backend-l30g.onrender.com');

const VideoCall = () => {
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });

    socket.on('signal', (signal) => {
      if (peer) {
        peer.signal(signal);
      } else {
        answerCall(signal);
      }
    });
  }, []);

  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('signal', { roomId: 'room-id', signal: data });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    setPeer(peer);
    connectionRef.current = peer;
    socket.emit('join', 'room-id');
  };

  const answerCall = (signal) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('signal', { roomId: 'room-id', signal: data });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(signal);
    setPeer(peer);
    connectionRef.current = peer;
    socket.emit('join', 'room-id');
  };

  return (
    <div>
      <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
      <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
      <button onClick={callUser}>Call</button>
    </div>
  );
};

export default VideoCall;
