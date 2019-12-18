import {cityInsight} from './modules/cityInsight'
import {PutPlan} from './modules/PutPlan'
import {PutProject} from './modules/putProject'
import {CityList} from './modules/CityList'
import {IndustryList} from './modules/industryList'
import {Report} from './modules/report'

const api = {
  cityInsight,
  PutPlan,       // 投放计划
  PutProject,    // 投放方案
  CityList,      // 城市列表
  IndustryList,  // 行业
  Report,        // 报表
}

export default api;
