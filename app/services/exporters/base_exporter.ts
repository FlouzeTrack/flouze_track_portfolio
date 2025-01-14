import type { ExportResult, ExportOptions, Exporter } from '#types/export'
import type { TransactionExport } from '#types/wallet'

export abstract class BaseExporter implements Exporter {
  abstract getSupportedFormat(): string
  abstract getContentType(): string
  abstract getFileExtension(): string
  abstract formatContent(data: TransactionExport[]): string

  public async export(data: TransactionExport[], options: ExportOptions): Promise<ExportResult> {
    const content = this.formatContent(data)
    const filename = this.generateFilename(options)

    return {
      content,
      contentType: this.getContentType(),
      filename,
    }
  }

  protected generateFilename(options: ExportOptions): string {
    return `wallet-${options.address}.${this.getFileExtension()}`
  }
}
