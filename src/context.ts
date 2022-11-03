import { createContext } from 'react';
import { ExampleTopic } from './types';

export type IThemeAntVContext = {
  exampleTopics?: ExampleTopic[];
}

export const ThemeAntVContext = createContext<IThemeAntVContext>({});
