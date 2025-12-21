import { WidgetContent } from './WidgetContent';

export function WidgetMusicNFT(props: {}) {
  return (
    <WidgetContent title="Music Player">
      <div className="p-6 flex gap-8">
        <div className="bg-gray-50 size-[228px] aspect-square rounded-sm overflow-hidden"></div>
        <div></div>
      </div>
    </WidgetContent>
  );
}
