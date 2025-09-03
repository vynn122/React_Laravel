import { Outlet } from "react-router-dom";
import { Button } from "antd";

const AuthLayout = () => {
  return (
    <>
      {/* <div className="bg-blue-500 p-10">
        <h1 className="text-white">Auth Header</h1>
      </div> */}

      <div className="bg-red-300 h-screen flex justify-center items-center">
        <Outlet />
      </div>

      {/* <div className="bg-blue-500 p-10">
        <h1 className="text-white">Auth Footer</h1>
      </div>
      <Button danger type="primary">
        Delete
      </Button> */}
    </>
  );
};
export default AuthLayout;
