import { InputGroup, Button, FormControl } from 'react-bootstrap';

import { randomPolicyId } from '../../../shared/crypto';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function PolicyIdInput({ value, onChange }: Props) {
  return (
    <InputGroup>
      <Button onClick={() => onChange(randomPolicyId())}>Random</Button>
      <FormControl
        placeholder="policyId"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
