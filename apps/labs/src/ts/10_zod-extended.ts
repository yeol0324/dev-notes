// Challenge 10: Zod와 TS 타입 확장
import { z } from "zod";

// 상품 데이터 검증 스키마
const Product = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  tags: z.array(z.string()).optional(),
});

type Product = z.infer<typeof Product>;

// Product 배열을 받아서 평균 가격을 리턴하는 함수 작성
function averagePrice(products: Product[]): number {
  if (products.length === 0) return 0;
  return products.reduce((sum, p) => sum + p.price, 0) / products.length;
}

// 테스트 실행
console.log(
  averagePrice([
    { id: "550e8400-e29b-41d4-a716-446655440000", name: "Book", price: 10 },
    { id: "550e8400-e29b-41d4-a716-446655440001", name: "Pen", price: 5 },
  ])
); // 7.5
