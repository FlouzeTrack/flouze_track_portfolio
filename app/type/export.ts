import type { TransactionExport } from './wallet.ts'

export interface ExportResult {
  content: string
  contentType: string
  filename: string
}

export interface ExportOptions {
  address: string
  filename?: string
}

export interface Exporter {
  export(data: TransactionExport[], options: ExportOptions): Promise<ExportResult>
  getSupportedFormat(): string
  getContentType(): string
  getFileExtension(): string
}
