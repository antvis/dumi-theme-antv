/**
 * 精品案例
 */
export type ReplayCase = {
  caseId: string;
  query: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
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
