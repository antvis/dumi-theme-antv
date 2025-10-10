/**
 * 精品案例
 */
export type ReplayCase = {
  caseId: string;
  caseTags: string;
  query: string;
  description: string;
  source: string;
  imageUrls: string[];
  link: string; // planId
  analysis_template: unknown;
  tag: string;
};

export type FormProps<T> = {
  value?: T;
  onChange?: (value: T) => void;
}
