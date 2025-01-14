import type { HttpContext } from '@adonisjs/core/http'
import type { ValidationError } from '@vinejs/vine'
import type { ErrorHandler } from '#types/errors'

export class ValidationErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof Error && 'messages' in error
  }

  handle(error: ValidationError, { response }: HttpContext): void {
    response.status(400).json({
      error: 'Validation failure',
      message: error.messages[0]?.message || 'Validation failed',
      errors: error.messages,
    })
  }
}
