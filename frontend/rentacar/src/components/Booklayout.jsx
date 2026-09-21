import { Outlet } from "react-router-dom";
import Booknav from "./Booknav";

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

export default Booklayout;
