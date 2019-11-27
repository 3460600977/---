import request from "@/utils/request";

export function test(data) {
  console.log(process.env.NODE_ENV)
  return request({
    url: "http://qa-effect.xinchao.com/trends/campaigns?keyword=&pageNum=&pageSize=",
    method: "get",
    data
  });
}