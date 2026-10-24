export interface IAnswer {
  _id: string;
  $id?: string;
  author: any;
  question: any;
  content: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: Date | string;
}

const Answer = {} as any;
export default Answer;
