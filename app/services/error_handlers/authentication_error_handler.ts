import type { ErrorHandler, ErrorContext } from '#types/errors'

export class AuthenticationErrorHandler implements ErrorHandler {
  canHandle(error: any): boolean {
    return error.code === 'E_UNAUTHORIZED_ACCESS' || error.message === 'Unauthorized access'
  }

  handle(_error: Error, context: ErrorContext): void {
    context.response.unauthorized({
      error: 'UNAUTHORIZED',
      message: 'Authentication requise',
    })
  }
}
