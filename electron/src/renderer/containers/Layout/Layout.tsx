import React, { useCallback, useContext, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import Spinner from '../../components/Spinner';
import { usePrevious } from '../../utils/hooks';
import { ScriptServiceContext } from '../../contexts';
import { ScriptStatus } from '../../../shared/types';

type Props = {
  children: React.ReactNode;
};

const statusMessages: Record<ScriptStatus, string> = {
  paused: 'Paused',
  stopped: 'Stopped',
  running: 'Running',
};
const statusColors: Record<ScriptStatus, string> = {
  paused: 'warning',
  stopped: 'secondary',
  running: 'success',
};

export default function Layout({ children }: Props) {
  const { status, closeCode, currentScript, suspendScript, resumeScript } =
    useContext(ScriptServiceContext);
  const prevStatus = usePrevious(status);

  useEffect(() => {
    if (prevStatus && prevStatus !== status && status === 'stopped') {
      if (closeCode !== 0) {
        toast.error('Something went wrong with script execution!');
      }
    }
  }, [prevStatus, status, closeCode]);

  const handleSuspendScript = useCallback(() => {
    suspendScript();
  }, [suspendScript]);

  const handleResumeScript = useCallback(() => {
    resumeScript();
  }, [resumeScript]);

  return (
    <>
      <Container fluid as="header" className="bg-black text-white p-3">
        <div className="d-flex">
          <Link to="/" className="text-decoration-none">
            <h3 className="text-white">Script Runner</h3>
          </Link>
          <Link to="/" className="ms-auto">
            <Button variant="light">Go to home</Button>
          </Link>
        </div>
        <Row>
          <Col sm={6} md={4}>
            <span>Script:</span>&nbsp;
            {currentScript ? (
              <span className={`text-${statusColors[status]}`}>
                {currentScript}
              </span>
            ) : (
              <span className={`text-${statusColors.stopped}`}>
                No Script Running
              </span>
            )}
          </Col>
          <Col sm={6} md={4}>
            <span>Status:</span>&nbsp;
            <span className={`text-${statusColors[status]}`}>
              {statusMessages[status]}
            </span>
          </Col>
        </Row>
      </Container>
      <main className="position-relative">
        {children}
        {status !== 'stopped' && (
          <Spinner
            controls={
              <div>
                {status === 'running' && (
                  <Button variant="danger" onClick={handleSuspendScript}>
                    Pause
                  </Button>
                )}
                {status === 'paused' && (
                  <Button variant="success" onClick={handleResumeScript}>
                    Resume
                  </Button>
                )}
              </div>
            }
          />
        )}
      </main>
    </>
  );
}
