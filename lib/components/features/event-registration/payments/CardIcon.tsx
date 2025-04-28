import { ASSET_PREFIX } from "$lib/utils/constants";

export const CardIcon = ({ cardBrand }: { cardBrand: string | undefined }) => {
  if (cardBrand === 'visa') return <img src={`${ASSET_PREFIX}/assets/images/cards/visa.svg`} width={20} alt="visa" />;
  if (cardBrand === 'mastercard') return <img src={`${ASSET_PREFIX}/assets/images/cards/mastercard.svg`} width={20} alt="mastercard" />;
  if (cardBrand === 'unknown') return <img src={`${ASSET_PREFIX}/assets/images/cards/card-active.svg`} width={20} alt="card-active" />;
  return <i className="icon-card min-w-6" />;
};
