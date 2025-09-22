// 4: Exhaustive Check

type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.type) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    default: {
      // INFO: never는 절대로 발생할 수 없는 값을 의미함
      // default에서 shape를 never로 대입하려고 하면 triangle은 never이 아니기때문에 컴파일 에러 발생
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

console.log(area({ type: "circle", radius: 10 }));
console.log(area({ type: "square", side: 5 }));

type Exclude<T, U> = T extends U ? never : T;
type X = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

export {};
