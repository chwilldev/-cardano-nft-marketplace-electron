import { dialog } from '@electron/remote';

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
};

export default function DirectoryInput({ name, value, onChange }: Props) {
  async function handleClickBrowse() {
    const path = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    onChange(path.filePaths[0]);
  }

  return (
    <div className="input-group">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleClickBrowse}
      >
        Browse
      </button>
      <input
        type="text"
        className="form-control"
        name={name}
        value={value}
        onChange={() => {}}
      />
    </div>
  );
}
