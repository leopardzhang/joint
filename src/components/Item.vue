<template>
  <div
    class="item"
    :style="{left: left ? left+'px' : 0, top: top ? top+'px' : 0}"
    @mousedown="mouseDown"
    @mousemove="mouseMove"
  >
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ name }}</span>
        <el-button @click="remove" class="btn" type="text">删除</el-button>
        <el-button @click="update" class="btn" type="text">修改</el-button>
      </div>
      <div v-for="(item, index) in info" :key="index" class="text flex between">
        <span>{{ item.key }}:</span>
        <span>{{ item.value }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Item",
  props: {
    name: String,
    left: Number,
    top: Number,
    info: Array,
    index: Number,
    stat: String,
    id: Number
  },

  data() {
    return {
      position: {
        screenX: 0,
        screenY: 0
      },
      oLeft: null,
      oTop: null
    };
  },

  mounted() {
    this.fnSentBegin();
  },

  methods: {
    mouseDown(e) {
      this.$emit("handleMouseDown", "down");
      this.position.screenX = e.screenX;
      this.position.screenY = e.screenY;
      this.oLeft = this.left;
      this.oTop = this.top;
    },

    mouseMove(e) {
      if (this.stat == "down") {
        const { screenX: oX, screenY: oY } = e;

        const moveX = oX - this.position.screenX;
        const moveY = oY - this.position.screenY;

        this.$emit("changePosition", {
          moveX: moveX + this.oLeft,
          moveY: moveY + this.oTop,
          index: this.index
        });
      }
      this.fnSentBegin();
    },

    /**
     * 删除一个item
     */
    remove() {
      this.$emit("handleRemove", this.index);
    },

    update() {
      this.$emit("update", this.index);
    },

    fnSentBegin() {
      const posX = $(".item").width() / 2 + this.left;
      const posY = $(".item").height() / 2 + this.top;

      this.$emit("sentBegin", {
        posX,
        posY,
        id: this.id
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.item {
  position: absolute;
  z-index: 2;
}

.text {
  font-size: 14px;
  line-height: 2;
}

.text span:nth-child(1) {
  width: 30%;
}

.text span:nth-child(2) {
  width: 70%;
  text-align: right;
}

.btn {
  float: right;
  padding: 3px 0;
  margin-left: 5px;
}

*::selection {
  background-color: transparent;
}

.clearfix::before,
.clearfix::after {
  display: table;
  content: "";
}

.clearfix::after {
  clear: both;
}
</style>
