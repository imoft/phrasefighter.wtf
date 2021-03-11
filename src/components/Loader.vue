<template>
   <div class="column center">
    <div class="round-btn grey-bg spin">
      <div class="refresh-symbol">
      </div>
    </div>
    <h3>Setting up your fight</h3>

  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

div{
  display:flex;
}


.grey-bg{background-color:#CCCCCC;}
.grey{color:#CCCCCC;}
.white-bg{background-color:white;}
.white{color:white;}
.red-bg{background-color:#EE2E19;}
.red{color:#EE2E19;}
.black-bg{background-color:black;}
.black{color:black;}

.column{flex-direction:column;}
.column.center{align-items:center;}

.row{
  flex-direction:row;
  justify-content:space-around;
  flex-wrap: wrap;
  align-content:center;
  align-items:center;
}


.round-btn{
  width:100px;
  height:100px;
  border-radius:50%;
  display:flex;
  justify-content:center;
  align-items:center;
}

.round-btn.padding{
  margin:20px;
}

.refresh-symbol{
  width:50px;
  height:50px;
  border-radius:50%;
  border: solid black 7px;
}

.refresh-symbol::before {
  content: "";
  height:20px;
  width:20px;
  border-left:solid black 7px;
  border-bottom:solid black 7px;
  transform-origin:50% 50%;
  transform:rotate(-45deg) translateY(-8px) translateX(-12px);
}

.refresh-symbol::after {
  content: "";
  height:20px;
  width:20px;
  border-left:solid black 7px;
  border-top:solid black 7px;
  transform-origin:50% 50%;
  transform:rotate(45deg) translateX(20px);
}

.spin{
  -webkit-animation: spin 5s infinite linear;
  -moz-animation: spin 5s infinite linear;
  -ms-animation: spin 5s infinite linear;
}

.spin:link{}
.spin:visited{}
.spin:hover{}
.spin:after{}

@-moz-keyframes spin {
    from { -moz-transform: rotate(0deg); }
    to { -moz-transform: rotate(-360deg); }
}
@-webkit-keyframes spin {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(-360deg); }
}
@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(-360deg);}
}

</style>