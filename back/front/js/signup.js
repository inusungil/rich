// 토큰이 있으면 회원가입 못들어 오게함
// ################  C. 토큰 검사  ############  

const token = localStorage.getItem("x-access-token");
if (token){
    alert("로그아웃 후 이용해 주세요");
    location.href= "index.html";
}
// ######  토큰 검사 끝

 

//################ A. 입력값 유효성 검사 ################

    //  1. 이메일
const inputEmail = document.getElementById("email");
const emailMessage = document.querySelector("div.email-message");
inputEmail.addEventListener("input",isValidEmail);                   //텍스트는 input 이벤트

    // 2. 비밀번호
const inputPassword = document.getElementById("password");
const passwordMessage = document.querySelector("div.password-message");
inputPassword.addEventListener("input",isValidPassword);

    //  3. 비밀번호 확인
const inputPasswordConfirm = document.getElementById("password-confirm");
const passwordConfirmMessage = document.querySelector("div.password-confirm-message");
inputPasswordConfirm.addEventListener("input",isValidPasswordConfirm);

    //  4. 닉네임
const inputNickname = document.getElementById("nickname");
const nicknameMessage = document.querySelector("div.nickname-message");
inputNickname.addEventListener("input",isValidNickname);


    // 1-1. 이메일 형식검사
function isValidEmail(event){
   
    const currentEmail = inputEmail.value;  //const inputEmail = document.getElementById("email");
 
    const emailReg =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        
        if(!emailReg.test(currentEmail)){
            emailMessage.style.visibility ="visible";  
                                 //const emailMessage = document.querySelector("div.email-message");
            return false;
        }
        emailMessage.style.visibility ="hidden";
        return true;

}

    // 2-1. 패스워드 형식검사
function isValidPassword(event){
   
    const currentPassword = inputPassword.value;  //const inputPassword = document.getElementById("password");
   
    const passwordReg =
        /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/; 

        if(!passwordReg.test(currentPassword)){
            passwordMessage.style.visibility ="visible";
            return false;
        }
        passwordMessage.style.visibility ="hidden";
        return true;

}

    // 3-1. 패스워드 확인 검사
function isValidPasswordConfirm(event){
   
    const currentPassword = inputPassword.value;  //const inputPassword = document.getElementById("password");
   
    const currentPasswordConfirm = inputPasswordConfirm.value; 
                                     //const inputPasswordConfirm = document.getElementById("password-confirm");
  
    if(currentPassword !==currentPasswordConfirm){
        passwordConfirmMessage.style.visibility ="visible";
        return false;
    }
    passwordConfirmMessage.style.visibility ="hidden";
    return true;

}

    // 4-1. 닉네임 검사
function isValidNickname(event){
 
    const currentNickname= inputNickname.value;
   
    if(currentNickname.length < 2 || currentNickname.length >10 ){
        
        nicknameMessage.style.visibility ="visible";
        return false;
    }
    nicknameMessage.style.visibility ="hidden";
    return true;

}


// ############### B. 회원가입 API 요청   ###############


const buttonSignup = document.getElementById("signup");
buttonSignup.addEventListener("click", signup);       // 회원가입  버튼은 클릭이벤트
 
    // 1. 유효성성 완료 검사
async function  signup(event){            //async   await
    const isValidReq = 
        isValidEmail() && 
        isValidPassword() &&
        isValidPasswordConfirm() && 
        isValidNickname();
        
    if(!isValidReq){
        alert("회원 정보를 확인해 주세요");         
    }

    // 2. 입력값들로  config 작성후   axios  작업
    const currentEmail= inputEmail.value;
    const currentPassword = inputPassword.value;
    const currentNickname = inputNickname.value;

     // userRouter 위한 config 작성  -->  axios 보냄  
        // --> userController.singup 
        // --> userDao.insetUser

    const config ={
        method :"post",
        url : url + "/user",                //url 은 common.js 에 입력되어 있음
        data : {
            email : currentEmail,
            password : currentPassword,
            nickname : currentNickname,
        },
    };
    try{
        const res = await axios(config);   
        // console.log(res);

        if(res.data.code === 400){        // 잘못된 입력(형식에러 또는 이미 가입된 회원등)이면  
            alert(res.data.message);
            location.reload();            // 새로 고침
            return false;
        }
        if(res.data.code === 200){
            alert(res.data.message);
            location.href = "signin.html";    //로그인 페이지로  이동
            return true;
        }


    } catch (err) {
        console.erreor(err);

    }
}


