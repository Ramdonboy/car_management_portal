import { Outlet } from "react-router-dom";
import Booknav from "./Booknavnav";

function Booklayout() {
  return (
    <>
      <Booknav />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Userlayout;
