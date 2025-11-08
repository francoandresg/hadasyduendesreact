import { rankItem, compareItems } from '@tanstack/match-sorter-utils';
import { sortingFns } from '@tanstack/react-table';

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta(itemRank);
  return itemRank.passed;
};

export const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(rowA.columnFiltersMeta[columnId], rowB.columnFiltersMeta[columnId]);
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export const globalFuzzyFilter = (row, columnId, filterValue) => {
  return row.getVisibleCells().some(cell => {
    const value = cell.getValue();
    const result = rankItem(String(value), filterValue);
    return result.passed;
  });
};

export const globalStrictFilter = (row, columnId, filterValue) => {
  const filter = String(filterValue).toLowerCase();

  return row.getVisibleCells().some(cell => {
    const value = cell.getValue();

    // Si es nulo o undefined, saltar
    if (value === null || value === undefined) return false;

    // Convertimos todo a string y comparamos en minúsculas
    return String(value).toLowerCase().includes(filter);
  });
};