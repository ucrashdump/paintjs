const canvas = document.getElementById("jsCanvas");
//짧은 복습 
//canvas는 html5 요소
//css에서 크기를 정해줘야 함. 
//그 다음에는 canvas에서 움직일 부분 pixel 크기 canvas.width,canvas.height를 정해줘야 한다.

const ctx = canvas.getContext('2d');
//context는 canvas에서 위치 혹은 픽셀같은 개념이다.
//canvas의 경우는 css의 크기가 필요하지만 js 에서는 따로 또 픽셀을 요소로써 정의하여
//사용할 수 있는 픽셀 위치 및 크기가 또 필요하다. 
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const INITIAL_COLOR = "#2c2c2c"
const CANVAS_SIZE = 700;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
ctx.fillStyle = "white";
ctx.fillRect(0,0,canvas.width, canvas.height);
//canvas.width = canvas.offsetWidth;
//canvas.height = canvas.offsetHeight;
//자바스크립트에서 인식할 수 있는 위치 혹은 pixel modifier 가 필요하다.
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
//칠할 색깔
//fill이면 전부 채우는 거고, stroke의 경우는 해당 부위만 건드려서 칠하는 것
ctx.lineWidth = 2.5;
//linewidth의 경우는 해당 붓의 크기라고 보면 된다.(여기서는 슬라이더에 따른 붓크기)

let painting = false;
let filling = false;
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke
function stopPainting(){
    painting = false;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y= event.offsetY;
    // console.log(x,y);
    // console.log(event);
    //mounseevent에서 offsetX,offsetY를 찾는다.
    //begin path movepath fillthepath closepath
    //path는 선이라고 보면 된다.
    if(!painting){
        //버튼을 누르지 않은 경우. 그냥 보이지 않는 path만 계속 만들고 있음.
        ctx.beginPath();//path를 만들고
        ctx.moveTo(x, y);//실제 패스 첫 위치를 지정해줌.
        // console.log("creating path in",x,y);
    } else {
        //만약 마우스버튼을 클릭했을 경우 ->처음에는 move를 첫위치로 잡으나, 그다음에는
        //line기준으로 계속 쫓아가게 된다.
        ctx.lineTo(x, y);//sub-path의 마지막점을 특정좌표의 점까지 연결한다.
        //path를 만들면 lineto 를 호출할 경우 해당 점까지 연결한다. 
        ctx.stroke();
        // console.log("creating line in",x,y);
        //ctx.closePath();// 이를 넣을 경우 처음의 beginpath만 남게되므로 우산살처럼 점을 기준으로 흩뿌리는 모양의 그림이 출력된다.
    }
}

function startPaiting(){
    painting = true;
}

function onMouseDown(event){
    painting = true;
}

function onMouseUp(event){
    stopPainting();
}

function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;//원래 있는 색깔(검정)을 변경
    ctx.fillStyle = color;
    // console.log(color);
    // console.log(event.target.style);

}
function handleRangeChange(event){
    // console.log(event.target.value);
    const size = event.target.value;
    ctx.lineWidth = size;
}
function handleModeClick(event){
    if(filling === true){
        filling = false;
        mode.innerText="Fill";
    } else {
        filling = true;
        mode.innerText="Paint";
    }

}
function handleCanvasClick(){
    if(filling){
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}

function handleCM(event){
    // console.log(event);
    event.preventDefault();//마우스 오른쪽 클릭 방지.
}
function handleSaveClick(event){
    // const image = canvas.toDataURL("image/jpeg");
    const image = canvas.toDataURL();
    // console.log(image);
    const link = document.createElement("a");
    link.href = image
    link.download = "PaintJS[🎨]";
    console.log(link);
    link.click();
    //link mdn download
    //.click is a function that ＜a＞ has on Javascript.
    //https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent
/*
function handleSaveClick() {
  canvas.toBlob(function(blob) {
    const link = document.createElement("a");
    link.download = "PaintJS[🎨]";
    link.href = URL.createObjectURL(blob);
    link.click();
  });
}
*/
}

if (canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPaiting);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click",handleCanvasClick);
    canvas.addEventListener("contextmenu",handleCM);
}

// console.log(colors);//HTMLCollection 으로 출력됨.
// console.log(Array.from(colors));//Array 로 변경해서 보여줌.


Array.from(colors).forEach(potato => potato.addEventListener("click",handleColorClick));
if(range){
    range.addEventListener("input", handleRangeChange);//input에 반응함.
}
if (mode){
    mode.addEventListener("click",handleModeClick);
}
if(saveBtn){
    saveBtn.addEventListener("click",handleSaveClick);
}

//Array 로 만들어서 forEach로 돌릴 수 있도록 만들고
//forEach 로 color를 돌려서(1차 결과물 이름을 color로 지정,)
//여기서는 전혀 상관 없는 이름으로 지정하기 위해서 고의로 potato로 함
//1차 결과물이 potato, potato변수는 array 안에 있는 각각의 아이템을
//대표하는 변수 이름일 뿐.
//해당 color마다(혹은 potato마다) addEventListener("click", handleColorClick)
//을 호출하고 
// forEach를 여러 개 사용할 수 있지만, 
/*
function getColor() {
  for (let i = 0; i < colors.length; i++) {
    colors[i].addEventListener("click", function (event) {
      ctx.strokeStyle = colors[i].style.backgroundColor;
    });
  }
}
getColor()
이렇게 만든 사람도 있으나, forEach를 정확하게 아는 것이 매우
중요하다. (이렇게 만든 사람이 못한다는 의미가 아님.)
여튼간에 적은 코드가 훨씬 유용하며 forEach를 정확하게 알아라.
그것이 중요하다.
참고로 class를 직접 지정하여 색깔을 지정하는 경우가 있는데,
이때는 요소(Element)에 직접적으로 칼라를 넣는 방식이
아니므로, 
" arrColour.forEach(div => console.log(getComputedStyle(div).backgroundColor)) "

Array.from(colors, color => {
  color.addEventListener("click", handleColorClick);
});
방법으로 하는 경우가 있는데 일단은 된다.
다만 여기서 소개하지 않은 이유는 이는 forEach 방법이 아니라
array.from의 2번째 입력자가 mapFunction 인데, 어렵지 않게
잘 아는 forEach를 사용하기 위해서 해당방법은 택하지 않았다.



2. 안보고 소스코드를 쳐보고, 완성된 프로젝트에 초기화 해주는 기능을 추가해봤는데..
button에 Clear
이렇게 주고 js파일에서 const clear = getElementsByClassName("js_clear") 으로 넣고 
if(clear) 안에  clear.addEventListner("click", canvasClear) 이렇게 줬는데
브라우저를 로드할때부터 canvasClear not a function 이라고 나오는거 같더라고요.
고치려고 하다가 안되서 getElementById로 받으니까 또 되서 왜 그런가 했다가..
getElementsByClassName은 반환이 복수(배열)로 되서 오류가 나는거 같더라고요.
제가 이해한게 맞는건가요? getElementById는 요소 한개만 리턴, getElementsByClassName은 배열로 리턴되어
Array.from.forEach를 써서 받는다고 이해했는데...

Hi! You can't add an event listener to an array.

getElementsByClassName = []
[].addEventListener = NOT POSSIBLE

[].forEach(e => e.addEventListener) = POSSIBLE.


https://gitlab.com/n113345/nomadcoders 소스입니다! vanila javascript2 폴더구요 블로그를 운영중인데 코드 설명을 조만간 올릴 예정입니다!!ㅋㅋㅋ  https://jongbeom-dev.tistory.com/category/Vanilla%20JavaScript%20%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EA%B7%B8%EB%A6%BC%ED%8C%90%20%EC%95%B1


*/

























//이모지 사용방법 "windows key" +" ."  
// "windows key" +" ;"
// Cmd + Shift + Space on MacOS
/*const는 상수 처럼 변하지 않는것 아닌가요??

근데 object선언시 const로 선언후에 gender값을 바꾸어 주셨잖아요

왜 가능할까요?
//I did not change the value of the constant. I changed gender inside of an object  but the 'const' is still the same.
*/

/*
How do I use 'console.log' and debug it in VS code?? In VS code, they said Debug With Node.js(?), so I installed Node.js and tried again. However, there was only "Can not find 'node' on PATH. Is 'node' installed?" message....
It looks like this is Windows, make sure you can call 'node -v' on the console, if you can't, reinstall it again.
*/
/*
Thanks to your video, I understand Object easily!

Object: ① a user can give it a name. ② it uses curly bracket {} ③ arrays can be put into the object -> objects can be put into the array

*/