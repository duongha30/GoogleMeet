import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Peer from 'peerjs'

const SOCKET_SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'
const PEER_HOST = import.meta.env.VITE_PEER_HOST || 'localhost'
const PEER_PORT = import.meta.env.VITE_PEER_PORT || 3001

function Room() {
    const { roomId } = useParams()
    const navigate = useNavigate()

    const [isMuted, setIsMuted] = useState(false)
    const [isCamOff, setIsCamOff] = useState(false)
    const [chatOpen, setChatOpen] = useState(true)
    const [activeTab, setActiveTab] = useState('chat')
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')

    const localVideoContainerRef = useRef(null)
    const videoGridRef = useRef(null)
    const messTxtRef = useRef(null)
    const peersRef = useRef({})
    const streamRef = useRef(null)
    const socketRef = useRef(null)
    const peerRef = useRef(null)
    const peerIdRef = useRef(null)

    useEffect(() => {
        const socket = io(SOCKET_SERVER)
        socketRef.current = socket

        const peer = new Peer(undefined, {
            host: PEER_HOST,
            port: PEER_PORT,
            path: '/',
        })
        peerRef.current = peer

        function addVideoToGrid(container, video, stream) {
            video.srcObject = stream
            video.addEventListener('loadedmetadata', () => video.play())
            container.appendChild(video)
        }

        function connectToNewUser(userId, stream) {
            const call = peer.call(userId, stream)
            const video = document.createElement('video')
            call.on('stream', (userVideoStream) => {
                addVideoToGrid(videoGridRef.current, video, userVideoStream)
            })
            call.on('close', () => video.remove())
            peersRef.current[userId] = call
        }

        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then((stream) => {
                streamRef.current = stream

                const myVideo = document.createElement('video')
                myVideo.muted = true
                myVideo.id = 'localStream'
                addVideoToGrid(localVideoContainerRef.current, myVideo, stream)

                peer.on('open', (id) => {
                    peerIdRef.current = id
                    socket.emit('JOIN_ROOM', roomId, id)
                })

                socket.on('USER_CONNECTED', (userId) => {
                    connectToNewUser(userId, stream)
                })

                peer.on('call', (call) => {
                    call.answer(stream)
                    const video = document.createElement('video')
                    call.on('stream', (userVideoStream) => {
                        addVideoToGrid(videoGridRef.current, video, userVideoStream)
                    })
                })
            })
            .catch((err) => console.error('Failed to get media stream:', err))

        socket.on('USER_DISCONNECT', (userId) => {
            if (peersRef.current[userId]) peersRef.current[userId].close()
        })

        socket.on('SHOW_TEXT', (id, text) => {
            const userId = id.slice(9, 13)
            setMessages((prev) => [...prev, { id: Date.now(), userId, text }])
        })

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }
            socket.disconnect()
            peer.destroy()
        }
    }, [roomId])

    useEffect(() => {
        if (messTxtRef.current) {
            messTxtRef.current.scrollTop = messTxtRef.current.scrollHeight
        }
    }, [messages])

    const toggleMute = useCallback(() => {
        if (!streamRef.current) return
        const audioTrack = streamRef.current.getAudioTracks()[0]
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
    }, [])

    const toggleCam = useCallback(() => {
        if (!streamRef.current) return
        const videoTrack = streamRef.current.getVideoTracks()[0]
        videoTrack.enabled = !videoTrack.enabled
        setIsCamOff(!videoTrack.enabled)
    }, [])

    const stopCalling = useCallback(() => {
        navigate('/stop')
    }, [navigate])

    const sendMessage = useCallback(() => {
        if (!inputText || !socketRef.current || !peerIdRef.current) return
        socketRef.current.emit('SEND_TEXT', peerIdRef.current, inputText)
        setInputText('')
    }, [inputText])

    const handleKeyUp = useCallback(
        (e) => {
            if (e.key === 'Enter' && inputText) {
                sendMessage()
            }
        },
        [inputText, sendMessage]
    )

    return (
        <main className="d-flex">
            <form id="localCamContainer" onSubmit={(e) => e.preventDefault()}>
                <div id="localVideo" ref={localVideoContainerRef}>
                    {!chatOpen && (
                        <div id="extension">
                            <button
                                className="btn btn-custom"
                                id="openChat"
                                onClick={() => setChatOpen(true)}
                            >
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                    )}
                    <div className="wrap-btn-call">
                        <button className="btn-call" id="audioCall" onClick={toggleMute}>
                            {isMuted ? (
                                <i className="fas fa-microphone-slash"></i>
                            ) : (
                                <i className="fas fa-microphone"></i>
                            )}
                        </button>
                        <button className="btn-call stopCall" onClick={stopCalling}>
                            <i className="fas fa-phone-alt"></i>
                        </button>
                        <button className="btn-call" id="webCam" onClick={toggleCam}>
                            {isCamOff ? (
                                <i className="fas fa-video-slash"></i>
                            ) : (
                                <i className="fas fa-video"></i>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div
                id="user-container"
                style={{
                    width: chatOpen ? '35vw' : '0vw',
                    transitionDuration: '500ms',
                }}
            >
                <div className="d-flex" id="options">
                    <div id="hideChat" onClick={() => setChatOpen(false)}>
                        <img src="/img/caret.svg" alt="" />
                    </div>
                    <div
                        className="option"
                        id="option1"
                        onClick={() => setActiveTab('chat')}
                    >
                        <img src="/img/chat.svg" alt="" />
                    </div>
                    <div
                        className="option ml-1"
                        id="option2"
                        onClick={() => setActiveTab('video')}
                    >
                        <img src="/img/camera.svg" alt="" />
                    </div>
                </div>

                <div id="chat" style={{ display: activeTab === 'chat' ? 'block' : 'none' }}>
                    <div id="messTxt" className="overflow-auto" ref={messTxtRef}>
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                <h6 style={{ fontWeight: 'bold', marginBottom: 0 }}>
                                    user {msg.userId}
                                </h6>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex" id="boxTxt">
                        <input
                            type="text"
                            id="inputTxt"
                            placeholder="...Message"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyUp={handleKeyUp}
                        />
                        <button id="sendTxt" onClick={sendMessage}>
                            <img src="/img/send.svg" alt="" />
                        </button>
                    </div>
                </div>

                <div
                    className="overflow-auto"
                    id="video-grid"
                    ref={videoGridRef}
                    style={{ display: activeTab === 'video' ? 'block' : 'none' }}
                ></div>
            </div>
        </main>
    )
}

export default Room
