declare module '@vinejs/vine' {
  import { Schema, InferType } from '@vinejs/vine'

  const vine: {
    compile: <T>(schema: Schema) => T
    object: (schema: object) => Schema
    string: (options?: object) => Schema
  }

  export default vine
  export type { Schema, InferType }
}
