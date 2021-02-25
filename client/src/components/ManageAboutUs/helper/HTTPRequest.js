import { message } from "antd";
import Axios from "axios";

const HTTPRequest = () => {
  const fetchAboutUs = (setAboutUsData) => {
    Axios.get("/api/v1/admin/about_us/", {
      params: { excludeThis: [""], test: "ssdfdsf" },
    })
      .then((aboutUsResponse) => {
        let data = aboutUsResponse.data[0];
        setAboutUsData(data);
      })
      .catch((error) => console.log(error));
  };

  const createOrUpdateAboutUs = (
    values,
    aboutUsData,
    history,
    setAboutUsData
  ) => {
    message.loading({ content: "Saving About Us Content", key: "updatable" });
    Axios.post("/api/v1/admin/about_us/create_or_update", {
      ...values,
      id: aboutUsData?.id,
    })
      .then((aboutUsResponse) => {
        let { success, msg, aboutUsDataResponse } = aboutUsResponse.data;
        if (success) {
          setAboutUsData({ ...aboutUsDataResponse });
          message.success({
            content: msg,
            key: "updatable",
          });
          history.push("/manage-about-us");
        }
      })
      .catch((error) => console.log(error));
  };

  return {
    fetchAboutUs,
    createOrUpdateAboutUs,
  };
};

export default HTTPRequest();
