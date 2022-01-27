import { useState } from 'react';
import DirectoryInput from 'renderer/components/DirectoryInput';
import Spinner from 'renderer/components/Spinner';
import {
  Layer,
} from '../../../../scripts/generate-random-image';
import { R, M } from '../../shared/events';

type Props = {};

export default function GenerateRandomImage({}: Props) {
  const [inputDirectory, setInputDirectory] = useState('');
  const [outputDirectory, setOutputDirectory] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [layers, setLayers] = useState<readonly Layer[]>([]);

  const handleInputDirectoryChange = async (value: string) => {
    setInputDirectory(value);
    setScanning(true);

    M.scanImages.send({ directory: value });
    R.scannedImages.register((_event, { layers }) => {
      setScanning(false);
      setLayers(layers);
      console.log({ layers });
    });
    // const scanResult = await scan(value);
    // setLayers(scanResult.result);
    // setScanning(false);
  };

  return (
    <div className="container-fluid position-relative">
      {scanning && <Spinner />}
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
              <input
                type="text"
                className="form-control"
                name="policyId"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              <label>Number Of Images</label>
              <input
                type="number"
                className="form-control"
                name="numberOfImages"
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
        <div>
          <button className="btn btn-primary">Generate</button>
        </div>
      </form>
    </div>
  );
}
