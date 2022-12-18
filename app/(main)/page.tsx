import HomePageGroupTable from '@/ui/Page/HomePageGroupTable';

export default async function Page() {
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
          <HomePageGroupTable></HomePageGroupTable>
        </tbody>
      </table>
    </div>
  );
}
