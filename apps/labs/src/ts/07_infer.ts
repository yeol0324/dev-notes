// 7: infer

// INFO: infer 타입을 타입 안에서 잡아내는 변수 선언문
// 제약 조건 extends가 아닌 조건부 타입 extends절에서만 사용 가능

// R이 추론 가능한 타입이면 참, 아니면 거짓

type MyType<T> = T extends infer R ? R : null;

// 여기서 T가 number 면 aa의 타입은 number가 될 것임
const aa: MyType<string> = "bbb";
console.log(typeof aa); //string

// TS 내장 returnType

// type A = MyReturnType<() => number>;   // number
// type B = MyReturnType<(s: string) => Promise<boolean>>; // Promise<boolean>
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

function fn(num: number) {
  return num.toString();
}

const a: ReturnType<typeof fn> = "Hello"; // ReturnType<T> 이용
console.log(typeof a); //string 타입 추론으로 string 이라는 값이 나옴!!!

// 함수 타입에서 첫 번째 인자의 타입만 추출하는 FirstArg<T>를 작성
// T extends (...args: any[]) => infer R ? R : never
type FirstArg<T> = T extends (arg: infer A, ...rest: any[]) => any ? A : never;

type F1 = (id: number, name: string) => void;
const f1: FirstArg<F1> = 123;
console.log(typeof f1); // number

type F2 = (user: { id: string }) => boolean;
const f2: FirstArg<F2> = { id: "yurim" };
console.log(typeof f2); // { id: string }

const f3: FirstArg<() => void> = undefined;
console.log(typeof f3); // never

export {};
