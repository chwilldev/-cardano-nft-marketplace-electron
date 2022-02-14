import { Link } from 'react-router-dom';

import { ListGroup, ListGroupItem } from 'react-bootstrap';

export default function Dashboard() {
  return (
    <div className="container-fluid d-flex flex-column pt-3">
      <ListGroup>
        <ListGroupItem
          action
          variant="light"
          to="/generate-random-image"
          as={Link}
        >
          Generate Random Image
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
