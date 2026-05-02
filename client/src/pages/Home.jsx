import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import Header from '../components/Header'

function Home() {
    const [meetingId, setMeetingId] = useState('')
    const [generatedLink, setGeneratedLink] = useState('')
    const navigate = useNavigate()

    const startInstantMeeting = () => {
        navigate(`/${uuidV4()}`)
    }

    const getShareableLink = () => {
        const id = uuidV4()
        setGeneratedLink(`${window.location.origin}/${id}`)
    }

    const joinMeeting = (e) => {
        e.preventDefault()
        if (meetingId.trim()) {
            navigate(`/${meetingId.trim()}`)
        }
    }

    return (
        <div className="app">
            <Header />

            <main className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="">
                        <h1>Premium video meetings. Now free for everyone.</h1>
                        <p>
                            We re-engineered the service we built for secure business
                            meetings, Google Meet, to make it free and available for all.
                        </p>

                        <div className="dropdown" style={{ display: 'inline-block' }}>
                            <button
                                className="btn btn-custom"
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="fas fa-video"></i> New meeting
                            </button>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <button
                                    className="dropdown-item"
                                    onClick={getShareableLink}
                                >
                                    <i className="fas fa-paperclip"></i> Get link to share
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={startInstantMeeting}
                                >
                                    <i className="fas fa-plus"></i> Start instant meeting
                                </button>
                            </div>
                        </div>

                        {generatedLink && (
                            <div className="mt-2">
                                <small className="text-muted">Share this link: </small>
                                <a href={generatedLink}>{generatedLink}</a>
                            </div>
                        )}

                        <form
                            id="joinMeeting"
                            onSubmit={joinMeeting}
                            style={{ display: 'inline' }}
                        >
                            <input
                                type="text"
                                className="input-group input-custom pt-1 pb-2"
                                placeholder="Enter meeting ID"
                                value={meetingId}
                                onChange={(e) => setMeetingId(e.target.value)}
                            />
                            <button className="btn btn-custom" type="submit">
                                Join
                            </button>
                        </form>
                    </div>

                    <div className="p-4 w-100">
                        <div className="tablet p-4">
                            <img
                                src="/img/tablet.jpg"
                                className="img-fluid rounded mx-auto d-block"
                                alt="tablet"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
