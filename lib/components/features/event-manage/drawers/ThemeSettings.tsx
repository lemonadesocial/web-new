import { fonts, getThemeName, presets } from "$lib/components/features/theme-builder/store";

import { ThemeBuilderActionKind, useTheme } from "../../theme-builder/provider";
import { PopoverColor, PopoverDisplay, PopoverEffect, PopoverFont, PopoverStyle, ThemeTemplate } from "../../theme-builder/ThemeBuilder";


export function ThemeSettings() {
  const [state, dispatch] = useTheme();
  const themeName = getThemeName(state);

  return (
    <div className="space-y-4">
      <ThemeTemplate className="justify-start" />
      <div className="grid grid-cols-2 gap-2">
        <PopoverColor disabled={state.theme && presets[themeName]?.ui?.disabled?.color} />
        <PopoverStyle />
        <PopoverEffect />
        <PopoverFont
          fonts={fonts.title}
          label="Title"
          selected={state.font_title}
          onClick={(font) => {
            const payload = {
              font_title: font,
              variables: { font: { '--font-title': fonts.title[font] } },
            };
            dispatch({ type: ThemeBuilderActionKind.select_font, payload });
          }}
        />
        <PopoverFont
          fonts={fonts.body}
          label="Body"
          selected={state.font_body}
          onClick={(font) => {
            const payload = {
              font_body: font,
              variables: { font: { '--font-body': fonts.body[font] } },
            };
            dispatch({ type: ThemeBuilderActionKind.select_font, payload });
          }}
        />
        <PopoverDisplay />
      </div>
    </div>
  )
}
