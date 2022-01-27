type RarityElement = {
  readonly rarity: number;
};

/**
 *
 * @param list a list of items with rarity
 * @param random a random number
 * @returns an index of randomly selected element
 */
export function selectByRarity(
  list: readonly RarityElement[],
  random: number
): number {
  return list.slice(0).reduce((result: number, item, index, array): number => {
    if (random < result + item.rarity) {
      // eslint-disable-next-line functional/immutable-data
      array.splice(0);

      return index;
    }

    return result + item.rarity;
  }, 0);
}
