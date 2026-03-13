import { Outlet } from "react-router-dom";
import Ownernavbar from "./Ownernav";


function Ownerlayout() {
  return (
    <>
      <Ownernavbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Ownerlayout;
