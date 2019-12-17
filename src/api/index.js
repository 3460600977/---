import {cityInsight} from './modules/cityInsight'
import { PutPlan } from './modules/PutPlan'
import { CityList } from './modules/CityList'
import { industryList } from './modules/industryList'
import {toolBox} from './modules/toolBox'

const api = {
  cityInsight,
  PutPlan,  // 投放计划
  CityList, // 城市列表
  industryList, // 行业
  toolBox, // 工具箱
}

export default api;
