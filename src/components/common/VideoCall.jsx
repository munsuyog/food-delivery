import React, { useRef, useState, useEffect } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const VideoCall = ({ role, userId, roomId }) => {
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

    socket.emit('join', { roomId, role, userId });

    socket.on('signal', (data) => {
      if (peer) {
        peer.signal(data.signal);
      } else {
        answerCall(data.signal);
      }
    });

    socket.on('failed', (data) => {
      console.log(data.message);
      // Handle failed signal attempt
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const callUser = (to) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('signal', { roomId, signal: data, from: userId, to });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    setPeer(peer);
    connectionRef.current = peer;
  };

  const answerCall = (signal) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('signal', { roomId, signal: data, from: userId, to: signal.from });
    });

    peer.on('stream', (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(signal);
    setPeer(peer);
    connectionRef.current = peer;
  };

  return (
    <div>
      <h2>{role === 'driver' ? 'Driver' : 'Customer'} Video Call</h2>
      <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
      <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
      {role === 'driver' && (
        <button onClick={() => callUser('customerId')}>
          Call Customer
        </button>
      )}
      {role === 'customer' && (
        <button onClick={() => callUser('driverId')}>
          Call Driver
        </button>
      )}
    </div>
  );
};

export default VideoCall;
