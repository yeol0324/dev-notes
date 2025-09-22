// Challenge 2: 타입 좁히기 (narrowing)

function printLength(value: string | null | undefined) {
  // TODO: 타입 가드 사용해서 value가 string일 때만 length 출력
  if (typeof value == "string") {
    console.log(value.length);
  }
}

printLength("hello"); // 5 출력
printLength(null); // 아무 것도 출력 안 함
