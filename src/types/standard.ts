export type AsyncSuccess<T> = {
  readonly _tag: 'Success';
  readonly result: T;
};

export type AsyncError<E> = {
  readonly _tag: 'Error';
  readonly error: E;
};

export type AsyncResult<T, E> = AsyncSuccess<T> | AsyncError<E>;
