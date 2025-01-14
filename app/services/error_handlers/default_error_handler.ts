import type { ErrorHandler } from '#types/errors'
import { HttpContext } from '@adonisjs/core/http'

export class DefaultErrorHandler implements ErrorHandler {
  constructor(private operation: string) {}

  canHandle(): boolean {
    return true
  }

  handle(error: Error, { response }: HttpContext): void {
    response.status(500).json({
      error: `Failed to ${this.operation}`,
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
