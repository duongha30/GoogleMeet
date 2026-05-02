import { Link } from 'react-router-dom'
import Header from '../components/Header'

function EndPage() {
    return (
        <div className="app">
            <Header />
            <main className="d-flex justify-content-center align-items-center mt-5">
                <div className="text-center">
                    <h2>You left the meeting</h2>
                    <Link className="btn btn-custom" to="/">
                        Return to home
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default EndPage
