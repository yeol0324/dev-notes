// Challenge 8: 맵드 타입
// MyPartial<T>를 구현하라. 모든 프로퍼티가 optional이 되어야 한다.

type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type User = {
  id: string;
  name: string;
  age: number;
};

type PartialUser = MyPartial<User>;
// 기대: { id?: string; name?: string; age?: number }
