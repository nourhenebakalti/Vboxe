export interface RequestCodeError {
  code: number;
  errorMessage: string;
}

export const errorCodes: RequestCodeError[] = [
  {
    code: 400,
    errorMessage: 'GLOBAL.ERROR.400'
  },
  {
    code: 401,
    errorMessage: 'GLOBAL.ERROR.401'
  },
  {
    code: 403,
    errorMessage: 'GLOBAL.ERROR.403'
  },
  {
    code: 404,
    errorMessage: 'GLOBAL.ERROR.404'
  },
  {
    code: 500,
    errorMessage: 'GLOBAL.ERROR.500'
  },
  {
    code: 504,
    errorMessage: 'GLOBAL.ERROR.504'
  }
];

export const getMessageError = (code: number): string => {
  const findError = errorCodes.find(error => error.code === code);
  const message = findError ? findError.errorMessage : 'GLOBAL.ERROR.DEFAULT';

  return message;
};
