readTodo();

//  ############# 1. 조회 (읽기) ##################

async function readTodo(){
    //  0 .토큰이 없으면 리턴
    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }

    // 토큰이 있으면
    //  1. 일정 조회 API  호출   ####
    
    const config ={
        method : "get",
        url : url +"/todos",
        headers : { "x-access-token ": token},  // header 에 토큰은 사실상 userIdx 와 같은 것임
        };
    try{
        const res = await axios(config);
       // console.log(res);                   // res 안에 있는  data.result 에  데이타들이 리턴되어 돌아옴

       if (res.data.code !==200){
            alert(res.data.message);
            return false;
       }

       const todoDataSet = res.data.result;   //  res의 data.result 에  데이타들이 리턴되어 돌아옴
       //console.log(todoDataSet);            // userIdx 에 따른 오브젝트 데이터 임

       for (let section in todoDataSet){
        //console.log(section);     //section 에 키값이 리턴 됨 do  decide delegate delete 
  
        //console.log (document.querySelector(`#${section} ul`));  //do 의 ul 태그 선택됨
        //index.html 에 ${section}  이 id로 delegate do delete로 설정되어있음

        // 각 섹션에 해당하는 ul 태그 선택
        const sectionUl = document.querySelector(`#${section} ul`);    //` ` 탬플릿 리터럴 

        // 각 섹션에 해당하는 데이터
        const arrayForEachSection = todoDataSet[section];    // userIdx 에  do decide delegate등 
        //console.log(arrayForEachSection);


        // 받은 데이터를 html 의 li 헝태로 만들어서 ul 태그에 붙여 넣는다
        let result =""; // 받을 빈 문자열


        for(let todo of arrayForEachSection){

            // li 부분을 만들어 inneHTML 로 붙여줄 예정
            // todo.todoIdx  는  id 형태로 넣어준다
            // todo.status 가 "C" 이면 "checked"를 넣고 아니면 " " 빈 문자를 넣는다
            let element =`
            <li class ="list-item" id=${todo.todoIdx}>  
                <div class="done-text-container">
                    <input type="checkbox" class="todo-done" ${todo.status==='C' ? "checked" : ""}/>   
                    
                    <p class ="todo-text">
                        ${todo.contents}
                    </p>
                </div>
           
    
                <div class="update-delete-container">  
                    <i class="todo-update fas fa-pencil-alt"></i>
                    <i class="todo-delete fas fa-trash-alt"></i>
                </div>
            </li>
            `;
            result += element ;
    
        }
        sectionUl.innerHTML = result;   // li 부분을 만들어 inneHTML 로 붙여줄 예정
       }
        

    }catch (err) {
        console.log(err);
    }
}
// html 에서 참고로 가져온 li 부분 (수정전 원본)
// <li class ="list-item">
//                 <div class="done-text-container">
//                     <input type="checkbox" class="todo-done">
//                     <p class ="todo-text">산책가기3</p>
//                 </div>
//                 <!-- done-text-container -->

//                 <div class="update-delete-container">  <!--fontawesome -->
//                     <i class="todo-update fas fa-pencil-alt"></i>
//                     <i class="todo-delete fas fa-trash-alt"></i>
//                 </div>
//             </li>


const buttonEnter = document.getElementById("enter");


// ##################   2. 일정 CUD    ##############

    // input 태그에 이벤트 위임을 사용함
const matrixContainer = document.querySelector(".matrix-container");   // input 태그에 이벤트 위임을 사용함
//console.log(matrixContainer);
matrixContainer.addEventListener("keypress",cudController);    // 입력    생성용   
matrixContainer.addEventListener("click",cudController);       // 클릭    수정 및 삭제용 

function cudController(event){

    // 우선 토큰 여부 확인
    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }


    //console.log(event);    // 이벤트의 필요한 객체(요소)를 조회한다

    // 이벤트 상수 정의하기
    // event.target.tagName
    const target = event.target;              // 이벤트가 일어난 곳
    const targetTagName = target.tagName;     // 이벤트가 일어난 태그네임
    const eventType = event.type;             // 이벤트의 종류는 ?
    const key = event.key;                    // 어떤 키가 눌렸나 ?

    console.log(target, targetTagName, eventType, key);

    // ㄱ. create 이벤트 처리

    if(targetTagName ==="INPUT" && key === "Enter"){       // input 에서 엔터키가 눌림
        createTodo(event, token);         // 하단에  ### 2. 생성하기  ######

        return;   // if 문에 걸리면 다음코드 읽을 필요 없음
    }
    if(targetTagName ==="BUTTON" && eventType === "click"){       // input 에서 엔터키가 눌림
     //   console.log("button press !!!");
        createTodo(event, token);         // 하단에  ### 2. 생성하기  ######

        return;   // if 문에 걸리면 다음코드 읽을 필요 없음
    }
    // ##########################################################
    //  buttonEnter.addEventListener("click",createTodo(event, token));
    // #########################################################


    // ㄴ. update 이벤트 처리

        // 체크박스 업데이트
            // <input type="checkbox" class="todo-done">
            // 클릭시  target.className 은 todo-done 임   
            //  target은 이벤트가 일어난 곳

    if( target.className === "todo-done" && eventType==="click"){
        updateTodoDone(event, token);     //  ### 3-1 checkbox 수정하기 ######
        return;     // if 문에 걸리면 다음코드 읽을 필요 없음
    }  


        // 콘텐츠 업데이트 (수정)
    const firstClassName = target.className.split(" ")[0]; 
            // <i class="todo-update fas fa-pencil-alt"></i>  // 연필아이콘
            // split   공백으로 구별하기
    if(firstClassName === "todo-update" && eventType ==="click"){
        updateTodoContents(event, token);   //  ### 3-2 내용 수정하기 ######
        return;    // if 문에 걸리면 다음코드 읽을 필요 없음
    }
    // ㄴ. update 이벤트 처리  끝   //




    // ㄷ. delete 이벤트 처리

    // const firstClassName = target.className.split(" ")[0];      //수정에서 이미 선언함 
    if(firstClassName === "todo-delete" && eventType ==="click"){
        deleteTodo(event, token);       //  ### 4. 삭제하기 ######
        return;
    }
}
// ##################   2. 일정 CUD  끝  ##############


//      ### 2. 생성하기  ######

async function createTodo(event, token){
 
    let contents =" ";
    if ( event.target.tagName==="INPUT"  ){
         contents = event.target.value;    //event.target 의 내용
    } 
    else{  
     
        // console.log(document.getElementsByClassName("matrix-input")[0].value);
        //contents =document.getElementsByClassName("matrix-input")[0].value;
        //console.log("input x   222"+event.target);
        contents = event.target.previousElementSibling.value;
        //console.log("event.target.previousSibling   "+contents);
        //  contents = event.target.closest(".matrix-input").value;
    }
    
    //input에서 가장 가까운 부모중 matrix-item의 id값을 가져온다    
    const type = event.target.closest(".matrix-item").id;   
    //console.log(1);
    //console.log("1111   " + contents , type);   //    "테스트"    decide

    if(!contents){
        alert ("내용을 입력해주세요");
        return false;
    }

    // config 작성 axios 이용하여 , 일정생성 API DB로 날리기
    const  config={
        method :"post",
        url : url+ "/todo",
        headers :{"x-access-token":token},
        data:{
            contents : contents,
            type : type,
        },

    };
    try{
        const res = await axios(config);

        if(res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트  
        readTodo();      // 서버가서 todo데이터를 화면에 다시 뿌리기
        event.target.value="";   // 엔터누르면 남은 문자열 지우기 
        //event.target.value 은 event.target 의 내용
        return true;
    
    }catch(err){
        console.error(err);
        return false;
    }
}

//      ### 3-1 checkbox 수정하기 ######

async function updateTodoDone(event, token){
    //console.log(event.target.checked);
    const status = event.target.checked ? "C" : "A" ;   //눌러서 checked가 true이면 "C"로 바꾼다
    console.log(status);
    console.log(1);

    //checkbox 에서 가장 가까운 부모중 list-item의 id값을 가져온다   
    const todoIdx = event.target.closest(".list-item").id;  //todoidx 찾기

    //console.log(todoIdx);
    // config 작성 axios 이용하여 , 일정수정 API DB로 날리기
    const  config={
        method :"patch",
        url : url + "/todo",
        headers :{"x-access-token":token},
        data:{
            todoIdx : todoIdx,
            status : status,   //const status = event.target.checked ? "C" : "A" ;
        },
    };
    try{
        const res = await axios(config);

        if(res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트
        readTodo();
        // event.target.value="";
        // return true;
    
    }catch(err){
        console.error(err);
        return false;
    }
}


//     ### 3-2 내용 수정하기 #######

async function updateTodoContents(event, token){
    //console.log(event.target.checked);
    const contents = prompt("내용을 입력해 주세요");    //프롬프트 입력 내용을  내용으로 받는다

    //수정아이콘 에서 가장 가까운 부모중 list-item의 id값을 가져온다 
    const todoIdx = event.target.closest(".list-item").id;

    //console.log(todoIdx);
    // config 작성 axios 이용하여 , 수정  API DB로 날리기
    const  config={
        method :"patch",
        url : url + "/todo",
        headers :{"x-access-token":token},
        data:{
            todoIdx : todoIdx,
            contents : contents,
        },

    };
    try{
        const res = await axios(config);

        if(res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트
        readTodo();
        // event.target.value="";
        // return true;
    
    }catch(err){
        console.error(err);
        return false;
    }
}


//      ### 4. 삭제하기 ######

async function deleteTodo(event, token){

    const isValidReq = confirm("삭제하세겠습니까 ? 삭제후에는 복구가 어렵습니다.");
    
    if(!isValidReq){
        return false;
    }

    
    const todoIdx = event.target.closest(".list-item").id;

    // config 작성 axios 이용하여 , url 에 /todo/:todoIdx" 넣어 ,  삭제  API DB로 날리기
    const  config={
        method :"delete",
        //url : url + "/todo/" + todoIdx,   // todoIdx 넣기  // 인덱스값을 path valiable  로
        url : url + `/todo/${todoIdx}`,
        headers :{"x-access-token":token},
       

    };
    try{
        const res = await axios(config);

        if(res.data.code !==200){
            alert(res.data.message);
            return false;
        }

        // DOM 업데이트
        readTodo();
        // event.target.value="";
        // return true;
    
    }catch(err){
        console.error(err);
        return false;
    }
}
