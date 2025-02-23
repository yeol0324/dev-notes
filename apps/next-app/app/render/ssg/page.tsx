export default async function SSGPage() {
  // 기본 fetch는 cache: 'force-cache'로 동작
  console.log('🚀 SSG 페이지 빌드 중: ' + new Date().toLocaleString());
  const res = await fetch('https://pokeapi.co/api/v2/pokemon');
  const data = await res.json();
  return (
    <div>
      <h1>SSG Page</h1>
      <p>이 페이지는 빌드 시점에 생성되었습니다.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
