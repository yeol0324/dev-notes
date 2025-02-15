import { useState, useEffect, useLayoutEffect } from 'react';

export default function EventLoopTest() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('--- 1. 클릭 이벤트 발생 (Call Stack) ---');

    // 1. 태스크 큐 (가장 늦게 실행 예상)
    setTimeout(() => {
      console.log('--- 7. setTimeout (Task Queue) ---');
    }, 0);

    // 2. 마이크로태스크 큐
    Promise.resolve().then(() => {
      console.log('--- 3. Promise.then (Microtask Queue) ---');
    });

    // 3. 리액트 상태 업데이트
    setCount((prev) => prev + 1);

    console.log('--- 2. 핸들러 함수 종료 (Call Stack 비워짐) ---');
  };

  useLayoutEffect(() => {
    if (count > 0) {
      console.log(
        '--- 4. useLayoutEffect (DOM 반영 직후 / 화면 그리기 전) ---',
      );
    }
  }, [count]);

  useEffect(() => {
    if (count > 0) {
      console.log('--- 6. useEffect (화면 그린 후 / 비동기) ---');
    }
  }, [count]);

  // 4. 렌더 큐 (브라우저가 화면을 그릴 때)
  if (count > 0) {
    requestAnimationFrame(() => {
      console.log('--- 5. requestAnimationFrame (Render Queue) ---');
    });
  }

  return (
    <button onClick={handleClick}>클릭하여 순서 확인 (현재: {count})</button>
  );
}
