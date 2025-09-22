// Challenge 1: Union 타입
// "on" 또는 "off"만 받는 함수 만들기

function setSwitch(state: "on" | "off") {
  return state === "on" ? "Switch is ON" : "Switch is OFF";
}

// ✅ 올바른 사용
console.log(setSwitch("on"));
console.log(setSwitch("off"));

// ❌ 에러 나야 함
// console.log(setSwitch("maybe"));
