import { BaseExporter } from './base_exporter.js'
import type { TransactionExport } from '#types/wallet'

export class CsvExporter extends BaseExporter {
  public getSupportedFormat(): string {
    return 'csv'
  }

  public getContentType(): string {
    return 'text/csv'
  }

  public getFileExtension(): string {
    return 'csv'
  }

  public formatContent(data: TransactionExport[]): string {
    const headers = ['Hash', 'Date', 'From', 'To', 'Value', 'Currency', 'Gas Used', 'Status']
    const rows = data.map((tx) => [
      tx.hash,
      tx.date,
      tx.from,
      tx.to,
      tx.value,
      tx.currency,
      tx.gasUsed,
      tx.status,
    ])

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  }
}
