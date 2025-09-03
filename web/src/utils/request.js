import axios from "axios";
import config from "./config";
import { setStatus } from "../store/statusStore";
import { profileStore } from "../store/profileStore";
export const request = async (url = "", method = "", data = {}) => {
  try {
    const { accessToken } = profileStore.getState();
    let contentType = {
      "Content-Type": "application/json",
    };
    if (data instanceof FormData) {
      contentType = {
        "Content-Type": "multipart/form-data",
      };
    }
    const res = await axios({
      url: config.BASE_URL + url,
      method: method,
      data: data,
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
        ...contentType,
        Authorization: "Bearer " + accessToken,
      },
      withCredentials: true,
    });
    return setStatus(res.status), res.data;
  } catch (err) {
    console.log("this is err: ", err);
    if (err.code === "ERR_NETWORK") {
      setStatus("error");
      return;
    }
    const respone = err.response;
    if (respone) {
      console.log("Full Respone:::", respone);
      const status = respone.status;
      console.log(status);
      const data = respone.data;
      let errors = {};

      if (status == "500") {
        console.log("Server error");
        setStatus("500");
        return;
      }
      if (status == "401") {
        console.log("=====IT GO 401====");
        setStatus("403");
        ///return data error when incorrect pass or email because in backend return status 401 when login Failed
        return data;
      }
      if (data.errors) {
        console.log("IT GO TO data.errors");
        Object.keys(data.errors).map((key, index) => {
          errors[key] = {
            help: data.errors[key][0],
            validateStatus: "error",
            hasFeedback: true,
          };
        });
      }
      setStatus(status);
      console.log("DAATA----", data);

      return {
        status,
        errors: errors,
        data,
      };
    }
  }
};
