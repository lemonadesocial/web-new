import { ASSET_PREFIX } from '$lib/utils/constants';

export function Preview() {
  return (
    <>
      <img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="md:hidden w-full object-cover" />

      <div className="hidden md:block flex-1 h-full pt-6 pb-12">
        <div
          className="h-full flex items-center rounded-md p-12 bg-primary/8"
          style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/preview-bg.png)` }}
        >
          <img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="w-full object-cover" />
        </div>
      </div>
    </>
  );
}
