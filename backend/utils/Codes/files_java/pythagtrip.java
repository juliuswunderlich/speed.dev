public static boolean isPythagTriple(int a, int b, int c) {
  if (a <= 0 || b <= 0 || c <= 0) {
    return false;
  } else {
    return (a * a) + (b * b) == (c * c);
  }
}