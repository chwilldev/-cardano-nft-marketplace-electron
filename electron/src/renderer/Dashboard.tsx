import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <Link className="btn-link" to="/generate-random-image">
        Generate Random Image
      </Link>
    </div>
  );
}
