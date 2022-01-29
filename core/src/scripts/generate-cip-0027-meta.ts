import { promises as fsp } from 'fs';

import { CIP27 } from 'types/cardano';
import * as processUtils from '../utils/process';

type InputData = {
  policyId: string;
  rate: number;
  addr: string | string[];
  output: string;
};

async function main({ policyId, rate, addr, output }: InputData) {
  const meta: CIP27 = {
    '777': {
      [policyId]: {
        rate,
        addr,
      },
    },
  };

  await fsp.writeFile(output, JSON.stringify(meta));
}

processUtils.getInputData<InputData>().then((res) => {
  if (res._tag !== 'Success') {
    process.exit(1);
  }

  main(res.result);
});
