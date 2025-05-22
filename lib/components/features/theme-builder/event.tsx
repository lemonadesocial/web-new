import { useAtom } from 'jotai';
import { presets, themeAtom } from './store';

export const EventBuilder = () => {
  const [data, onChange] = useAtom(themeAtom);
  const { theme, font_title, font_body, config, variables } = data;
  return (
    <div>
      <div className="bg-tertiary">
        <img src={presets[theme || 'minimal'].image} className="w-[51px] h-[38px] rounded-xs" />
        <div>
          <div>
            <p className="text-xs">Theme</p>
            <p>{presets[theme || 'minimal'].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
