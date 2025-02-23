'use client'; // 클라이언트 컴포넌트 선언

import { useState, useEffect } from 'react';

export default function CSRPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>CSR Page</h1>
      <p>이 페이지는 브라우저에서 데이터를 직접 가져와 그립니다.</p>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>로딩 중...</p>}
    </div>
  );
}
