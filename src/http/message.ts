export interface BaseMessageInterface<T> {
  data?: T
  error?: {
    message: string
    name: string
  }
  type: string
}

export class BaseMessage<T> {
  private data: T
  private error?: Error
  private type = ''

  constructor(data: T, errorOrType: Error | string) {
    this.data = data
    if (errorOrType instanceof Error) this.error = errorOrType as Error
    else this.type = errorOrType as string
  }

  toJSON(): BaseMessageInterface<T> {
    return this.error
      ? {
          error: { message: this.error.message, name: this.error.name },
          type: 'error',
        }
      : { data: this.data, type: this.type }
  }

  static fromJSON<T>(json: BaseMessageInterface<T>): BaseMessage<T> {
    return new BaseMessage<T>(json.data as T, json.error || json.type)
  }
}
