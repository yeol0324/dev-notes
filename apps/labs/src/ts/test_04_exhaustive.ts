// Challenge 4: Exhaustive Check

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
      // TODO: never 타입을 사용해서 누락된 case 있으면 에러 발생하도록
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

console.log(area({ type: "circle", radius: 10 }));
console.log(area({ type: "square", side: 5 }));
