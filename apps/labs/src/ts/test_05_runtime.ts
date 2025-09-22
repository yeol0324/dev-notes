// Challenge 5: 런타임 검증 + TS 추론 (zod)

import { z } from "zod";

const User = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

// TODO: User 타입을 추론해 type UserType = z.infer<typeof User>

function printUser(user: unknown) {
  const parsed = User.parse(user); // 런타임에서 검증
  console.log(`User: ${parsed.id} / ${parsed.name}`);
}

// ✅ 올바른 데이터
printUser({ id: "550e8400-e29b-41d4-a716-446655440000", name: "Yurim" });

// ❌ 잘못된 데이터 → 런타임 오류 발생
printUser({ id: "not-uuid", name: "" });
