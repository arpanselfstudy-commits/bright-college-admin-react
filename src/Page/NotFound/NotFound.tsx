import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrap">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-desc">The page you're looking for doesn't exist or has been moved.</p>
      <button className="not-found-btn" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
