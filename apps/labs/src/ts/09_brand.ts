// Challenge 9: 브랜드 타입
// UserId, OrderId를 헷갈리지 않게 구분하기.

type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function getUser(id: UserId) {
  console.log("User", id);
}

function getOrder(id: OrderId) {
  console.log("Order", id);
}

// 올바른 사용
const u: UserId = "u-123" as UserId;
const o: OrderId = "o-987" as OrderId;

getUser(u); // ✅
getOrder(o); // ✅

// 잘못된 사용 (에러 나야 함)
// getUser(o);
// getOrder(u);
