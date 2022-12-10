import Dm from "../../components/dm";
import useDMs from "../../hooks/useDMs";
import useUser from "../../hooks/useUser";

export default function DashboardRoute() {
  const dms = useDMs();
  const user = useUser();
  return <Dm channels={dms ?? undefined} user={user ?? undefined} />;
}
