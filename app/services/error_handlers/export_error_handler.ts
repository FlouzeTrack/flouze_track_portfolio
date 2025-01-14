import { HttpContext } from '@adonisjs/core/http'
import type { ErrorHandler } from '#types/errors'

export class ExportErrorHandler implements ErrorHandler {
  canHandle(error: unknown): boolean {
    return error instanceof Error && error.message.includes('Unsupported export format')
  }

  handle(error: Error, { response }: HttpContext): void {
    response.status(400).json({
      error: 'Invalid format',
      message: error.message,
    })
  }
}
