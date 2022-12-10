import { Outlet } from "react-router-dom";
import Main from "../../components/main";

export default function Home() {
  return (
    <Main>
      <Outlet />
    </Main>
  );
}
