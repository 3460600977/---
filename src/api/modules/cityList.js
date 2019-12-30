import request from "@/utils/request";

/**
 * 城市列表
 */


export const CityList = {
  // 所有城市列表
  AllList: () => {
    return request({
      url: "/dpapi/map",
      method: "GET"
    });
  },
    
  // 一二三线城市
  TypeList: () => {
    return request({
      url: "/dpapi/typeList",
      method: "GET"
    });
  },
  
  //POST根据订单信息计算预估总价
  EstimateTotalPrice: (data) => {
    return request({
      url: "/dpapi/estimate/totalPrice",
      method: "post",
      data
    });
  },

}