import { LoadingOutlined } from "@ant-design/icons";
import { message, Result, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getStatus, setStatus } from "../../store/statusStore";

const MainPage = ({ loading = false, children }) => {
  var status = getStatus();
  // const [status, setStatusState] = useState(getStatus());
  // useEffect(() => {
  //   setStatus(status);
  //   console.log("=========================", status);
  // }, []);
  console.log("Status From Local Storage:", status);
  const getStatusMessage = () => {
    let title = "";
    let subTitle = "";
    switch (status) {
      case "500":
        title = "Internal Server Error";
        subTitle = "Please try again later.";
        break;
      case "403":
        title = "Forbidden";
        subTitle = "You do not have permission to access this resource.";
        break;
      case "404":
        title = "Not Found";
        subTitle = "The requested resource could not be found.";
        break;
      case "error":
        title = "Network Error";
        subTitle = "Please check your internet connection.";
        break;
      default:
        title = "Unknown Error";
        subTitle = "An unknown error has occurred.";
    }
    return { title, subTitle };
  };

  if (
    status == "500" ||
    status == "403" ||
    status == "404" ||
    status == "error"
  ) {
    const { title, subTitle } = getStatusMessage();
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Result status={status} title={title} subTitle={subTitle} />
      </div>
    );
  }
  return (
    <Spin
      spinning={loading}
      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
    >
      {children}
    </Spin>
  );
};

export default MainPage;
