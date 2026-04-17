export function formatStructureData(
  pageConfigFields?: any | null,
  pageConfig?: any
) {
  const rawDataFields = pageConfigFields?.structure_data;
  const rawDataConfig = pageConfig?.structure_data;

  if (!rawDataFields && !rawDataConfig) return null;

  const dataFields = typeof rawDataFields === 'string' ? JSON.parse(rawDataFields) : rawDataFields || {};
  const dataConfig = typeof rawDataConfig === 'string' ? JSON.parse(rawDataConfig) : rawDataConfig || {};

  const merged = { ...dataConfig, ...dataFields };

  return Object.keys(merged).reduce((acc, key) => {
    acc[key] = {
      ...merged[key],
      props: merged[key].props || {},
    };
    return acc;
  }, {} as any);
}
