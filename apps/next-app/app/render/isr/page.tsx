export const revalidate = 60; // 60초마다 페이지 갱신

export default async function ISRPage() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon');
  const data = await res.json();

  return (
    <div>
      <h1>ISR Page</h1>
      <p>이 페이지는 60초마다 한 번씩 백그라운드에서 업데이트됩니다.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
