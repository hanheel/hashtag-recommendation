const functions = require("firebase-functions");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 해시태그 리스트
const predefinedHashtags = [
  "도서관",
  "책대여",
  "열람실",
  "공부공간",
  "자료검색",
  "안전관리",
  "위험대응",
  "응급",
  "캠퍼스안전",
  "시설점검",
  "정보통신",
  "IT지원",
  "인터넷",
  "네트워크",
  "장비연결",
  "기자재",
  "비품관리",
  "사무용품",
  "설비",
  "장비대여",
  "공간대여",
  "강의실",
  "회의실",
  "스터디룸",
  "캠퍼스공간",
  "총무",
  "구매관리",
  "물품조달",
  "행정지원",
  "예산운영",
  "일반대학원",
  "석박사",
  "연구과정",
  "대학원생활",
  "학위취득",
  "특수대학원",
  "실무중심",
  "직장인대학원",
  "학위프로그램",
  "교육대학원",
  "교사양성",
  "교육연수",
  "학위과정",
  "경영대학원",
  "MBA",
  "비즈니스교육",
  "리더십개발",
  "경영학석사",
  "취업",
  "채용정보",
  "커리어개발",
  "취업지원",
  "직무교육",
  "경력개발",
  "커리어성장",
  "직무전환",
  "스킬업",
  "전문성향상",
  "현장실습",
  "인턴쉽",
  "캠퍼스실습",
  "직무체험",
  "실무교육",
  "학사",
  "학사관리",
  "수업운영",
  "졸업요건",
  "수강신청",
  "장학",
  "장학금",
  "장학생",
  "경제지원",
  "교육기회",
  "제증명",
  "증명서발급",
  "학적서류",
  "행정서비스",
  "서류신청",
  "학생활동지원",
  "동아리",
  "학생회",
  "캠퍼스활동",
  "학생복지",
  "장애",
  "장애학생지원",
  "편의시설",
  "특별지원",
  "장애인권",
  "사회봉사",
  "자원봉사",
  "사회공헌",
  "캠퍼스봉사",
  "봉사활동",
  "등록",
  "등록금",
  "등록절차",
  "학비납부",
  "수납안내",
  "국제",
  "유학",
  "국제교류",
  "어학연수",
  "글로벌경험",
];

// Gemini API 키
const GEMINI_API_KEY = functions.config().gemini.api_key;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 해시태그 추천 함수
exports.getHashtags = functions.https.onRequest(async (req, res) => {
  // 클라이언트에서 보낸 게시글
  const postContent = req.body.content;
  // 프롬프트
  const prompt = `
  다음은 게시글 내용과 선택할 수 있는 해시태그 리스트야.
    주어진 해시태그 리스트 중 연관성이 높은 해시태그를 추려줘.
    추천 해시태그는 10개만 반환해줘.
    다음은 해시태그 리스트야: 
    ${predefinedHashtags.join(", ")}
    게시글 내용: ${postContent}
    추천할 해시태그 10개를 반환해줘.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);

    // const hashtags = response.data.related_hashtags;
    // // 상위 10개 해시태그
    // res.status(200).json({ hashtags: hashtags.slice(0, 10) });

    res.status(200).json({ result });
  } catch {
    console.error("해시태그를 가져오는 도중 에러가 발생했습니다.");
    res.status(500).send("서버 에러 발생");
  }
});
