export interface ITag {
  _id: string;
  $id?: string;
  name: string;
  description: string;
  questions: string[];
  followers: string[];
  createdOn: Date | string;
}

const Tag = {} as any;
export default Tag;
