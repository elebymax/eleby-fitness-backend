export interface ResponseFormat {
  success: boolean,
  message: string,
  data: any,
  error?: Array<ResponseError> | ResponseError,
  paginate?: Paginate
}

export interface ResponseError {
  code: number,
  message: string
}

export interface Paginate {
  total?: number,
  limit?: number,
  offset?: number
}
