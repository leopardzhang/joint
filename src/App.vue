<template>
  <div id="app">
    <el-header>
      <div class="pt10">
        <el-button @click="addLine" type="primary">添加连接</el-button>
        <el-button @click="addData" type="primary">添加项目</el-button>
        <el-button @click="saveImage" type="success">保存截图</el-button>
      </div>
    </el-header>
    <main class="container" @mouseup="changeMouseStat('up')">
      <Item
        v-for="(item, index) in itemList"
        :key="index"
        :left="item.position.left"
        :top="item.position.top"
        :name="item.name"
        :info="item.data"
        :index="index"
        :stat="mouseStat"
        :id="item.id"
        @handleMouseDown="changeMouseStat"
        @changePosition="setPosition"
        @handleRemove="handleRemove"
        @sentBegin="sentBegin"
        @update="update"
      />
      <Linker
        v-for="(item, index) in linesList"
        :key="index + 1000"
        :from="item.from"
        :to="item.to"
        :lineIndex="index"
        :position="positionList"
        @removeLine="removeLine"
      />
    </main>
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-row
        :gutter="10"
        v-if="currentData.data"
        v-for="(item, index) in currentData.data"
        :key="index"
      >
        <el-col :span="11">
          <div class="mb10">
            <el-input v-model="item.key" placeholder="请输入key"/>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="mb10">
            <el-input v-model="item.value" placeholder="请输入value"/>
          </div>
        </el-col>
        <el-col :span="2" class="icon_box">
          <i @click="removeItem(index)" class="el-icon-remove-outline remove"></i>
        </el-col>
      </el-row>

      <el-col :span="2" class="icon_box">
        <i @click="addItem()" class="el-icon-circle-plus-outline add"></i>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加项目 -->
    <el-dialog title="新增条目" :visible.sync="addDialog">
      <div class="flex aic">
        <p style="width: 100px;">项目名称：</p>
        <el-input placeholder="请输入项目名字" v-model="itemName"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="readyToAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 连线 -->
    <el-dialog title="修改信息" :visible.sync="lineVisible">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="mb10">
            <el-select v-model="lineCtrl.from" filterable placeholder="请选择">
              <el-option v-for="item in itemList" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="mb10">
            <el-select v-model="lineCtrl.to" filterable placeholder="请选择">
              <el-option v-for="item in itemList" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lineVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangelines">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Item from "./components/Item.vue";
import Linker from "./components/Linker.vue";
import html2canvas from "html2canvas";

import axios from "axios";
import $api from "./$apiConfig";

axios.defaults.baseURL = "https://api.example.com";

export default {
  name: "app",
  components: {
    Item,
    Linker
  },
  data() {
    return {
      dialogFormVisible: false,
      addDialog: false,
      itemList: [
        {
          id: 113,
          name: "自然人",
          position: {
            left: 10,
            top: 10
          },
          data: [
            {
              key: "姓名",
              value: "寒冰射手"
            },
            {
              key: "年龄",
              value: 25
            },
            {
              key: "性别",
              value: "女"
            },
            {
              key: "身高",
              value: "162cm"
            }
          ]
        },
        {
          id: 121,
          name: "法人",
          position: {
            left: 400,
            top: 200
          },
          data: [
            {
              key: "姓名",
              value: "拉克丝"
            },
            {
              key: "年龄",
              value: 25
            },
            {
              key: "性别",
              value: "女"
            },
            {
              key: "身高",
              value: "162cm"
            }
          ]
        },
        {
          id: 132,
          name: "CEO",
          position: {
            left: 800,
            top: 450
          },
          data: [
            {
              key: "姓名",
              value: "马尔扎哈"
            },
            {
              key: "年龄",
              value: 25
            },
            {
              key: "性别",
              value: "女"
            },
            {
              key: "身高",
              value: "162cm"
            }
          ]
        }
      ],

      linesList: [
        {
          from: 113,
          to: 121
        },
        {
          from: 121,
          to: 132
        }
      ],

      currentData: {},

      positionList: {},

      mouseStat: "up",

      itemName: "",
      lineVisible: false,
      lineCtrl: {
        from: null,
        to: null
      }
    };
  },

  created() {
    // axios({
    //   method: "get",
    //   url: "/user/12345"
    // }).then((res) => {
    //   console.log(res);
    // });
  },

  methods: {
    changeMouseStat(stat) {
      this.mouseStat = stat;
    },

    setPosition(data) {
      this.itemList[data.index].position = {
        left: data.moveX,
        top: data.moveY
      };
    },

    handleRemove(index) {
      const id = this.itemList[index].id;
      const temp = [];

      for (const i in this.linesList) {
        if (this.linesList[i].from != id && this.linesList[i].to != id) {
          temp.push(this.linesList[i]);
        }
      }
      this.linesList = temp;
      this.itemList.splice(index, 1);

      this.sentBegin();
    },

    /**
     * 修改数据
     */
    update(index) {
      this.currentData = Object.assign({}, this.itemList[index]);
      this.dialogFormVisible = true;
    },

    sentBegin(pos) {
      if (pos) {
        const org = this.positionList;
        org[pos.id] = pos;
        this.positionList = Object.assign({}, org);
      } else {
        this.positionList = Object.assign({}, this.positionList);
      }
    },

    /**
     *  清除连线
     */
    removeLine(index) {
      this.linesList.splice(index, 1);
      this.sentBegin();
    },

    /**
     * 添加条目
     */
    addItem() {
      this.currentData.data.push({
        key: "",
        value: ""
      });
    },

    /**
     * 移除条目
     */
    removeItem(index) {
      this.currentData.data.splice(index, 1);
    },

    addData() {
      this.addDialog = true;
    },

    readyToAdd() {
      this.itemList.push({
        id: this.itemList[this.itemList.length - 1].id + 1,
        name: this.itemName,
        position: {
          left: 100,
          top: 100
        },
        data: []
      });
      this.addDialog = false;
    },

    saveImage() {
      const box = document.querySelector(".container");
      html2canvas(box, {
        width: box.clientWidth,
        height: box.clientHeight
      }).then(canvas => {
        document.body.appendChild(canvas);
        const img = canvas.toDataURL("image/png");
        window.open(img);
      });
    },

    addLine() {
      this.lineVisible = true;
    },

    handleChangelines() {
      if (this.lineCtrl.from && this.lineCtrl.to && this.lineCtrl.from != this.lineCtrl.to) {
        this.linesList.push(Object.assign({},this.lineCtrl));
        this.lineVisible = false;
      } else {
        this.$alert("请选择起始点和终点");
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 60px);

  .box-card {
    width: 250px;
  }
}
.mb10 {
  margin-bottom: 10px;
}

.icon_box {
  height: 40px;
  display: flex;
  align-items: center;
}

.icon_box i {
  font-size: 20px;
  cursor: pointer;
}

.icon_box .add {
  color: #409eff;
}

.icon_box .remove {
  color: #f56c6c;
}

.pt10 {
  padding-top: 10px;
}
</style>
