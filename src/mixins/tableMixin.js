import {PAGE_SIZE} from "../utils/static";
export const tableMixin = {
  data() {
    return {
      loading: false,
      pageSizeSelectable: PAGE_SIZE,
      totalCount: 0, // 总共条数
      resultData: null,
      pageIndex: 1,
      pageSize: PAGE_SIZE[0],
      filterData: {
        pageIndex: 1,
        sortList: []
      },
      sortOrderMap: {
        ascending: 1,
        descending: 0
      }
    }
  },
  created() {
    this._loadData(this.filterData)
  },
  methods: {
    _loadData(param) {
      const params = Object.assign({}, param, { pageSize: this.pageSize })
      this.loading = true
      this.loadFunction(params).then((data) => {
        if (data.result) {
          console.log(data.result)
          this.resultData = data.result
          this.filterData.pageIndex = data.page.currentPage
          this.pageIndex = data.page.currentPage
          this.totalCount = data.page.totalCount
        } else {
          if (this.pageIndex > 1) {
            this.pageIndex -= 1
            this.filterData.pageIndex -= 1
            this._loadData(this.filterData)
          } else {
            this.resultData = []
            this.totalCount = 0
            this.pageIndex = 1
          }
        }
        this.loading = false
      })
    },
    resetLoad() {
      console.log('4444')
      this.filterData.pageIndex = 1
      this.pageIndex = 1
      this._loadData(this.filterData)
    },
    tableSort({ column, prop, order }) {
      if (column) {
        this.filterData.pageIndex = 1
        this.pageIndex = 1
        this.filterData.sortList = []
        this.filterData.sortList.push({sortField: prop, sortType: this.sortOrderMap[order]})
        this._loadData(this.filterData)
      } else {
        this.filterData.sortList = []
        this.filterData.pageIndex = 1
        this.pageIndex = 1
        this._loadData(this.filterData)
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.resetLoad()
    },
    handleCurrentChange(val) {
      this.filterData.pageIndex = val
      this.pageIndex = val
      this._loadData(this.filterData)
    }
  }
}
