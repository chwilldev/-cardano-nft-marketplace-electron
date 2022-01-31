import path from 'path';
import { promises as fsp } from 'fs';
import { useContext, useEffect, useState } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import DirectoryInput from '../../components/DirectoryInput';
import PolicyIdInput from '../../components/PolicyIdInput';
import { randomPolicyId } from '../../../shared/crypto';
import { EnvironmentContext } from '../../contexts';
import { useScriptService } from '../../utils/hooks';

export default function GenerateRandomImage() {
  const env = useContext(EnvironmentContext);
  const { startScript, registerScriptClosed } = useScriptService();

  const [inputDirectory, setInputDirectory] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('');
  const [policyId, setPolicyId] = useState(randomPolicyId());
  const [policyName, setPolicyName] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(10);
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState('');
  const [previewMetaJson, setPreviewMetaJson] = useState('');

  const handleInputDirectoryChange = async (value: string) => {
    setInputDirectory(value);
  };

  useEffect(() => {
    setInputDirectory(path.join(env.storagePath, 'images'));
    setOutputDirectory(path.join(env.storagePath, 'output'));
  }, [env]);

  useEffect(() => {
    return registerScriptClosed((_event, { code, script }) => {
      if (script !== 'generate-random-image') {
        return;
      }

      if (code !== 0) {
        setPreviewGenerating(false);
        toast.error(
          'Error ocurred while generating a random image. The input might be invalid.'
        );
        return;
      }

      if (previewGenerating) {
        Promise.all([
          fsp.readFile(path.join(outputDirectory, '0000.json'), {
            encoding: 'utf-8',
          }),
          fsp.readFile(path.join(outputDirectory, '0000.png')),
        ])
          .then(([metaContent, image]) => {
            setPreviewMetaJson(
              JSON.stringify(JSON.parse(metaContent), null, 2)
            );
            setPreviewImgSrc(
              `data:image/png;base64,${image.toString('base64')}`
            );
            setPreviewGenerating(false);
            setPreviewOpen(true);
            return true;
          })
          .catch(() => {
            toast.error('Cannot read meta file');
          });
      } else {
        toast.success(
          `Generated ${numberOfImages} images into ${outputDirectory}`
        );
      }
    });
  }, [
    outputDirectory,
    numberOfImages,
    previewGenerating,
    registerScriptClosed,
  ]);

  const handleClickPreview = async () => {
    startScript({
      script: 'generate-random-image',
      inputData: {
        images: inputDirectory,
        policyId,
        policyName,
        output: {
          meta: outputDirectory,
          images: outputDirectory,
        },
        numberOfImages: 1,
      },
    });

    setPreviewGenerating(true);
  };

  const handleClickGenerate = () => {
    startScript({
      script: 'generate-random-image',
      inputData: {
        images: inputDirectory,
        policyId,
        policyName,
        output: {
          meta: outputDirectory,
          images: outputDirectory,
        },
        numberOfImages,
      },
    });
  };

  return (
    <div className="container-fluid position-relative pt-3">
      <h1>Generate Random Image</h1>
      <form>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <Form.Label>Input Directory</Form.Label>
              <DirectoryInput
                name="inputDirectory"
                value={inputDirectory}
                onChange={handleInputDirectoryChange}
              />
            </div>
            <div className="mb-2">
              <Form.Label>Policy Name</Form.Label>
              <Form.Control
                type="text"
                name="policyName"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <Form.Label>Policy Id</Form.Label>
              <PolicyIdInput value={policyId} onChange={setPolicyId} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              <Form.Label>Number Of Images</Form.Label>
              <input
                type="number"
                className="form-control"
                name="numberOfImages"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(Number(e.target.value))}
              />
            </div>
            <div className="mb-2">
              <Form.Label>Output Directory</Form.Label>
              <DirectoryInput
                name="outputDirectory"
                value={outputDirectory}
                onChange={setOutputDirectory}
              />
            </div>
          </div>
        </div>
        <div className="d-flex">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClickPreview}
          >
            Preview
          </button>
          <button
            type="button"
            className="btn btn-primary ms-auto"
            onClick={handleClickGenerate}
          >
            Generate
          </button>
        </div>
      </form>
      <Modal show={previewOpen} onHide={() => setPreviewOpen(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Preview NFT Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xl={6}>
              <img src={previewImgSrc} alt="Preview Item" />
            </Col>
            <Col xl={6}>
              <SyntaxHighlighter language="json" style={docco}>
                {previewMetaJson}
              </SyntaxHighlighter>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
