import Link from 'next/link';

export default function RenderPage() {
  return (
    <div>
      <ul>
        <li>
          <Link href={'/render/csr'}>csr page</Link>
        </li>
        <li>
          <Link href={'/render/isr'}>isr page</Link>
        </li>
        <li>
          <Link href={'/render/ssg'}>ssg page</Link>
        </li>
        <li>
          <Link href={'/render/ssr'}>ssr page</Link>
        </li>
      </ul>
    </div>
  );
}
