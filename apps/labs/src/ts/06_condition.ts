// 6: 조건부 타입
// IsNever<T>
// T가 never이면 true, 아니면 false.

type IsNever<T> = [T] extends [never] ? true : false;

// 기대 결과
type A = IsNever<never>; // true
type B = IsNever<string>; // false
type C = IsNever<undefined>; // false

const a: A = true;
console.log(typeof a);

const b: B = false;
console.log(typeof b);

const c: C = false;
console.log(typeof c);

export {};
