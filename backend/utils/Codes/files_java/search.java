private <T extends Comparable<T>> int search(T array[], T key, int left, int right) {
  if (right < left) return -1;

  // find median
  int median = (left + right) >>> 1;
  int comp = key.compareTo(array[median]);

  if (comp == 0) {
    return median;
  } else if (comp < 0) {
    return search(array, key, left, median - 1);
  } else {
    return search(array, key, median + 1, right);
  }
}