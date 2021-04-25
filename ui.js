var app = new Vue({
  el: '#app',
  data: {
    gameObj,
    timer: null,
    userClock: 30,
  },
  methods: {
    startGame(){
        this.timer = setInterval(()=>this.userClock--, 1000)
    },
    reloadGame(){
        init();
        this.userClock = 30;
        clearInterval(this.timer);
    },
    withDraw() {},
    confirm() {
        gameObj.switchSide();
        this.userClock = 30;
        clearInterval(this.timer);
    },
    isSelected(i, j){
        return true;
    },
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
    });
    playgroundElm.addEventListener('touchmove', (e) => {
        e.preventDefault();
    })
    playgroundElm.addEventListener('touchend', (e) => {
        e.preventDefault();
    })
    const itemElms = document.querySelectorAll('.x-block-item');
    itemElms.forEach((elm, idx) => {
        elm.addEventListener('touchmove', (e) => {
            e.preventDefault();
            console.log(idx)
        })
    });
  }
})