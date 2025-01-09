import { proxy } from 'valtio';

export const feedbackStore = proxy<{
  show: boolean;
  rating?: string;
  section?: string;
}>({
  show: false,
});

export const resetFeedbackState = () => {
  feedbackStore.show = false;
  feedbackStore.rating = undefined;
  feedbackStore.section = undefined;
};

export const invokePageFeedback = (like: boolean) => {
  feedbackStore.show = true;
  feedbackStore.rating = like ? '1' : '0';
  feedbackStore.section = undefined;
};

export const invokeSectionFeedback = (section: string) => {
  feedbackStore.show = true;
  feedbackStore.rating = undefined;
  feedbackStore.section = section;
};
