// 1: Union 타입
// "on" 또는 "off"만 받는 함수 만들기

type Union = "on" | "off";
function setSwitch(state: Union) {
  return state === "on" ? "Switch is ON" : "Switch is OFF";
}

console.log(setSwitch("on")); //Switch is ON
console.log(setSwitch("off")); //Switch is OFF

// console.log(setSwitch("maybe")); Error
