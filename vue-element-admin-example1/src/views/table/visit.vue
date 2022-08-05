<template>
  <div class="visit_container">
    <el-date-picker
      v-model="timeValue"
      type="daterange"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      @change="handleChange"
    />
    <div id="sample" ref="tableList" />
  </div>
</template>
<script>
import * as cheetahGrid from 'cheetah-grid'
import { getTableList } from '@/api/visit.js'
import { Loading } from 'element-ui'
export default {
  name: 'Visit',
  data() {
    return {
      timeValue: [],
      pickerOptions: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableList: [],
      grid: null,
      BaseImgSrc: 'https://dh6xlhv3eenaw.cloudfront.net/ftma_visit/FTMA/visits',
      loadingInstance: null
    }
  },
  watch: {
    tableList() {
      this.getTableView()
    }
  },
  async created() {
    // 请求当天时间
    this.getDefaultTime()
  },
  async mounted() {
    this.getTableView()
    // 请求数据
    await this.getTableInfo()
  },
  methods: {
    // 加载等待
    setLoad() {
      const table = this.$refs['tableList']
      this.loadingInstance = Loading.service(
        {
          target: table
        }
      )
    },
    // 请求表格数据
    getTableInfo() {
      this.setLoad()

      // let that = this
      const time = {
        start: this.timeValue[0],
        end: this.timeValue[1]
      }
      getTableList(time).then(res => {
        this.tableList = this.handleData(res.data)
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close()
        })
      }).catch(err => {
        console.log(err, '发生错误')
      })
    },
    // 表格视图
    getTableView() {
      if (this.grid) {
        this.grid.records = this.tableList
        return
      }
      this.grid = new cheetahGrid.ListGrid(
        {
          parentElement: document.querySelector('#sample'),
          header: [
            { field: 'ft_email', caption: 'email', width: '25%', minWidth: '180',
              style: {
                textOverflow: 'ellipsis'
              }
            },
            { field: 'created_at', caption: 'created_at', width: '16%', minWidth: '180' },
            { field: 'created_month', caption: 'created_month', width: '16%', minWidth: '180' },
            { field: 'store_front_photo', caption: 'store_front_phote', style: { imageSizing: 'keep-aspect-ratio' }, columnType: 'image', minWidth: '180' },
            { field: 'store_location.complete_addr', caption: 'address', width: '25%', minWidth: '180',
              style: {
                textOverflow: 'ellipsis'
              }
            }
          ],
          records: this.tableList,
          frozenColCount: 0,
          defaultRowHeight: 50,
          headerRowHeight: 30
        }
      )
    },
    // 选中日期
    async handleChange(newVal) {
      if (newVal == null) return
      await this.getTableInfo()
    },
    // 默认时间
    getDefaultTime() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      end.setTime(end.getTime())
      this.timeValue[0] = this.formDate(start) // 开始时间
      this.timeValue[1] = this.formDate(end) // 结束时间
    },
    // 格式化时间
    formDate(date, timeFlag) {
      const myYear = date.getFullYear()
      let myMonth = date.getMonth() + 1
      let myWeekday = date.getDate()
      if (myMonth < 10) {
        myMonth = '0' + myMonth
      }
      if (myWeekday < 10) {
        myWeekday = '0' + myWeekday
      }
      if (timeFlag) {
        let hours = date.getHours()
        let seconed = date.getSeconds()
        let minutes = date.getMinutes()
        if (seconed < 10) {
          seconed = '0' + seconed
        }
        if (minutes < 10) {
          minutes = '0' + minutes
        }
        if (hours < 10) {
          hours = '0' + hours
        }
        return myYear + '-' + myMonth + '-' + myWeekday + ' ' + hours + ':' + minutes + ':' + seconed
      }
      return myYear + '-' + myMonth + '-' + myWeekday
    },
    // 处理数据
    handleData(data) {
      // 不清楚图片路径, 临时
      if (this.BaseImgSrc === '') {
        this.BaseImgSrc = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
      }
      for (const key in data) {
        data[key]['store_front_photo'] = `${this.BaseImgSrc}/${data[key]['ft_email']}/${data[key]['store_front_photo']}-thumbnail.png`
        // 处理时间
        const tempTime = data[key]['created_at']
        data[key]['created_at'] = this.formDate(new Date(tempTime), true)
      }
      return data
    }
  }
}
</script>
<style >
.visit_container {
  padding: 20px;
}
.visit_container .el-picker-panel__sidebar {
  font-size: 13px;
}
#sample {
  width: 100%;
  height: 500px;
  margin-top: 20px;
  height: calc(100vh - 180px);
  overflow: hidden;
}
#sample .grid-scrollable {
  overflow: auto;
}
/* 美化滚动条 */
/* .grid-scrollable::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
.grid-scrollable::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #E5E5E5;
}
.grid-scrollable::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ffffff;
} */
</style>
