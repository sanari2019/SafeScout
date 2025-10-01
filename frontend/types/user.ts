export type UserRole = 'BUYER' | 'SCOUT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  rating?: number;
}
