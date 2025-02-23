export const dynamic = 'force-dynamic'; // 이 설정으로 SSR 강제

export default async function SSRPage() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon', {
    cache: 'no-store', // 매 요청마다 새로 가져오기
  });
  const data = await res.json();

  return (
    <div>
      <h1>SSR Page</h1>
      <p>이 페이지는 요청 시마다 서버에서 새로 그려집니다.</p>
      <p>요청 시간: {new Date().toISOString()}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
