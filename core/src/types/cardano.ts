export type CIP25 = {
  readonly '721': {
    readonly [policyId: string]: {
      readonly name: string;

      readonly image: string | readonly string[];
      readonly mediaType?: string;

      readonly description?: string | readonly string[];
      readonly files?: readonly [
        {
          readonly name: string;
          readonly mediaType: string;
          readonly src: string | readonly string[];
        } & {
          readonly [attribute: string]: string;
        }
      ];
    } & {
      readonly [attribute: string]: string;
    };
  };
};

export type CIP27 = {
  readonly '777': {
    readonly rate: number;
    readonly addr: string | string[];
  };
};
