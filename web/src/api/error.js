const Status = {
  unknown: 'UNKNOWN',
  notFound: 'NOT_FOUND',
};

class ApiError extends Error {
  constructor(message, { status = Status.unknown } = {}) {
    super(message);
    this.status = status;
  }
}

export { Status, ApiError };
