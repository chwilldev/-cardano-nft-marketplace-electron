import { dialog } from '@electron/remote';
import { useCallback } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
};

const foolOnChange = () => undefined;

export default function SaveFileInput({ name, value, onChange }: Props) {
  const handleClickBrowse = useCallback(
    async function handleClickBrowse() {
      const { filePath } = await dialog.showSaveDialog({
        properties: ['createDirectory'],
      });

      if (!filePath) return;

      onChange(filePath);
    },
    [onChange]
  );

  return (
    <InputGroup>
      <Button
        type="button"
        variant="outline-secondary"
        onClick={handleClickBrowse}
      >
        Browse
      </Button>
      <FormControl
        type="text"
        readOnly
        name={name}
        value={value}
        onChange={foolOnChange}
      />
    </InputGroup>
  );
}
