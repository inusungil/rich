const indexDao = require("../dao/indexDao");

//########## todo 입력하기  ###########

exports.createTodo = async function(req, res){
    const {userIdx} = req.verifiedToken;         // 검증된 토큰을 요청검증토큰에 넣었기 때문에 일정생성 수정 삭제에서 사용가능함
    const { contents, type} = req.body;
    // console.log(userIdx, contents, type);


    // #####   입력 유효성 검사  ###
    if(!userIdx || !contents || !type){
        return res.send({
            isSuccess : false,
            code :400,
            message :"입력값이 누락됐습니다.",
        });
    }
    //contents 20글자 초과 불가
    if(contents.length >20){
        return res.send({
            isSuccess : false,
            code :400,
            message :"콘텐츠는 20글자 이하로 설정해 주세요.",
        });
    }
    //type : do, decide, delete, delegate  유효성확인
    const validTypes =["do", "decide", "delete","delegate"];
    if(!validTypes.includes(type)){
        return res.send({
            isSuccess : false,
            code :400,
            message :"유효한 타입이 아닙니다.",
        });
    }
    // #####입력 유효성 검사 끝 ######
    
    // 실제 Mysql 입력하기    indexDao.insertTodo  사용
    const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);
    //console.log(insertTodoRow);
    if(!insertTodoRow){
        return res.send({         // postman responce body 에 출력
            isSuccess : false,
            code :403,
            message :"요청에 실패했습니다. 관리자에게 문의해주세요."
        });
    }

    return res.send({           // postman responce body 에 출력
        isSuccess : true,
        code :200,
        message :"일정 생성 성공"
    });
};  

//###############     todo 읽기(일정조회)      ###############

exports.readTodo = async function (req, res){


    // 읽기
    // const {userIdx}= req.params;
    const {userIdx} = req.verifiedToken;  // 검증된 토큰을 요청검증토큰에 넣었기 때문에 일정생성 수정 삭제에서 사용가능함
    
    // 타입별 할일 선택
        // 1. 할일들
        // 2. 타입별 구분
    const todos ={};
    const types =["do", "decide","delegate","delete"];
    
    for(let type of types){
        //const selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);
        let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);

        if(!selectTodoByTypeRows) {
            return res.send({
                isSuccess : false,
                code :400,
                message :"일정 조회 실패 . 관리자에게 문의해 주세요",
            });
        }
        todos[type] = selectTodoByTypeRows;
    }


    return res.send({
        result : todos,
        isSuccess : true,
        code : 200,
        message : "일정 조회 성공",
    });

};

//###############   todo 수정(업데이트)    ##################

exports.updateTodo = async function(req, res){

    //let {userIdx, todoIdx, contents, status} = req.body;
    const {userIdx} = req.verifiedToken;   // 검증된 토큰을 요청검증토큰에 넣었기 때문에 일정생성 수정 삭제에서 사용가능함

    let {todoIdx, contents, status} =req.body;

    if(!userIdx || !todoIdx){        // userIdx, todoIdx 는 필수요소 임
        return res.send({
            isSuccess : false,
            code : 400,
            message : "userIdx와 todoIdx를 보내주세요.",
        }); 
    }

    if(!contents){               // 오지 않으면 null  처리
        contents = null;
    }

    if(!status){                // 오지 않으면 null  처리
        status = null;
    }
    
    // 유효성 검사 요청과 응답     userIdx, todoIdx 값이 같이 존재한 것이 실제 존재하는 가 ?
    const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
               // 없으면 isValidTodoRow  가 빈 리스트임
    if(isValidTodoRow.length <1){
        return res.send({
            isSuccess : false,
            code : 400,
            message : " 유효한 요청이 아닙니다. userIdx와 todoIdx를 확인하세요.",
        }); 
    }
               // 있으면  
    // 수정 요청
    const updateTodo = await indexDao.updateTodo(userIdx, todoIdx, contents, status);

    if(!updateTodo){
        return res.send({
            isSuccess : false,
            code : 400,
            message : " 수정 실패. 관리자에게 문의해 주세요.",
        }); 
    }
    
    return res.send({
        isSuccess : true,     //필요에 따라서 result 를 보낼수 있음
        code : 200,
        message : " 수정 성공",
    }); 

  
};

//##############     todo 삭제    ##################

exports.deleteTodo = async function(req, res){
    //const {userIndx, todoIdx}= req.params;
    
    const {userIdx} = req.verifiedToken;   // 검증된 토큰을 요청검증토큰에 넣었기 때문에 일정생성 수정 삭제에서 사용가능함
    const {todoIdx} = req.params;
    
    if(!userIdx || !todoIdx){         //값이 둘다 제대로 왔는가 ?
        return res.send({
            isSuccess : false,
            code : 400,
            message : "userIdx와 todoIdx를 보내주세요.",
        }); 
    }

    // 유효성 검사 요청과 응답       //userIndx, todoIdx 값이 둘다 제대로 왔는가 ?
    const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    
    if(isValidTodoRow.length <1){
        return res.send({
            isSuccess : false,
            code : 400,
            message : " 유효한 요청이 아닙니다. userIdx와 todoIdx를 확인하세요.",
        }); 
    }

    // 삭제하기 ==>  status 를 D 로 바꾸기
    const deleteTodo = await indexDao.deleteTodo(userIdx, todoIdx);   // status 를 D 로 바꾸기

    if(!deleteTodo){
        return res.send({
            isSuccess : false,
            code : 400,
            message : " 삭제 실패. 관리자에게 문의해 주세요.",
        }); 
    }

    return res.send({
        isSuccess : true,
        code : 200,
        message : " 삭제 성공",
    });   
};