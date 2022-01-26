import { Link } from 'react-router-dom';

type Props = {};

export default function Dashboard({}: Props) {
  return (
    <div className="container-fluid">
      <Link className="btn-link" to="/generate-random-image">
        Generate Random Image
      </Link>
    </div>
  );
}
