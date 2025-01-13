declare module '@vinejs/vine' {
  export interface Schema {
    type: string
    props: Record<string, any>
  }

  export type InferType<T extends Schema> = any

  export interface VineString extends Schema {
    type: 'string'
    optional(): this
    regex(pattern: RegExp, message?: string | { message: string }): this
  }

  const vine: {
    compile: <T>(schema: Schema) => any
    object: (schema: Record<string, Schema>) => Schema
    string: (options?: {
      trim?: boolean
      escape?: boolean
      messages?: Record<string, string>
    }) => VineString
  }

  export default vine
}
