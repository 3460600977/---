// 投放管理列表共用
export const putManageMixin = {
  data () {
    return {
      searchParam: {
        condition: {},
        page: {
          pageSize: 10,
          pageIndex: 1,
        }
      },

      tableData: {
        loading: true,
        data: [],
        page: {
          currentPage: 0,
          totalCount: 0
        }
      },

    }
  },

  beforeMount() {
    this.search()
  },

  methods: {

    // 获取搜索条件
    handleSearch(condition) {
      this.searchParam.condition = condition;
      this.resetPageIndex()
      this.search()
    },
    
    // 重置翻页为1
    resetPageIndex() {
      this.searchParam.page.pageIndex = 1;
    },

    handleSizeChange(val) {
      this.searchParam.page.pageSize = val;
      this.searchParam.page.pageIndex = 0;
      this.search()
    },

    handleCurrentChange(val) {
      this.searchParam.page.pageIndex = val;
      this.search()
    }
  }
}