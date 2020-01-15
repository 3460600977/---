import request from "@/utils/request";

export const Finance = {
  getFinanceAccountList: (data) => {
    return request({
      url: "/dpapi/finance/list",
      method: "POST",
      data
    });
  },
}
