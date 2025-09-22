import { add } from "./add.js";

/** @type {number} */
const x = add(1, 2);

// 의도적 오류: 문자열 전달
const y = add(1, "2"); // checkJs + JSDoc 로 여기서 오류 표시 기대

console.log({ x, y });
