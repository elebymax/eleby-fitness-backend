export interface QueryItem {
  first?: number,
  last?: number,
  offset?: number,
  keyword?: string,
  keywords?: Array<{ field: string, value: string }>,
  filters?: Array<{ field: string, operator: string, value: string}>,
  orders?: Array<{ field: string, operator: string }>
}
