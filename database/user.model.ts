export interface IUser {
  _id: string;
  $id?: string;
  clerkId: string;
  accountId?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: string[];
  joinedAt: Date | string;
}

const User = {} as any;
export default User;
