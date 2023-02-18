class SQSError extends Error {
  status: number;

  shouldDeleteMessage?: boolean;

  constructor({
    message = 'Error Occurred',
    status = 400,
    shouldDeleteMessage = false,
  }) {
    super(message);
    this.status = status;
    this.message = message;
    this.shouldDeleteMessage = shouldDeleteMessage;
  }
}

export default SQSError;
