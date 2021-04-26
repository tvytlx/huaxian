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
  },
  methods: {
    startGame(){
        this.timer = setInterval(()=>this.userClock--, 1000)
        this.isStart = true;
    },
    reloadGame(){
        init();
        this.userClock = 30;
        clearInterval(this.timer);
        this.selectedItems = [];
        this.itemsPositions = [];
        this.isStart = false;
    },
    withDraw() {
        if(!this.isStart) return;
        this.selectedItems = this.selectedItems.slice(0, this.selectedItems.length - 1);
    },
    confirm() {
        if(!this.isStart) return;
        gameObj.switchSide();
        this.userClock = 30;
        clearInterval(this.timer);
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
                this.rerender = false;
                this.$nextTick(()=>{
                    this.rerender = true;
                });
            }
        });
    }
  },
  watch: {
      userClock(newVal) { if(newVal === 0) clearInterval(this.timer) },
  },
  computed: {
      userName() {
          return gameObj.currentPlayer ? '红方' : '黑方';
      }
  },
  mounted() {
    const playgroundElm = document.querySelector('#playground');
    playgroundElm.addEventListener('touchstart', (e) => {
        e.preventDefault();
        console.log(e);
        this.lastTouch = e.touches[0];
    });
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
    const itemElms = document.querySelectorAll('.x-block-item');
    this.itemsPositions = Array.from(itemElms).map(elm => elm.getClientRects()[0]);
  }
})