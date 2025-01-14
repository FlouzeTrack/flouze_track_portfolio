import type { Exporter } from '#types/export'
import { CsvExporter } from './exporters/csv_exporter.js'
import { JsonExporter } from './exporters/json_exporter.js'

export class ExportService {
  private readonly exporters: Map<string, Exporter>

  constructor() {
    this.exporters = new Map([
      ['csv', new CsvExporter()],
      ['json', new JsonExporter()],
    ])
  }

  public getExporter(format: string): Exporter {
    const exporter = this.exporters.get(format.toLowerCase())
    if (!exporter) {
      throw new Error(`Unsupported export format: ${format}`)
    }
    return exporter
  }

  public getSupportedFormats(): string[] {
    return Array.from(this.exporters.keys())
  }
}
