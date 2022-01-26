type Props = {};

export default function GenerateRandomImage({}: Props) {
  return (
    <div className="container-fluid">
      <h1>Generate Random Image</h1>
      <form>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <label>Input Directory</label>
              <div className="input-group mb-3">
                <button type="button" className="btn btn-outline-secondary">
                  Browse
                </button>
                <input
                  type="text"
                  className="form-control"
                  name="inputDirectory"
                />
              </div>
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
              <div className="input-group mb-3">
                <button type="button" className="btn btn-outline-secondary">
                  Browse
                </button>
                <input
                  type="text"
                  className="form-control"
                  name="outputDirectory"
                />
              </div>
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
