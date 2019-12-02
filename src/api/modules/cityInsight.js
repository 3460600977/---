import request from "@/utils/request";

const getPremisesByCity = (data) => {
  return request({
    url: "/dpapi/premises/city",
    method: "POST",
    data
  });
}

export const cityInsight = {
  getPremisesByCity: getPremisesByCity
}
