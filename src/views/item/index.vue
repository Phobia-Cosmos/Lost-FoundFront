<template>
  <div class="dashboard-container">
    <div class="container">
      <!--      <el-input placeholder="请输入标题查询" style="width: 200px" v-model="queryParams.name"></el-input>-->
      <!--      &lt;!&ndash;      TODO:这里要绑定属性和输入值&ndash;&gt;-->
      <!--      <el-button type="info" plain style="margin-left: 10px" @click="getItemList">查询</el-button>-->
      <!--      <el-button type="warning" plain style="margin-left: 10px" @click="reset">重置</el-button>-->

      <div class="tableBar">
        <label style="margin-right: 10px">物品名称：</label>
        <el-input v-model="queryParams.name"
                  placeholder="请填写物品名称"
                  style="width: 14%"
                  clearable
                  @clear="reset"
                  @keyup.enter.native="initFun"/>

        <label style="margin-right: 10px; margin-left: 20px">失物招领状态：</label>
        <el-select v-model="queryParams.status"
                   style="width: 14%"
                   placeholder="请选择"
                   clearable
                   @clear="getItemList">
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

        <label style="margin-right: 10px; margin-left: 20px">物品发布时间：</label>
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
            @clear="init(orderStatus)"
        />
        <el-button class="normal-btn continue"
                   @click="getItemList()">
          查询
        </el-button>
      </div>


      <!--  row-key 属性的值应与通过 :data 属性提供给表格的数据对象中的属性相对应。-->
      <!--条纹属性用于在表格行上启用斑马纹。斑马纹是一种样式技术，通常是为了提高可读性和视觉组织性，在表格中交替显示不同背景颜色的行。
      当条纹属性设置为 true 时，表格将自动为其行应用交替的背景颜色，使用户更容易区分单个行，尤其是在有多行数据的大型表格中。
      这种视觉提示可帮助用户跟踪当前正在查看的行，并增强整体用户体验。-->
      <el-table :data="tableData" stripe:true row-key="id">
        <el-table-column prop="id" label="序号" width="80" align="center" sortable/>
        <!--它控制当单元格内容溢出其容器时是否显示工具提示。当单元格内容过大而无法在列宽内容纳时，就会出现一个工具提示，允许用户将鼠标悬停在单元格上查看完整内容。-->
        <!--一般prop和v-slot不一起使用-->
        <el-table-column label="失物招领图片" show-overflow-tooltip>
          <template v-slot="scope">
            <!--            <div style="display: flex; align-items: center">-->
            <el-image style="width: 60px; height: 45px; border-radius: 10%"
                      v-if="scope.row.img"
                      :src="scope.row.img"
                      :preview-src-list="[scope.row.img]"></el-image>
            <!--            </div>-->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="失物招领名称"/>
<!--        TODO:这里改成点击column就显示，而不是一个按钮-->
        <el-table-column prop="content" label="具体描述信息">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="viewEditor(scope.row.content)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="失物招领状态" :formatter="formatStatus"/>
        <el-table-column prop="tag" label="物品类型" :formatter="formatTag"/>
        <el-table-column prop="isLost" label="失物招领类型" :formatter="formatIsLost"/>
        <el-table-column prop="startTime" label="起始时间"/>
        <el-table-column prop="endTime" label="截止时间"/>
        <el-table-column prop="publishTime" label="发表时间"/>
        <el-table-column label="操作" width="180" align="center">
          <!--          这个slot他一定要加上，否则无法识别变量-->
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

    <suggestion-dialog @updateStatus="getItemList" :current-node-id="currentNodeId" ref="suggestionDialog"
                       :show-dialog.sync="showDialog" :status="currentNodeStatus"></suggestion-dialog>

    <el-dialog title="详细信息" :visible.sync="viewVisible" width="80%" :close-on-click-modal="false" destroy-on-close>
      <div v-html="viewData" class="w-e-text w-e-text-container"></div>
    </el-dialog>
  </div>
</template>

<script>
import {adminPageQuery} from "@/apis/item";
import SuggestionDialog from "@/views/item/component/SuggestionDialog.vue"; // Import your dialog component

export default {
  name: "Item",
  components: {
    SuggestionDialog
  },
  data() {
    return {
      tableData: [],  // 所有的数据
      valueTime: [],
      queryParams: {
        page: 1, // 当前页码
        pageSize: 5,
        name: null,
        status: null,
        tag: null,
        isLost: null,
        startTime: null,
        endTime: null
      },
      total: 0,

      currentNodeId: null, // 存储当前点击的id
      currentNodeStatus: null,
      showDialog: false, // 控制弹层的显示和隐藏

      viewVisible: false,
      formVisible: false,
      viewData: null,

      form: {},
      ids: [],
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {
        title: [
          {required: true, message: '请输入标题', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '请输入内容', trigger: 'blur'},
        ]
      },
    }
  },
  created() {
    this.getItemList()
  },
  methods: {
    async getItemList() {
      try {
        this.queryParams.startTime = this.valueTime && this.valueTime.length > 0 ? this.valueTime[0] : undefined;
        this.queryParams.endTime = this.valueTime && this.valueTime.length > 0 ? this.valueTime[1] : undefined;
        const response = await adminPageQuery(this.queryParams);
        const {data} = response;
        const {records, total} = data;
        this.total = total;
        this.tableData = records.map(record => ({
          ...record,
          startTime: this.formatDate(record.startTime),
          endTime: this.formatDate(record.endTime),
          publishTime: this.formatDate(record.publishTime)
        }));
        console.log(this.total)
        console.log(this.tableData)
      } catch (error) {
        console.error('An error occurred while fetching item list:', error);
      }
    },
    initFun() {
      this.page = 1
      this.getItemList()
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
    // TODO:为什么这个传递的是整个对象？
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
    formatIsLost(isLost) {
      return isLost.isLost ? '失物' : '招领';
    },
    formatTag(tag) {
      switch (tag.tag) {
        case 0:
          return '日常物品';
        case 1:
          return '贵重物品';
        default:
          return '未知种类';
      }
    },
    reset() {
      this.queryParams.name = null
      this.getItemList()
    },
    handleCurrentChange(pageNum) {
      this.queryParams.page = pageNum;
      this.getItemList();
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize;
      this.getItemList();
    },
    viewEditor(content) {
      this.viewData = content;
      this.viewVisible = true;
    }
  }
}
</script>


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
