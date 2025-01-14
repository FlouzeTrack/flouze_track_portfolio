declare module '@vinejs/vine' {
  export interface VineSchema {
    type: string
    props: Record<string, any>
  }

  export interface VineInfer<T> {
    _output: T
  }

  export interface ValidationError extends Error {
    messages: ValidationErrorMessage[]
  }

  export interface ValidationErrorMessage {
    message: string
    field: string
    rule: string
  }

  export interface ValidationErrorResponse {
    error: 'Validation failure'
    message: string
    errors?: ValidationErrorMessage[]
  }

  const vine: {
    compile: <T>(schema: any) => {
      validate: (data: any) => Promise<T>
    }
    enum: (values: Record<string, string>) => any
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
