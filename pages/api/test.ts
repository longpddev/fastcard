import { MethodFactory } from '@/functions/api_helper';
import { forwardToFastCard } from '../../api/fast_card';

const method = MethodFactory();
method.POST(async (req, res) => {
  const URL = 'http://localhost:6969/';
  const endPoint = '/api/v1/auth/signup';
  const timeStart = new Date().getTime();
  const result = await forwardToFastCard({ endPoint }, req);
  const timeEnd = new Date().getTime();
  res.setHeader('s-time-fetch-external-source', `${timeEnd - timeStart} ms`);
  res.send(result);
});
export default method.init();
