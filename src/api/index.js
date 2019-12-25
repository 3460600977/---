import { cityInsight } from './modules/cityInsight'
import { Report } from './modules/report'
import { PutPlan } from './modules/putPlan'
import { PutProject } from './modules/putProject'
import { CityList } from './modules/cityList'
import { IndustryList } from './modules/industryList'
import { CreateCreative } from './modules/createCreative'
import { toolBox } from './modules/toolBox'
import { Login } from './modules/login'
import { AuditCreative } from './modules/auditCreative'

const api = {
  cityInsight,
  PutPlan,       // 投放计划
  PutProject,    // 投放方案
  CityList,      // 城市列表
  IndustryList,  // 行业
  Report,        // 报表
  CreateCreative,// 创建创意
  toolBox,       // 工具箱
  Login,         //登录，登出
  AuditCreative, //审核创意
}

export default api;
