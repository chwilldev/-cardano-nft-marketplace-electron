import { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

import DirectoryInput from '../components/DirectoryInput';
import Spinner from '../components/Spinner';
import { randomHex } from '../../shared/crypto';
import { R, M } from '../../shared/events';

export default function GenerateRandomImage() {
  const [inputDirectory, setInputDirectory] = useState('E:\\temp\\input');
  const [outputDirectory, setOutputDirectory] = useState('E:\\temp\\output');
  const [policyId, setPolicyId] = useState(randomHex(52));
  const [numberOfImages, setNumberOfImages] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleInputDirectoryChange = async (value: string) => {
    setInputDirectory(value);
  };

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
    setLoading(true);

    R.generatedRandomImages.register((_event, { success }) => {
      setLoading(false);
      console.log({ success });
    });
  };

  return (
    <div className="container-fluid position-relative">
      {loading && <Spinner />}
      <h1>Generate Random Image</h1>
      <form>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <label>Input Directory</label>
              <DirectoryInput
                name="inputDirectory"
                value={inputDirectory}
                onChange={handleInputDirectoryChange}
              />
            </div>
            <div className="mb-2">
              <label>Policy Id</label>
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
              <label>Number Of Images</label>
              <input
                type="number"
                className="form-control"
                name="numberOfImages"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label>Output Directory</label>
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
          <button type="button" className="btn btn-primary ms-auto">
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}
