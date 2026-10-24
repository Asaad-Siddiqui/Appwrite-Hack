export interface IQuestion {
  _id: string;
  $id?: string;
  title: string;
  content: string;
  tags: any[];
  views: number;
  upvotes: string[];
  downvotes: string[];
  author: any;
  answers: any[];
  createdAt: Date | string;
}

const Question = {} as any;
export default Question;
