var app = new Vue({
  el: '#app',
  data: {
    gameObj,
    timer: null,
    userClock: 30,
    selectedItems: [],
    itemsPositions: [],
    lastTouch: null,
    rerender: true,
    isStart: false,
    gameOver: false,
  },
  methods: {
    startGame(){
        init();
        this.userClock = 30;
        this.timer = setInterval(()=>this.userClock--, 1000)
        this.isStart = true;
        this.gameOver = false;
        this.$nextTick(() => {
            const itemElms = document.querySelectorAll('.x-block-item');
            this.itemsPositions = Array.from(itemElms).map(elm => elm.getClientRects()[0]);
            this.selectedItems = [];
        });
    },
    withDraw() {
        if(!this.isStart || this.gameOver) return;
        this.selectedItems = this.selectedItems.slice(0, this.selectedItems.length - 1);
    },
    confirm() {
        if(!this.isStart || this.gameOver) return;
        gameObj.switchSide();
        this.userClock = 30;
        clearInterval(this.timer);
        this.timer = setInterval(()=>this.userClock--, 1000)
    },
    isSelected(i, j) {
        const target = i === 0 ? j : this.gameObj.blockItems.slice(0, i).reduce((a, b) => a + b) + j;
        return this.selectedItems.find(elm => elm[0] === target) !== undefined;
    },
    selectedColor(i, j) {
        const target = i === 0 ? j : this.gameObj.blockItems.slice(0, i).reduce((a, b) => a + b) + j;
        const elm = this.selectedItems.find(elm => elm[0] === target);
        if (elm !== undefined) {
            return elm[1];
        }
        return 'none';
    },
    isOverLap(a, b) {
        var a_min_x = a.x;
        var a_min_y = a.y;
        var a_max_x = a.x + a.width;
        var a_max_y = a.y + a.height;

        var b_min_x = b.x;
        var b_min_y = b.y;
        var b_max_x = b.x + b.width;
        var b_max_y = b.y + b.height;
        return ret = a_min_x <= b_max_x &&
               a_max_x >= b_min_x &&
               a_min_y <= b_max_y &&
               a_max_y >= b_min_y
               ;
    },
    compareRect(rect) {
        this.itemsPositions.forEach((itemRect, idx) => {
            if(this.isOverLap(rect, itemRect) && this.selectedItems.find(elm => elm[0] === idx) === undefined) {
                this.selectedItems = [...this.selectedItems, [idx, gameObj.getPlayerColor()]];
                this.rerenderItems();
                if(this.selectedItems.length === gameObj.totalBlocks) {
                    this.gameOver = true;
                    this.clearScreen();
                }
            }
        });
    },
    rerenderItems() {
        this.rerender = false;
        this.$nextTick(()=>{
            this.rerender = true;
        });
    },
    clearScreen() {
        clearInterval(this.timer);
        this.gameObj.blockItems = [];
    }
  },
  watch: {
      userClock(newVal) { if(newVal === 0) clearInterval(this.timer) },
  },
  computed: {
      userName() {
          return gameObj.currentPlayer ? '红方' : '黑方';
      },
      prompt() {
          if(!this.isStart) return '请点击屏幕开始游戏';
          if(this.gameOver) return `游戏结束，${gameObj.currentPlayer ? '黑方' : '红方'}胜`;
          return '';
      }
  },
  mounted() {
    const playgroundElm = document.querySelector('#playground');
    const promptElm = document.querySelector('#prompt');
    const touchStartHandler = (e) => {
        e.preventDefault();
        if(!this.isStart || this.gameOver) { 
            this.startGame();
            return;
        }
        console.log(e);
        this.lastTouch = e.touches[0];
    };
    playgroundElm.addEventListener('touchstart', touchStartHandler);
    promptElm.addEventListener('touchstart', touchStartHandler);
    playgroundElm.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const c = e.touches[0];
        const {clientX: x, clientY: y} = this.lastTouch;
        const rect = {
            x, y,
            width: Math.abs(c.clientX - x),
            height: Math.abs(c.clientY - y),
        };
        this.compareRect(rect);
    })
    playgroundElm.addEventListener('touchend', (e) => {
        e.preventDefault();
    })
  }
})