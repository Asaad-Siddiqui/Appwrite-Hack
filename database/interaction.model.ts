export interface IInteraction {
  _id: string;
  $id?: string;
  user: string;
  action: string;
  question?: string;
  answer?: string;
  tags?: string[];
  createdAt: Date | string;
}

const Interaction = {} as any;
export default Interaction;
