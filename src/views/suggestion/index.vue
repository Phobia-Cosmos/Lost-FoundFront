<template>
  <div class="dashboard-container">
    <div class="container">
      <!--      <el-input placeholder="请输入反馈内容查询" style="width: 200px" v-model="content"></el-input>-->
      <!--      <el-button type="info" plain style="margin-left: 10px" @click="getSuggestionList()">查询</el-button>-->
      <!--      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>-->

      <div class="tableBar">

        <label style="margin-right: 10px; margin-left: 20px">建议状态：</label>
        <el-select v-model="queryParams.status"
                   style="width: 14%"
                   placeholder="请选择"
                   clearable
                   @clear="getSuggestionList">
          <el-option v-for="(item, index) in [
                            { label: '未审核', value: 0 },
                            { label: '审核失败', value: 1 },
                            { label: '未解决', value: 2 },
                            { label: '已解决', value: 3 }
                          ]"
                     :key="index"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>

        <label style="margin-right: 10px; margin-left: 20px">建议发布时间：</label>
        <el-date-picker
            v-model="valueTime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 25%; margin-left: 10px"
            @clear="getSuggestionList"
        />
        <!--        <label style="margin-right: 10px; margin-left: 20px">状态：</label>-->
        <!--        <el-select v-model="dishStatus"-->
        <!--                   style="width: 14%"-->
        <!--                   placeholder="请选择"-->
        <!--                   clearable-->
        <!--                   @clear="getItemList">-->
        <!--          <el-option v-for="item in saleStatus"-->
        <!--                     :key="item.value"-->
        <!--                     :label="item.label"-->
        <!--                     :value="item.value"/>-->
        <!--        </el-select>-->
        <el-button class="normal-btn continue"
                   @click="getSuggestionList">
          查询
        </el-button>
      </div>


      <el-table :data="tableData" stripe @selection-change="handleSelectionChange">
        <!--        TODO:这个用处未知-->
        <!--        <el-table-column type="selection" width="55" align="center"></el-table-column>-->
        <el-table-column prop="id" label="序号" width="80" align="center" sortable/>
        <el-table-column prop="userId" label="用户ID" sortable/>
        <el-table-column prop="content" label="建议内容"/>
        <el-table-column prop="tag" label="建议类型" :formatter="formatTag"/>
        <el-table-column prop="status" label="建议状态" :formatter="formatStatus"/>
        <el-table-column prop="pollCount" label="建议票数" sortable/>
        <el-table-column prop="publishTime" label="发表时间" sortable/>
        <el-table-column prop="validateMsg" label="审核意见"/>
        <el-table-column prop="validatorId" label="审核者ID"/>

        <el-table-column label="操作" width="180" align="center">
          <template v-slot="{ row }">
            <el-button plain type="danger" size="mini"
                       @click="() => update(row.id, 1)">不通过
            </el-button>
            <el-button plain type="success" size="mini"
                       @click="() => update(row.id, 2)">通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row style="height: 60px" align="middle" type="flex" justify="end">
        <el-pagination
            layout="total, sizes, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pageSize"
            :page-sizes="[5, 10, 20]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
      </el-row>
    </div>
    <suggestion-dialog @updateStatus="getSuggestionList" :current-node-id="currentNodeId" ref="suggestionDialog"
                       :show-dialog.sync="showDialog" :status="currentNodeStatus"></suggestion-dialog>
  </div>
</template>

<script>
import {adminPageQuerySuggestion} from "@/apis/suggestion";
import SuggestionDialog from "@/views/suggestion/component/SuggestionDialog.vue";


export default {
  name: "suggestion",
  components: {SuggestionDialog},
  data() {
    return {
      tableData: [],  // 所有的数据]
      valueTime: [],
      queryParams: {
        page: 1, // 当前页码
        pageSize: 5,
        tag: null,
        pollCount: null,
        status: null,
        validatorId: null
      },
      total: 0,
      currentNodeId: null, // 存储当前点击的id
      currentNodeStatus: null,
      showDialog: false, // 控制弹层的显示和隐藏

      content: null,
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'},
        ]
      },
      ids: []
    }
  },
  created() {
    this.getSuggestionList()
  },
  methods: {
    async getSuggestionList() {
      try {
        const response = await adminPageQuerySuggestion(this.queryParams);
        const {data} = response;
        const {records, total} = data;
        this.total = total;
        this.tableData = records
        this.tableData = records.map(record => ({
          ...record,
          publishTime: this.formatDate(record.publishTime)
        }));
        console.log(this.tableData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    update(id, status) {
      this.showDialog = true // 显示弹层
      this.currentNodeId = id
      this.currentNodeStatus = status
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatStatus(status) {
      switch (status.status) {
        case 0:
          return '未审核';
        case 1:
          return '审核失败';
        case 2:
          return '未解决';
        case 3:
          return '已解决';
        default:
          return '未知状态';
      }
    },
    formatTag(tag) {
      switch (tag.tag) {
        case 0:
          return '平台界面';
        case 1:
          return '平台功能';
        default:
          return '未知种类';
      }
    },
    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.ids = rows.map(v => v.id)   //  [1,2]
    },
    reset() {
      this.queryParams.name = null
      this.getSuggestionList()
    },
    handleCurrentChange(pageNum) {
      this.queryParams.page = pageNum;
      this.getSuggestionList();
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.getSuggestionList();
    },
  }
}
</script>

<style scoped>

<style>
.dashboard-container {
  margin: 30px;
}

.dashboard-container .container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
}

.dashboard-container .container .normal-btn {
  background: #333333;
  color: white;
  margin-left: 20px;
}

.dashboard-container .container .tableBar {
  margin-bottom: 20px;
}

.dashboard-container .container .tableBar .tableLab {
  display: inline-block;
  float: right;
}

.dashboard-container .container .tableBar .tableLab span {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: $gray-2; /* Assuming $gray-2 is a SASS/SCSS variable, replace with actual color value */
}

.dashboard-container .container .tableBox {
  width: 100%;
  border: 1px solid $gray-5; /* Assuming $gray-5 is a SASS/SCSS variable, replace with actual color value */
  border-bottom: 0;
}

.dashboard-container .container .pageList {
  text-align: center;
  margin-top: 30px;
}

</style>
