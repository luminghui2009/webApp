/**
 * Created by pop on 2017/4/10.
 */
var box=document.getElementById('box');
var myList=document.getElementById('myList');
var oImgs=myList.getElementsByTagName('img');
var focus=document.getElementById('focus');
var oLis=focus.getElementsByTagName('li');
var sLeft=document.getElementById('slide1');
var sRight=document.getElementById('slide2');
var wid=box.clientWidth;
var len;
function getData(callBack) {
    var xhr=new XMLHttpRequest();
    xhr.open('get','data.txt',true);
    xhr.onreadystatechange=function () {
        if(this.readyState===4&&/^2\d{2}$/.test(this.status)){
            var data=utils.toJSON(this.responseText);
            callBack&&typeof callBack==='function'? callBack(data):null;
        }
    };
    xhr.send();
}
// console.log(data);
getData(bindData);
var timer;
function bindData(data) {
    len=data.length;
    var str='';
    var another='';
    for(var i=0;i<data.length;i++){
        str+='<li><img data-real='+data[i]['img']+'/>'+'</li>';
        another+= i===0? '<li class="selected"></li>':'<li></li>';
    }
    str+='<li><img data-real='+data[0]['img']+'/>'+'</li>';
    myList.innerHTML=str;
    focus.innerHTML=another;
    delayImgs();
    timer=setInterval(move,3000);
    bindEvent();
}

function delayImgs() {
    for(var j=0;j<oImgs.length;j++){
        checkImg(oImgs[j]);
    }
}
function checkImg(img) {
    var Img=new Image;
    var imgSrc=img.getAttribute('data-real');
    Img.src=imgSrc;
    Img.onload=function () {
        img.src=imgSrc;
        Img=null;
    }
}
var step=0;
function move(m) {
    step++;
    if(typeof m !='undefined'){
        step=m;
    }
    if(step>len){
        utils.css(myList,'left',0);
        step=1;
    }
    zfAnimate({
        ele:myList,
        target:{
            left:step*-wid,
        },
        duration:300
    })
    changeFocus(step);

}
function changeFocus(n) {
    n>=len? n=0:null;
    for(var k=0;k<oLis.length;k++){
        cur=oLis[k];
        k===n? utils.addClass(cur,'selected'):utils.removeClass(cur,'selected');
    }
}
function bindEvent() {
    for(var i=0;i<oLis.length;i++){
        oLis[i].index=i;
        oLis[i].onclick=function () {
            move(this.index);
        }
    }
}
sRight.onclick=function () {
    move();
}
sLeft.onclick=function () {
    step--;
    if(step<0){
        utils.css(myList,'left',len*-wid);
        step=len-1;
    }
    move(step);
}
box.onmouseover=function () {
    clearInterval(timer);
}
box.onmouseout=function () {
    clearInterval(timer);
    timer=setInterval(move,3000);
}