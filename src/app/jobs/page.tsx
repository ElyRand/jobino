import { getJobs } from "@/actions/jobs/getJobs";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getJobs();

  return <div>{JSON.stringify(data)}</div>;
}
