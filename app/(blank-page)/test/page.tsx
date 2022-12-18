import { cookies } from 'next/headers';
import { token } from '@/functions/common';

export default function Page() {
  const nextCookies = cookies();
  return <>token: {token.get()}</>;
}
