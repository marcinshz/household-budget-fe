import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './errorPage.scss';
function ErrorPage() {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 2000)
    }, [])
    return (
        <div className="error-page">
            <h2>Wrong url, redirecting to home screen...</h2>
        </div>
    )
}

export default ErrorPage