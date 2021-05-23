import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const API = axios.create({
  baseURL: "https://api.footballerize.com/api",
});

const refreshAuthLogic = async (failedRequest) => {
  console.log("fired");

  const token = localStorage.getItem("refreshToken");
  if (!!token) {
    try {
      const res = await axios.post(
        "https://api.footballerize.com/api/dj-rest-auth/token/refresh/",
        { refresh: token }
      );

      if (res) {
        console.log(res.data.access, "res ~access token refresh");
        const accesToken = res.data.access;
        failedRequest.response.config.headers["Authorization"] =
          "Bearer " + accesToken;
        setAuthHeader(accesToken);

        console.log("resolved with header");
        return Promise.resolve();
      } else {
        console.log("error ~access token not returned");
        //dispatc message of error
        Promise.reject();
      }
    } catch (error) {
      console.log("error during token refresh", error);
      //dispatch error ,essage to login again
    }
  } else {
    //dispatch error message to login user again
    console.log("error ~token ni mila");
  }
};

createAuthRefreshInterceptor(API, refreshAuthLogic, {
  //change it to 401 and 403 only
  statusCodes: [401, 404, 400, 500, 501, 403],
});

API.defaults.headers.common["Content-Type"] = "application/json";

//set default header with access token
export const setAuthHeader = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;
