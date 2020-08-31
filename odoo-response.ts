export class OdooResponse {
  result: any;
  statusCode: number;
  sessionId: string;

  constructor(result: any, statusCode: number, newSessionId: string) {
    this.result = result;
    this.statusCode = statusCode;
    this.sessionId = newSessionId;
  }

  hasError(): boolean {
    return this.result.error !== null;
  }

  getError() {
    return this.result.error;
  }
  getSessionId(): string {
    return this.sessionId;
  }

  getErrorMessage() {
    if (this.hasError()) {
      return this.result.error.message;
    }
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getResult() {
    return this.result.result;
  }
}
