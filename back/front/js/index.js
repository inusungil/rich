// const token = localStorage.getItem("x-access-token");
// console.log(token);
// const unsigned = document.querySelector(".unsigned");
// unsigned.classList.add("hidden");
// console.log(2);
// console.log(url);


setHeader();


// ###########  헤더 정의 함수 ##########  로그인시  토큰이 있으면 , 안녕하세요 ***님
async function setHeader(){
    //로컬스토리지에 토큰 존재여부 검사
    const token = localStorage.getItem("x-access-token");
    //console.log(token);


    // #####    1. 토큰이 없으면 signed에 hidden 클래스 붙이기

    if(!token){
        const signed = document.querySelector(".signed");
        signed.classList.add("hidden");          // 로그인 회원가입 버튼이 뜸
        return;
    }

        // 토큰이 있으면   서버로 토큰을 보내고,  서버로 부터 응답(res) 을 받아 닉네임을 꺼낸다 
        // userRouter 위한 config 작성  -->  axios 보냄  
        // --> userController.getNicknamByToken 
        // --> userDao.selectNicknameByUserId
    const config ={
        method :"get",
        url : url + "/jwt",
        headers: {
            "x-access-token" : token,
        }
    };

        // 서버로 부터 응답(res) 을 받아
    const res = await axios(config);
 
    if(res.data.code !== 200){
        console.log("잘못된 토큰입니다.");   //서버에 로그남길것
        return;
    }


        // 서버로 부터 응답(res) 을 받아 닉네임을 꺼낸다
    const nickname = res.data.result.nickname;
 
        // span.nickname 찾아서 innerText 로  nickname을 넣는다
    const spanNickname = document.querySelector("span.nickname");
    spanNickname.innerText = nickname;          //Text update

    // #####  2. 토큰이 있으면 unsigned에  hidden 클래스 붙이기

    const unsigned = document.querySelector(".unsigned");
    unsigned.classList.add("hidden");          //  안녕하세요 *** 님.

}
//###############  로그 아웃 기능 ###############

const buttonSignout = document.getElementById("sign-out");

buttonSignout.addEventListener("click", signout);

function signout(){
    localStorage.removeItem("x-access-token");
    location.reload();
}



