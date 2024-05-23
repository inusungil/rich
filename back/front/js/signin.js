//토큰이 있으면   로그인 못들어와야 함
// ##############  B. 토큰 검사  ##############  

const token = localStorage.getItem("x-access-token");
if (token){
    alert("로그아웃 후 이용해 주세요");
    location.href= "index.html";
}
// ######  토큰 검사 끝   ############


const buttonSignin  = document.getElementById("signin");
const inputEmail    = document.getElementById("email");
const inputPassword = document.getElementById("password");



// ##############  A. 로그인  API 요청 #################

buttonSignin.addEventListener("click", signin);

    // 로그인 처리 함수
async function signin(event){
    const currentEmail    = inputEmail.value;
    const currentPassword = inputPassword.value;

    if (!currentEmail || ! currentPassword){
        return false;
    }

    // 로그인 API 요청
    // userRouter 위한 config 작성  -->  axios 보냄  
        // --> userController.singin 
        // --> userDao.selectUser
    const config = {
        method : "post",
        url : url + "/sign-in",
        data : {
            email :currentEmail,
            password : currentPassword,
        },
    };
    
    try{
        const res = await axios(config);
        //console.log(res);
        if (res.data.code !==200){        
            alert(res.data.message);     // 로그인 실패 메세지("존재하지 않는 회원입니다")
            return false;
        }

       // ####   로컬스토리지에 jwt token 저장
        localStorage.setItem("x-access-token", res.data.result.token);  
        alert (res.data.message);       // 로그인 성공 메세지
        location.href = "index.html";   // index.html로 가서 향후 index.js의 setHeader() 실행 닉넥임 가져와서 환영합니다. ***님 띄움
        return true;

    } catch(err){
        console.log(err);
    }
    
}