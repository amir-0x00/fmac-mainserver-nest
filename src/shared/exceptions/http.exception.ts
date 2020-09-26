interface IResponse {
  lng?: number;
  toast?: boolean;
  msg?: string;
}

// type TResponse = IResponse | string;
/**
 * Defines the base Nest HTTP exception, which is handled by the default
 * Exceptions Handler.
 *
 * @see [Base Exceptions](https://docs.nestjs.com/exception-filters#base-exceptions)
 *
 * @publicApi
 */
export class HttpException extends Error {
  message: any;
  /**
   * Instantiate a plain HTTP Exception.
   *
   * @example
   * `throw new HttpException()`
   *
   * @usageNotes
   * The constructor arguments define the response and the HTTP response status code.
   * - The `response` argument (required) defines the JSON response body.
   * - The `status` argument (required) defines the HTTP Status Code.
   *
   * By default, the JSON response body contains two properties:
   * - `statusCode`: the Http Status Code.
   * - `message`: a short description of the HTTP error by default; override this
   * by supplying a string in the `response` parameter.
   *
   * To override the entire JSON response body, pass an object to the `createBody`
   * method. Nest will serialize the object and return it as the JSON response body.
   *
   * The `status` argument is required, and should be a valid HTTP status code.
   * Best practice is to use the `HttpStatus` enum imported from `nestjs/common`.
   *
   * @param response string or object describing the error condition.
   * @param status HTTP response status code.
   */
  constructor(
    private readonly response: IResponse,
    private readonly status: number,
  ) {
    super();
    this.initMessage();
  }

  public initMessage() {
    if (!this.response && this.constructor) {
      this.message = this.constructor.name
        .match(/[A-Z][a-z]+|[0-9]+/g)
        .join(' ');
    } else {
      this.message = this.response;
    }
  }

  public getResponse(): any {
    return this.response;
  }

  public getStatus(): number {
    return this.status;
  }

  public static createBody(
    objectOrError: any,
    message?: string,
    statusCode?: number,
  ) {
    if (!objectOrError) {
      return { statusCode, message };
    }
    return { statusCode, message: objectOrError, error: message };
  }
}
