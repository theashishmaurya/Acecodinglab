'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, MessageSquare, Code, Video, VideoOff, 
  Mic, MicOff, ScreenShare, ScreenShareOff,
  Settings, Phone, PhoneOff, Hand, Circle, Square
} from 'lucide-react';

interface LiveInterviewRoomProps {
  interview_id: string;
  participant_id: string;
  participant_name: string;
  role: 'interviewer' | 'candidate';
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onLeave?: () => void;
}

interface Participant {
  id: string;
  name: string;
  role: 'interviewer' | 'candidate' | 'observer';
  is_muted: boolean;
  is_video_off: boolean;
  is_screen_sharing: boolean;
}

interface ChatMessage {
  id: string;
  participant_id: string;
  participant_name: string;
  content: string;
  timestamp: Date;
  is_system: boolean;
}

export function LiveInterviewRoom({
  interview_id,
  participant_id,
  participant_name,
  role,
  onStartRecording,
  onStopRecording,
  onLeave,
}: LiveInterviewRoomProps) {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: participant_id, name: participant_name, role, is_muted: false, is_video_off: false, is_screen_sharing: false },
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'chat'>('code');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      participant_id: 'system',
      participant_name: 'System',
      content: 'Interview started. Recording in progress.',
      timestamp: new Date(),
      is_system: true,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [elapsed, setElapsed] = useState(0);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize media
  useEffect(() => {
    initializeMedia();
    return () => {
      cleanupMedia();
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to get media:', error);
      setIsVideoOff(true);
      setIsMuted(true);
    }
  };

  const cleanupMedia = () => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
  };

  const toggleMute = useCallback(() => {
    const audioTrack = mediaStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    const videoTrack = mediaStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        screenStreamRef.current = stream;
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
        
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } catch (error) {
        console.error('Failed to share screen:', error);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      onStopRecording?.();
    } else {
      setIsRecording(true);
      onStartRecording?.();
      addSystemMessage('Recording started');
    }
  };

  const addSystemMessage = (content: string) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      participant_id: 'system',
      participant_name: 'System',
      content,
      timestamp: new Date(),
      is_system: true,
    }]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      participant_id,
      participant_name,
      content: chatInput,
      timestamp: new Date(),
      is_system: false,
    };
    
    setChatMessages(prev => [...prev, message]);
    setChatInput('');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    cleanupMedia();
    onLeave?.();
  };

  return (
    <div className="live-interview-room">
      {/* Header */}
      <div className="room-header">
        <div className="interview-info">
          <span className="interview-title">Technical Interview</span>
          <span className="interview-duration">
            <Circle className={`recording-indicator ${isRecording ? 'active' : ''}`} size={8} />
            {formatTime(elapsed)}
          </span>
        </div>
        <div className="participant-avatars">
          {participants.map(p => (
            <div key={p.id} className={`avatar ${p.role}`}>
              {p.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          ))}
          <button className="invite-btn">
            <Users size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="room-content">
        {/* Video Grid */}
        <div className="video-section">
          <div className="video-grid">
            {/* Local Video */}
            <div className="video-container local">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={isVideoOff ? 'hidden' : ''}
              />
              {isVideoOff && (
                <div className="video-placeholder">
                  <span>{participant_name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                </div>
              )}
              <div className="video-label">
                {participant_name} (You)
                {isMuted && <MicOff size={12} />}
              </div>
            </div>

            {/* Remote Participants (would be dynamically populated) */}
            {participants.filter(p => p.id !== participant_id).map(p => (
              <div key={p.id} className="video-container remote">
                <div className="video-placeholder">
                  <span>{p.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                </div>
                <div className="video-label">
                  {p.name}
                  {p.is_muted && <MicOff size={12} />}
                </div>
              </div>
            ))}
          </div>

          {/* Screen Share */}
          {isScreenSharing && (
            <div className="screen-share-container">
              <video ref={screenShareRef} autoPlay playsInline />
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor & Chat */}
        <div className="right-panel">
          <div className="panel-tabs">
            <button 
              className={activeTab === 'code' ? 'active' : ''}
              onClick={() => setActiveTab('code')}
            >
              <Code size={16} />
              Code
            </button>
            <button 
              className={activeTab === 'chat' ? 'active' : ''}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={16} />
              Chat
            </button>
          </div>

          <div className="panel-content">
            {activeTab === 'code' ? (
              <div className="code-editor">
                <div className="editor-header">
                  <span>index.js</span>
                  <span className="language-badge">JavaScript</span>
                </div>
                <textarea 
                  className="code-textarea"
                  placeholder="// Your code here..."
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="chat-panel">
                <div className="messages">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.is_system ? 'system' : ''}`}>
                      {!msg.is_system && (
                        <span className="sender">{msg.participant_name}</span>
                      )}
                      <p>{msg.content}</p>
                      <span className="time">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="room-controls">
        <div className="controls-left">
          <button onClick={toggleMute} className={`control-btn ${isMuted ? 'active danger' : ''}`}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button onClick={toggleVideo} className={`control-btn ${isVideoOff ? 'active danger' : ''}`}>
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
          <button onClick={toggleScreenShare} className={`control-btn ${isScreenSharing ? 'active' : ''}`}>
            {isScreenSharing ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
          </button>
        </div>
        
        <div className="controls-center">
          {role === 'interviewer' && (
            <button onClick={toggleRecording} className={`control-btn record ${isRecording ? 'active' : ''}`}>
              {isRecording ? <Square size={20} /> : <Circle size={20} />}
              {isRecording ? 'Stop' : 'Record'}
            </button>
          )}
          <button onClick={handleLeave} className="control-btn leave">
            <PhoneOff size={20} />
            Leave
          </button>
        </div>

        <div className="controls-right">
          <button className="control-btn">
            <Hand size={20} />
            Raise Hand
          </button>
          <button className="control-btn">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .live-interview-room {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1a1a2e;
          color: white;
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: #0f0f1a;
          border-bottom: 1px solid #2a2a4a;
        }

        .interview-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .interview-title {
          font-weight: 600;
          font-size: 1.125rem;
        }

        .interview-duration {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-variant-numeric: tabular-nums;
          background: #2a2a4a;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .recording-indicator {
          fill: #666;
        }

        .recording-indicator.active {
          fill: #ef4444;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .participant-avatars {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .avatar.interviewer {
          background: #3b82f6;
        }

        .avatar.candidate {
          background: #10b981;
        }

        .invite-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px dashed #4a4a6a;
          background: transparent;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .room-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .video-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 1rem;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .video-container {
          position: relative;
          aspect-ratio: 16/9;
          background: #2a2a4a;
          border-radius: 12px;
          overflow: hidden;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-container video.hidden {
          display: none;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }

        .video-label {
          position: absolute;
          bottom: 0.5rem;
          left: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .screen-share-container {
          flex: 1;
          background: #2a2a4a;
          border-radius: 12px;
          overflow: hidden;
        }

        .screen-share-container video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .right-panel {
          width: 400px;
          display: flex;
          flex-direction: column;
          background: #0f0f1a;
          border-left: 1px solid #2a2a4a;
        }

        .panel-tabs {
          display: flex;
          border-bottom: 1px solid #2a2a4a;
        }

        .panel-tabs button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .panel-tabs button.active {
          color: white;
          background: #1a1a2e;
        }

        .panel-content {
          flex: 1;
          overflow: hidden;
        }

        .code-editor {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #1a1a2e;
          font-size: 0.75rem;
          color: #888;
        }

        .language-badge {
          padding: 0.125rem 0.5rem;
          background: #2a2a4a;
          border-radius: 4px;
        }

        .code-textarea {
          flex: 1;
          padding: 1rem;
          background: #1a1a2e;
          border: none;
          color: #e5e7eb;
          font-family: 'Fira Code', 'Monaco', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          resize: none;
        }

        .code-textarea:focus {
          outline: none;
        }

        .chat-panel {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .chat-message {
          padding: 0.5rem 0.75rem;
          background: #1a1a2e;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .chat-message.system {
          background: transparent;
          color: #888;
          font-style: italic;
          text-align: center;
        }

        .chat-message .sender {
          font-weight: 600;
          color: #3b82f6;
          margin-right: 0.5rem;
        }

        .chat-message .time {
          display: block;
          font-size: 0.6875rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem;
          border-top: 1px solid #2a2a4a;
        }

        .chat-input input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          background: #1a1a2e;
          border: 1px solid #2a2a4a;
          border-radius: 6px;
          color: white;
          font-size: 0.875rem;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .chat-input button {
          padding: 0.5rem 1rem;
          background: #3b82f6;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .room-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #0f0f1a;
          border-top: 1px solid #2a2a4a;
        }

        .controls-left, .controls-center, .controls-right {
          display: flex;
          gap: 0.5rem;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          background: #2a2a4a;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn:hover {
          background: #3a3a5a;
        }

        .control-btn.active {
          background: #3b82f6;
        }

        .control-btn.danger.active {
          background: #ef4444;
        }

        .control-btn.record.active {
          background: #ef4444;
        }

        .control-btn.leave {
          background: #ef4444;
        }

        .control-btn.leave:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}