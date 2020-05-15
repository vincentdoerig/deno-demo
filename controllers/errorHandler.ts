interface RequestError extends Error {
  status: number;
}

export default async ({ response }: any, next: any) => {
  try {
    await next();
  } catch (err) {
    const error = err as RequestError;
    response.status = error.status || 500;
    response.body = {
      message: error.message,
    };
  }
};
