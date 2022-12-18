import { NextApiRequest, NextApiResponse } from 'next';

export type IRequestHandle = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>;

export const MethodFactory = () => {
  let GET: null | IRequestHandle = null;
  let POST: null | IRequestHandle = null;
  let PUT: null | IRequestHandle = null;
  let DELETE: null | IRequestHandle = null;
  return {
    GET(cb: IRequestHandle) {
      GET = cb;
    },
    POST(cb: IRequestHandle) {
      POST = cb;
    },
    PUT(cb: IRequestHandle) {
      PUT = cb;
    },
    DELETE(cb: IRequestHandle) {
      DELETE = cb;
    },
    init() {
      return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
          const allMethod = {
            GET,
            POST,
            PUT,
            DELETE,
          };
          if (req.method && req.method in allMethod) {
            const method = req.method as keyof typeof allMethod;
            const methodOfThisRequest = allMethod[method];
            if (methodOfThisRequest) {
              await methodOfThisRequest(req, res);
              return;
            }
          }
        } catch (e) {
          console.log(e);
          res.status(400).json({
            message: (e as Error).message,
          });
          return;
        }

        res.status(404).send('Not found');
      };
    },
  };
};
