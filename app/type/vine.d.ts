declare module '@vinejs/vine' {
  export interface VineSchema {
    type: string
    props: Record<string, any>
  }

  export interface VineInfer<T> {
    _output: T
  }

  export class ValidationError extends Error {
    messages: any[]
  }

  const vine: {
    compile: <T>(schema: any) => {
      validate: (data: any) => Promise<T>
    }
    object: (schema: Record<string, any>) => any
    string: (options?: {
      trim?: boolean
      escape?: boolean
      messages?: Record<string, string>
    }) => any
    infer: <T>(validator: T) => T extends VineInfer<infer U> ? U : never
    errors: {
      ValidationError: typeof ValidationError
    }
  }

  export default vine
}
