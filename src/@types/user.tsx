export type User = {
  id: number;
  nom: string;
  prenom: string;
  login: string;
  password?: string;
  role: ['ADMIN', 'USER'];
  createdAt: string;
  updatedAt: string;
}
