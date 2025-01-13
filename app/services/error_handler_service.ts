import type { ErrorHandler, ErrorContext } from '#types/errors'
import { ValidationErrorHandler } from './error_handlers/validation_error_handler.js'
import { ExportErrorHandler } from './error_handlers/export_error_handler.js'
import { DefaultErrorHandler } from './error_handlers/default_error_handler.js'

export class ErrorHandlerService {
  private handlers: ErrorHandler[] = []

  public handle(error: unknown, context: ErrorContext, operation: string): void {
    this.handlers = [
      new ValidationErrorHandler(),
      new ExportErrorHandler(),
      new DefaultErrorHandler(operation),
    ]

    const handler = this.handlers.find((h) => h.canHandle(error))
    handler?.handle(error as Error, context)
  }
}
