import { CARD_TYPE } from '@/constants/index';
import { maybe } from '@/functions/common';
import { useGetListCardQuery } from '@/services/queryApi';
import CardDetailItem from '@/ui/CardDetailItem';
import LoadingIcon from '@/ui/LoadingIcon';
import Pagination from '@/ui/Pagination';
import { path } from 'ramda';
import { useState } from 'react';
import imagePlaceholder from '@/assets/placeholder-image.png';
import { ICardStepResponse } from '@/api/fast_card_client_api';
import { getMedia } from '@/api/client';
import { IReactProps } from '@/interfaces/common';
import EditGroupCard from './EditGroupCard';
const ITEM_PER_PAGE = 10;

const getCardType = (
  cardStep: ICardStepResponse[],
  type: keyof typeof CARD_TYPE,
) => cardStep.filter((item) => item.type === type);

const getImage = (cardStep: ICardStepResponse[]) =>
  cardStep.length > 0 &&
  maybe(path([0, 'image', 'path'], getCardType(cardStep, CARD_TYPE.answer)))
    .map(getMedia)
    .get();

const ShowListCardOfGroup: IReactProps<{ groupId: number }> = ({ groupId }) => {
  const [pageIndex, pageIndexSet] = useState(1);
  const { data, isLoading, refetch } = useGetListCardQuery(
    { groupId, limit: ITEM_PER_PAGE, pageIndex: pageIndex },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  return (
    <div>
      <EditGroupCard groupId={groupId} className="mb-4" />
      {isLoading && (
        <div className="text-center">
          <LoadingIcon className="text-4xl" />
        </div>
      )}
      {!isLoading &&
        data?.data.rows.map((item) => (
          <CardDetailItem
            cardData={item.cardStep[0]}
            key={item.id}
            onDeleted={() => refetch()}
            title={
              (item.cardStep.length > 0 &&
                item.cardStep
                  .filter((item) => item.type === CARD_TYPE.answer)[0]
                  .content.split(' ')
                  .slice(0, 10)
                  .join(' ')) ||
              ''
            }
            className="mb-4"
          />
        ))}

      {!isLoading && data && (
        <Pagination
          onChange={(page) => pageIndexSet(page)}
          current={pageIndex}
          max={Math.ceil(data.data.count / ITEM_PER_PAGE)}
        />
      )}
    </div>
  );
};

export default ShowListCardOfGroup;