import { token } from '@/functions/common';
import { cookies } from 'next/headers';
import { TOKEN_KEY } from '../constants';
import 'server-only';

export default function updateCookie() {
  token.set(cookies().get(TOKEN_KEY)?.value || '');
}
