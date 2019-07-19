<template>
  <div
    class="line"
    :class="className"
    :style="{
      left: width > 0 ? left+'px' : left + width+'px',
      top: height > 0 ? top+'px' : top + height+'px',
      width: width > 0 ? width+'px' : -width+'px',
      height: height > 0 ? height+'px' : -height+'px'
    }"
  >
    <div class="close" @click="removeLine">
      ✘
    </div>
  </div>
</template>

<script>
export default {
  name: "Linker",
  props: {
    lineIndex: Number,
    from: Number,
    to: Number,
    position: Object
  },

  data() {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      className: "leftbottom"
    };
  },

  mounted() {
    this.drowLine();
  },

  methods: {
    drowLine() {
      const position = this.position;
      for (const index in position) {
        if (position[index].id == this.from) {
          this.left = position[index].posX;
          this.top = position[index].posY;
        }
        if (position[index].id == this.to) {
          this.width = position[index].posX - this.left;
          this.height = position[index].posY - this.top;
        }
      }
      if (this.width > 0 && this.height > 0) {
        this.className = 'leftbottom'
      }

      if(this.width < 0 && this.height > 0) {
        this.className = 'rightbottom'
      }

      if(this.width > 0 && this.height < 0) {
        this.className = 'lefttop'
      }

      if(this.width < 0 && this.height < 0) {
        this.className = 'righttop'
      }
    },

    removeLine() {
      this.$emit('removeLine', this.lineIndex);
      this.drowLine();
    }
  },

  watch: {
    position() {
      this.drowLine();
    },

    lineIndex() {
      this.drowLine();
    }
  }
};
</script>

<style lang="scss">
/* 这里解释一下为啥不用border border代码量确实比较简练。
但是html2canvas识别不了border所以改用伪元素模拟 */
.line {
  position: absolute;
  z-index: 1;
  display: flex;
}

.line .close {
  position: absolute;
  cursor: pointer;
}

/*左下*/

.line.leftbottom::before {
  content: '';
  width: 1px;
  background-color: #ccc;
}

.line.leftbottom::after {
  content: '';
  height: 1px;
  flex: 1;
  align-self: flex-end;
  background-color: #ccc;
}

.line.leftbottom .close {
  left: 0;
  bottom: 0;
}

/* 右下 */
.line.rightbottom {
  flex-direction: row-reverse;
}

.line.rightbottom::before {
  content: '';
  width: 1px;
  background-color: #ccc;
}

.line.rightbottom::after {
  content: '';
  height: 1px;
  flex: 1;
  align-self: flex-end;
  background-color: #ccc;
}

.line.rightbottom .close {
  right: 0;
  bottom: 0;
}


/*左上*/

.line.lefttop .close {
  left: 0;
  top: 0;
}

.line.lefttop::before {
  content: '';
  width: 1px;
  background-color: #ccc;
}

.line.lefttop::after {
  content: '';
  height: 1px;
  flex: 1;
  background-color: #ccc;
}

/*右上*/
.line.righttop {
  flex-direction: row-reverse;
}

.line.righttop::before {
  content: '';
  width: 1px;
  background-color: #ccc;
}

.line.righttop::after {
  content: '';
  height: 1px;
  flex: 1;
  background-color: #ccc;
}

.line.righttop .close {
  right: 0;
  top: 0;
}

</style>