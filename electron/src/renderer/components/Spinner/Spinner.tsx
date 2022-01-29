import React from 'react';

type Props = {
  controls?: React.ReactNode;
};

export default function Spinner({ controls }: Props) {
  return (
    <div
      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgb(0, 0, 0, 0.2)',
        zIndex: 1000,
        top: 0,
      }}
    >
      <div>
        <div className="d-flex justify-content-center mb-2">
          <div className="spinner-border" role="status" />
        </div>
        {controls && <div className="d-flex">{controls}</div>}
      </div>
    </div>
  );
}

Spinner.defaultProps = {
  controls: null,
};
