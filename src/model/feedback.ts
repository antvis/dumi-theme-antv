import { proxy } from 'valtio';

export const feedbackStore = proxy<{
  rating?: string;
  section?: string;
}>({});

export const resetFeedbackState = () => {
  feedbackStore.rating = undefined;
  feedbackStore.section = undefined;
};

export const invokePageFeedback = (like: boolean) => {
  feedbackStore.rating = like ? '1' : '0';
};

export const resetPageFeedback = () => {
  feedbackStore.rating = undefined;
};

export const invokeSectionFeedback = (section: string) => {
  feedbackStore.section = section;
};

export const resetSectionFeedback = () => {
  feedbackStore.section = undefined;
};
