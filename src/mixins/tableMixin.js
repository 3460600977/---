import {PAGE_SIZE} from "../utils/static";
export const tableMixin = {
  data() {
    return {
      loading: false,
      pageSizeSelectable: PAGE_SIZE,
      totalCount: 0, // 总共条数
      resultData: null,
      pageIndex: 1,
      pageSize: 10,
      filterData: {
        pageIndex: 1,
        sortField: '',
        sortType: ''
      },
      sortOrderMap: {
        ascending: 'UP',
        descending: 'DOWN'
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
          this.resultData = data.result
          this.filterData.pageIndex = data.page.currentPage
          this.pageIndex = data.page.currentPage
          this.totalCount = data.page.totalCount
        } else {
          this.resultData = []
          this.totalCount = 0
          this.pageIndex = 1
        }
        this.loading = false
      })
    },
    resetLoad() {
      this.filterData.pageIndex = 1
      this.pageIndex = 1
      this._loadData(this.filterData)
    },
    tableSort({ column, prop, order }) {
      if (column) {
        this.filterData.sortField = column.sortable;
        this.filterData.pageIndex = 1
        this.pageIndex = 1
        this.filterData.sortType = this.sortOrderMap[order];
        this._loadData(this.filterData)
      } else {
        this.filterData.sortField = '';
        this.filterData.sortType = '';
        this.filterData.pageIndex = 1
        this.pageIndex = 1
        this._loadData(this.filterData)
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.resetLoad()
    },
    handleCurrentChange() {
      this.filterData.pageIndex = this.pageIndex
      this._loadData(this.filterData)
    }
  }
}
