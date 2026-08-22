/**
 * Categorias de tabaco: Google Ads prohibe promocionar tabaco, asi que la
 * landing de campanas publicitarias no puede mostrarlas.
 */
export const TOBACCO_CATEGORY_SLUGS = ["cigarrillos", "tabaco", "vapes"];

const TOBACCO_NAMES = ["cigarrillo", "tabaco", "vape", "cigarro"];

export const isTobaccoSlug = (slug: string): boolean =>
  TOBACCO_CATEGORY_SLUGS.includes(slug.toLowerCase());

export const isTobaccoCategoryName = (name: string): boolean => {
  const value = name.toLowerCase();
  return TOBACCO_NAMES.some((word) => value.includes(word));
};
