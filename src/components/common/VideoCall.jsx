import React, { useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const VideoCall = ({ roomId, isInitiator }) => {
  const socketRef = useRef();
  const peerRef = useRef();
  const userVideoRef = useRef();
  const partnerVideoRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideoRef.current.srcObject = stream;

        socketRef.current.emit('join-room', roomId);

        socketRef.current.on('offer', (offer, userId) => {
          if (isInitiator) return;

          peerRef.current = new SimplePeer({ initiator: false, trickle: false, stream });
          peerRef.current.signal(offer);

          peerRef.current.on('stream', (remoteStream) => {
            partnerVideoRef.current.srcObject = remoteStream;
          });

          peerRef.current.on('signal', (answer) => {
            socketRef.current.emit('answer', answer, userId);
          });

          peerRef.current.on('connect', () => {
            console.log('Peer connected');
          });

          peerRef.current.on('data', (data) => {
            console.log('Received data:', data);
          });

          peerRef.current.on('close', () => {
            console.log('Peer connection closed');
          });

          peerRef.current.on('error', (error) => {
            console.error('Peer connection error:', error);
          });
        });

        socketRef.current.on('answer', (answer) => {
          if (!isInitiator) return;
          peerRef.current.signal(answer);
        });

        socketRef.current.on('ice-candidate', (candidate) => {
          peerRef.current.addIceCandidate(candidate);
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      socketRef.current.disconnect();
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [roomId, isInitiator]);

  return (
    <div>
      <div>
        <video ref={userVideoRef} autoPlay muted style={{ width: '50%' }} />
        <video ref={partnerVideoRef} autoPlay style={{ width: '50%' }} />
      </div>
    </div>
  );
};

export default VideoCall;
