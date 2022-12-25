const pageInfo = (name: string, path: string) => ({ name, path });

export const HOME_PAGE = pageInfo('Home', '/');
export const CARD_LIST_PAGE = pageInfo('Card list', '/list-card');
export const VIDEO_LIST_PAGE = pageInfo('Video list', '/video');
