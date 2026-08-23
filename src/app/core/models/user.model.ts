export interface FakeStoreUser {
  id: number;
  username: string;
  password: string;
  email: string;
  name: {
    firstname: string;
    lastname: string;
  };
}