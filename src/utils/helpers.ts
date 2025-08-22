export const generateDynamicUpdateQueryPart = <
  T extends Record<string, string | boolean | number | null>,
>(
  updateData: Partial<T>,
) => {
  // Отфильтровываются значения undefined для большей надёжности
  const dataEntriesFiltered = Object.entries(updateData).filter(
    (entry) => entry[1] !== undefined,
  ) as [string, T[keyof T]][];

  const dataValuesFiltered = dataEntriesFiltered.map((entry) => entry[1]);

  // Строка вида:
  // ab = $1,
  // cd = $2,
  // ef = $3
  const updateFieldsQueryPart = dataEntriesFiltered.reduce(
    (accum, entry, index, arr) =>
      accum +
      `${entry[0]} = $${index + 1}` +
      (index === arr.length - 1 ? '' : ',\n'),
    '',
  );

  return {
    updateFieldsQueryPart: updateFieldsQueryPart,
    updateValues: dataValuesFiltered,
    lastUpdateValueIndex: dataValuesFiltered.length,
  };
};
