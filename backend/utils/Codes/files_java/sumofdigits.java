public static int sumOfDigits(int number) {
  number = number < 0 ? -number : number;
  int sum = 0;
  while (number != 0) {
    sum += number % 10;
    number /= 10;
  }
  return sum;
}