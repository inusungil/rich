const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./secret");

exports.jwtMiddleware = async function (req, res, next) {
  // 헤더에서 토큰 꺼내기
  const token = req.headers["x-access-token"];

  // 토큰이 없는 경우
  if (!token) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "로그인이 되어 있지 않습니다.",
    });
  }

  // 토큰이 있는 경우, 토큰 검증
  try {
    //jwt.verify(token, jwtSecret) --> 클라이언트 로그인시 발급받은 토근과 서버에서 보낸 토큰이 맞는지 검증함
    const verifiedToken = jwt.verify(token, jwtSecret);   
    
    req.verifiedToken = verifiedToken;       // 검증된 토큰을 요청검증토큰에 넣었기 때문에 일정생성 수정 삭제에서 사용가능함
    next();
  } catch {
    return res.send({
      isSuccess: false,
      code: 403,
      message: "토큰 검증 실패",
    });
  }
};