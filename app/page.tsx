import { demos } from '@/lib/demos';
import { getGroupCard } from '@/services/card/cardSlice';
import Link from 'next/link';
import { use } from 'react';

export default function Page() {
  // const dispatch = useDispatch();
  // const groupCard = useSelector((s) => s.card.groupCard);

  const data = use(getGroupCard());

  // useEffect(() => {
  //   // auto update list
  //   const timer = setInterval(
  //     () => dispatch(getCardLearnTodayThunk()),
  //     1000 * 60
  //   );

  //   return () => clearInterval(timer);
  // }, []);
  return (
    <div className="mt-10">
      <h1 className="md-6 text-center text-2xl md:mb-10 md:text-4xl">
        Welcome back!
      </h1>
      <table className="table-border-full w-full">
        <thead>
          <tr>
            <th className="text-start text-xl">Group name</th>
            <th className="text-xl">Learn</th>
          </tr>
        </thead>
        <tbody>
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
          {/* {groupCard.ids.map((id) => (
        <GroupRow
          groupId={id}
          key={id}
          name={path([id, "name"], groupCard.entities)}
        />
      ))} */}
        </tbody>
      </table>
    </div>
  );
}

// const GroupRow = ({ groupId, name }) => {
//   const result = useSelector((s) => s.card.learnToday.entities[groupId]);

//   return (
//     <tr>
//       <td className="">
//         <Link to={`/learn/${groupId}`}>{name}</Link>
//       </td>
//       <td className="text-center ">
//         {result ? (
//           <>
//             <span className="text-green-400">{result.card.rows.length}</span>
//             &nbsp;
//             <span className="text-gray-400">in</span>&nbsp;
//             <span className="text-sky-400">{result.card.count}</span>
//           </>
//         ) : null}
//       </td>
//     </tr>
//   );
// };
