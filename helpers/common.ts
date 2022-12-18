export class ConnectRefuse extends Error {
  constructor(message?: string) {
    super(message || 'Connect api refuse');
    this.name = 'ConnectRefuse';
  }
}

export class Unauthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
  }
}

export class FetchError extends Error {
  payload: unknown;
  constructor(message: string, payload: unknown) {
    super(message);
    this.name = 'Unauthorized';
    this.payload = payload;
  }
}
