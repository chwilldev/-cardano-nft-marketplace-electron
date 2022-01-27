import path from 'path';
import { promises as fsp } from 'fs';
import { useEffect, useState } from 'react';
import {
  InputGroup,
  FormControl,
  Button,
  Modal,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import DirectoryInput from '../components/DirectoryInput';
import Spinner from '../components/Spinner';
import { randomHex } from '../../shared/crypto';
import { R, M } from '../../shared/events';

export default function GenerateRandomImage() {
  const [inputDirectory, setInputDirectory] = useState('E:\\temp\\input');
  const [outputDirectory, setOutputDirectory] = useState('E:\\temp\\output');
  const [policyId, setPolicyId] = useState(randomHex(52));
  const [numberOfImages, setNumberOfImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewGenerating, setPreviewGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImgSrc, setPreviewImgSrc] = useState('');
  const [previewMetaJson, setPreviewMetaJson] = useState('');

  const handleInputDirectoryChange = async (value: string) => {
    setInputDirectory(value);
  };

  useEffect(() => {
    return R.generatedRandomImages.register((_event, { success }) => {
      if (!success) {
        setLoading(false);
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
            setLoading(false);
            setPreviewGenerating(false);
            setPreviewOpen(true);
            return true;
          })
          .catch(() => {
            toast.error('Cannot read meta file');
          });
      } else {
        setLoading(false);
        toast.success(
          `Generated ${numberOfImages} images into ${outputDirectory}`
        );
      }
    });
  }, [outputDirectory, numberOfImages, previewGenerating]);

  const handleClickPreview = async () => {
    M.generateRandomImages.send({
      images: inputDirectory,
      policyId,
      output: {
        meta: outputDirectory,
        images: outputDirectory,
      },
      numberOfImages: 1,
    });
    setPreviewGenerating(true);
    setLoading(true);
  };

  const handleClickGenerate = () => {
    M.generateRandomImages.send({
      images: inputDirectory,
      policyId,
      output: {
        meta: outputDirectory,
        images: outputDirectory,
      },
      numberOfImages,
    });
    setLoading(true);
  };

  return (
    <div className="container-fluid position-relative">
      {loading && <Spinner />}
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
              <Form.Label>Policy Id</Form.Label>
              <InputGroup>
                <Button onClick={() => setPolicyId(randomHex(56))}>
                  Random
                </Button>
                <FormControl
                  placeholder="policyId"
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                />
              </InputGroup>
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
