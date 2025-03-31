import { createContext } from 'react';
import { ExampleTopic } from './types';

export type IThemeAntVContext = {
  meta?: {
    exampleTopics?: ExampleTopic[];
  };
};

export const ThemeAntVContext = createContext<IThemeAntVContext>({});
