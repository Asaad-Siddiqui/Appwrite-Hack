declare module "node-appwrite" {
  export class Client {
    setEndpoint(endpoint: string): this;
    setProject(project: string): this;
    setKey(key: string): this;
    setSession(session: string): this;
  }
  export class TablesDB {
    constructor(client: Client);
    listRows(databaseId: string, tableId: string, queries?: string[]): Promise<any>;
    getRow(databaseId: string, tableId: string, rowId: string, queries?: string[]): Promise<any>;
    createRow(databaseId: string, tableId: string, rowId: string, data: any, permissions?: string[]): Promise<any>;
    updateRow(databaseId: string, tableId: string, rowId: string, data: any, permissions?: string[]): Promise<any>;
    deleteRow(databaseId: string, tableId: string, rowId: string): Promise<any>;
  }
  export class Databases {
    constructor(client: Client);
    listDocuments(databaseId: string, collectionId: string, queries?: string[]): Promise<any>;
    getDocument(databaseId: string, collectionId: string, documentId: string): Promise<any>;
    createDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any>;
    updateDocument(databaseId: string, collectionId: string, documentId: string, data: any): Promise<any>;
    deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<any>;
  }
  export class Account {
    constructor(client: Client);
    create(userId: string, email: string, password: string, name?: string): Promise<any>;
    createEmailPasswordSession(email: string, password: string): Promise<any>;
    get(): Promise<any>;
    deleteSession(sessionId: string): Promise<any>;
  }
  export class Users {
    constructor(client: Client);
    list(queries?: string[]): Promise<any>;
    get(userId: string): Promise<any>;
    create(userId: string, email?: string, phone?: string, password?: string, name?: string): Promise<any>;
    createSession(userId: string): Promise<any>;
    delete(userId: string): Promise<any>;
  }
  export class Storage {
    constructor(client: Client);
    createFile(bucketId: string, fileId: string, file: any): Promise<any>;
  }
  export const ID: {
    unique(): string;
    custom(id: string): string;
  };
  export const Query: {
    equal(attribute: string, values: any[]): string;
    notEqual(attribute: string, values: any[]): string;
    lessThan(attribute: string, values: any[]): string;
    lessThanEqual(attribute: string, values: any[]): string;
    greaterThan(attribute: string, values: any[]): string;
    greaterThanEqual(attribute: string, values: any[]): string;
    search(attribute: string, value: string): string;
    orderDesc(attribute: string): string;
    orderAsc(attribute: string): string;
    limit(limit: number): string;
    offset(offset: number): string;
  };
  export const Permission: any;
  export const Role: any;
}
