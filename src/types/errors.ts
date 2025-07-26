export interface HttpErrorData<T = CustomErrorIssues> {
  status: number;
  message: string;
  issues?: T;
}

export type DescriptiveHttpErrorData = Pick<
  HttpErrorData,
  'message' | 'issues'
>;

export type PartialDescriptiveHttpErrorData = Partial<DescriptiveHttpErrorData>;

export type CustomErrorIssues = Record<string, unknown>[] | string[];
