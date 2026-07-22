import { DashboardContainer } from "@/app/components/admin/dashboard/DashboardContainer";

type DashboardPageProps = {
  user?: { name?: string; role?: string };
};

export default async function DashboardPage({ user }: DashboardPageProps) {
  return (
    <main>
      <DashboardContainer user={user} />
    </main>
  );
}
