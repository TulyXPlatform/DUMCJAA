interface ErrorResponseShape {
  message?: string;
}

interface HttpErrorShape {
  response?: {
    data?: ErrorResponseShape;
  };
  message?: string;
}

export const getHttpErrorMessage = (error: unknown, fallback: string): string => {
  const maybeHttpError = error as HttpErrorShape;
  return maybeHttpError.response?.data?.message ?? maybeHttpError.message ?? fallback;
};
