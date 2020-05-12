export interface User {
  id?: string,
  name?: string,
  email?: string,
  password?: string,
  createdAt?: string,
  updatedAt?: string,
  deletedAt?: string
}

export interface UserWithToken extends User {
  token?: string,
}
