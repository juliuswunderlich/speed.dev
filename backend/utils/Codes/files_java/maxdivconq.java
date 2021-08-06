public static int max(int[] array, int low, int high) {
  if (low == high) {
    return array[low];
  }

  int mid = (low + high) >>> 1;

  int leftMax = max(array, low, mid);
  int rightMax = max(array, mid + 1, high);

  return Math.max(leftMax, rightMax);
}