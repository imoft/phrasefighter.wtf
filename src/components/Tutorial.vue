<template>
  
  <div :class="{light: isLight, dark: !isLight}" class="tutorial">
    <h3>SHOOT</h3>
    <div class="tutorial-btn space"></div>
    <h3>&nbsp; &nbsp; MOVE</h3>
    <div class="tutorial-btn left"></div>
    <div class="column">
    <div class="tutorial-btn top" style="margin-bottom:10px;"></div>
    <div class="tutorial-btn bottom"></div>
    </div>
    <div class="tutorial-btn right"></div>
  </div>
  
</template>

<script>
export default {
    props: ['isLight'],
    data() {
        return{
            
        }
    }

}
</script>

<style scoped>
.tutorial{
  display:flex;
  flex-direction:row;
  justify-center:center;
  align-items:center;
}
.tutorial.light{
  color:#CCCCCC;
  border-color:#CCCCCC;
}
.tutorial.dark{
  color:black;
  border-color:black;
}
.tutorial > *{
  margin:0 5px;
}
.tutorial-btn{
  width:auto;
  height:30px;
  font-family: 'Work Sans', sans-serif;
  font-size:14px;
  letter-spacing:1px;
  border:solid 1.5px;
  border-radius:5%;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:2px 8px;
}
.tutorial-btn.space::before{
  content:"space";
  text-transform:uppercase;
  line-height:18px;
}
.tutorial-btn.left::before{
  content:"►";
  transform: scaleX(-1);
}
.tutorial-btn.right::before{
  content:"►";
}
.tutorial-btn.top::before{
  content:"▲";
}
.tutorial-btn.bottom::before{
  content:"▼";
}




</style>