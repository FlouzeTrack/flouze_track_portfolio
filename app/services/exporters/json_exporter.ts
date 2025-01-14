import { BaseExporter } from './base_exporter.js'
import type { TransactionExport } from '#types/wallet'

export class JsonExporter extends BaseExporter {
  public getSupportedFormat(): string {
    return 'json'
  }

  public getContentType(): string {
    return 'application/json'
  }

  public getFileExtension(): string {
    return 'json'
  }

  public formatContent(data: TransactionExport[]): string {
    return JSON.stringify(data, null, 2)
  }
}
