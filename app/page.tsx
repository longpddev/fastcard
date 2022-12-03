import { demos } from '@/lib/demos';
import Link from 'next/link';
import { use } from 'react';

export default function Page() {
  const data = use(fetch('https://jsonplaceholder.typicode.com/todos/1'));
  return <pre>{JSON.stringify(data, undefined, 2)}</pre>;
}
