import { StateOperator } from '@ngxs/store';

interface ErrorStateModel {
  error?: any;
}

export function errorStateOperator<T extends ErrorStateModel>(
  error = null
): StateOperator<T> {
  return (state: Partial<ErrorStateModel>) => {
    return {
      ...(state as object),
      error: {
        code: error && error.status ? error.status.toString() : null,
        label: error && error.error ? error.error.ErreurDescription : null
      }
    } as T;
  };
}
