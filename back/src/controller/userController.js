const userDao = require("../dao/userDao");
const jwt = require("jsonwebtoken");
const {jwtSecret }= require ("../../secret");


// ##############   회원가입 #############

    // ##### 1. 값입력  ######
exports.signup = async function (req, res){
    const {email, password, nickname} = req.body;

    if(!email || !password || !nickname){    //필수값
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"회원가입 입력값을 확인해 주세요"
        });
    }

    //js 정규표현식 이메일
    const isValidEmail =
     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;       // 구글조회 // js 정규표현식 이메일 // copy

     if(!isValidEmail.test(email)){
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"이메일 형식을 확인해 주세요.",
        });
     }

    const isValidPassword =                                    // 구글조회 // js 정규표현식 password // copy
    /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/; 
    //영문, 숫자, 특수문자 중 2가지 이상 조합하여 10~20자리 이내의 암호 정규식
    
    if(!isValidPassword.test(password)){
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"패스워드 형식을 확인해 주세요. 영문, 숫자, 특수문자  10~20자리",
        });
     }

     if(nickname.length <2 || nickname.length >10){     //2글자 이상 10글자 미만
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"닉네임 형식을 확인해 주세요.  2~10글자 ",
        });
     }

    // ###### 2. 중복 회원 검사   ######
    const isDuplicatedEmail = await userDao.selectUserByEmail(email);   // 회원가입 이메일로  중복여부 검사
     if(isDuplicatedEmail.length > 0){                                 // 등록된 회원이면 row 값이 반환됨
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"이미 가입된 회원입니다.",
        });
     };


     // ##### 3. DB 입력   ######
     const insertUserRow = await userDao.insertUser(email, password, nickname);


     if(!insertUserRow){        // insertUserRow 값이 false 이면 
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"회원가입 실패 . 관리자에게 문의하세요.",
        });
     }
                               // insertUserRow 값이 true 이면 
     return res.send ({          
        isSuccess : true,
        code : 200,
        message :"회원가입 성공.",
    });

};


// ##################    로그인    ##################

    // #####   1. 값입력
exports.signin = async function(req, res) {
    const {email, password} = req.body;  
    // 배열의 비구조할당은 대괄호를 사용하고 객체의 비구조할당은 중괄호를 사용합니다.

    if(!email || !password){
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"회원정보를 입력해주세요.",
        });
    }

    // ####   2.  회원여부 검사
    const isValidUser = await userDao.selectUser(email, password);
        // 회원이면 isValidUser 에 회원정보 row 값이 들어옴 
    // return res.send(isValidUser) ;              // res.send 로 보냄

    if(!isValidUser){
        return res.send ({
            isSuccess : false,
            code : 410,           
            // 코드에 따라 
            // 클라이언트에서는 리턴되는 코드를 보고 조건문을 설정해서
            // 각 에러에 대한 대응을 할수 있개 만들수 있습니다.
            message :"DB 에러, 담당자에게 문의하세요.",    //에러시 차후 처리하는 미들웨어 필요함
        });
    }

    if(isValidUser.length <1){
        return res.send ({
            isSuccess : false,
            code : 400,
            message :"존재하지 않은 회원입니다.",
        });
    }

    // console.log(isValidUser)         // isValidUser 내의 정보확인
    // 회원정보가 있으면  아래 진행
    // #####  3.  jwt 토큰 발급
    const [userInfo]= isValidUser;     // 2. 회원여부 검사에서 받은 회원정보를 userInfo 에 넣음
    // []  첫번째 요소만 뽐음
    const userIdx = userInfo.userIdx;   // 회원정보에서 userIdx 뽐음

    const token = jwt.sign(
        {userIdx: userIdx} ,  //페이로드
        jwtSecret             // 시크릿 키   const {jwtSecret }= require ("../../secret");


    );
    return res.send({
        result :{token, token},  // 서버는 토큰을 object형태로 --- 클라이언트 --- 로  응답 response  보냄
        isSuccess : true,
        code : 200,
        message :"로그인 성공.",
    });

    
};


//#########  닉네임 얻기   #############

exports.getNicknameByToken = async function(req,res){
    const {userIdx} = req.verifiedToken;
    //console.log(userIdx);

    const [userInfo] = await userDao.selectNicknameByUserIdx(userIdx);  //객체 뽐음

    const nickname = userInfo.nickname;
   // console.log(nickname);

   // 응답보내기
    return res.send({
        result :{nickname : nickname},  // 토큰을 object형태로 보냄
        isSuccess : true,
        code : 200,
        message :"토큰 검증 성공",
    });

};