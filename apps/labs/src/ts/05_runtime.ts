// Challenge 5: 런타임 검증 + TS 추론 (zod)

import { z } from "zod";

const User = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

type UserType = z.infer<typeof User>;

function printUser(user: UserType) {
  const parsed = User.parse(user); // 런타임에서 검증
  console.log(`User: ${parsed.id} / ${parsed.name}`);
}

printUser({ id: "550e8400-e29b-41d4-a716-446655440000", name: "Yurim" });

// printUser({ id: "not-uuid", name: "" }); //runtime error
