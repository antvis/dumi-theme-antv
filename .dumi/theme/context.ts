import { createContext } from 'react';

export type IThemeAntVContext = {
  exampleTopics?: ExamplesPage.ExampleTopic[];
}

export const ThemeAntVContext = createContext<IThemeAntVContext>({});
