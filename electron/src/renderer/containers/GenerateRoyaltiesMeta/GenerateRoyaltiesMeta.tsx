import { promises as fsp } from 'fs';

import { useEffect, useState, useCallback } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

import SaveFileInput from '../../components/SaveFileInput';
import PolicyIdInput from '../../components/PolicyIdInput';

import { randomPolicyId } from '../../../shared/crypto';
import { useScriptService } from '../../utils/hooks';

export default function GenerateRoyaltiesMeta() {
  const { startScript, registerScriptClosed } = useScriptService();

  const [rate, setRate] = useState<number>(10);
  const [policyId, setPolicyId] = useState<string>(randomPolicyId());
  const [output, setOutput] = useState<string>('');
  const [addr, setAddr] = useState<string>(
    'addr1q8g3dv6ptkgsafh7k5muggrvfde2szzmc2mqkcxpxn7c63l9znc9e3xa82h, pf39scc37tcu9ggy0l89gy2f9r2lf7husfvu8wh'
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [metaJson, setMetaJson] = useState<string>('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const inputAddr = addr.split(',').map((item) => item.trim());

      startScript({
        script: 'generate-cip-0027-meta',
        inputData: {
          policyId,
          rate: rate / 100,
          addr: inputAddr.length === 0 ? inputAddr[0] : inputAddr,
          output,
        },
      });
    },
    [startScript, policyId, addr, rate, output]
  );

  useEffect(() => {
    return registerScriptClosed(async (_event, { script }) => {
      if (script !== 'generate-cip-0027-meta') {
        return;
      }

      const buffer = await fsp.readFile(output, { encoding: 'utf8' });
      setMetaJson(JSON.stringify(JSON.parse(buffer), null, 2));
      setModalOpen(true);
    });
  }, [output, registerScriptClosed]);

  return (
    <Container fluid className="pt-3">
      <h1>Generate Royalties Meta</h1>
      <Form onSubmit={handleSubmit}>
        <div className="mb-2">
          <Form.Label>Policy</Form.Label>
          <PolicyIdInput value={policyId} onChange={setPolicyId} />
        </div>
        <div className="mb-2">
          <Form.Label>Rate</Form.Label>
          <Form.Control
            type="number"
            name="rate"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
          <Form.Text className="text-muted">
            Please input royalty rate in percent. For example 32.21
          </Form.Text>
        </div>
        <div className="mb-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="addr"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
          <Form.Text className="text-muted">
            Please input addresses separated by comma. For example
            addr1q8g3dv6ptkgsafh7k5muggrvfde2szzmc2mqkcxpxn7c63l9znc9e3xa82h,&nbsp;pf39scc37tcu9ggy0l89gy2f9r2lf7husfvu8wh
          </Form.Text>
        </div>
        <div className="mb-2">
          <Form.Label>Output</Form.Label>
          <SaveFileInput name="output" value={output} onChange={setOutput} />
        </div>
        <div className="mb-2">
          <Button type="submit">Generate</Button>
        </div>
      </Form>
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>777 Meta JSON</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SyntaxHighlighter language="json" style={docco}>
            {metaJson}
          </SyntaxHighlighter>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
