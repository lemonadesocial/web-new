import { themeAtom } from './store';

export const EventBuilder = () => {
  const [data, onChange] = useAtom(themeAtom);
  const { theme, font_title, font_body, config, variables } = data;
  return <div></div>;
};
