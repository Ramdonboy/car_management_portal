import { Outlet } from "react-router-dom";
import Usernavbar from "./Usernav";

function Userlayout() {
  return (
    <>
      <Usernavbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Userlayout;
