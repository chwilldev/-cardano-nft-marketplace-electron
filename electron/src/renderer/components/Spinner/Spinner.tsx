type Props = {};

export default function Spinner({}: Props) {
  return (
    <div
      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: 'rgb(0, 0, 0, 0.2)',
        zIndex: 1000,
      }}
    >
      <div className="spinner-border" role="status"></div>
    </div>
  );
}
