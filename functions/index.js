const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({
  origin: true,
});
const functions = require("firebase-functions");
const GEMINI_API_KEY = functions.config().gemini.api_key;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const axios = require("axios"); // axios 추가

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

exports.hashtagRecommendation = functions.https.onRequest(
  (request, response) => {
    cors(request, response, async () => {
      if (request.method == "POST") {
        const userInput = request.body.content;
        const prompt = {
          contents: [
            {
              parts: [
                {
                  text: `
                    너는 주어진 해시태그 리스트와 사용자가 입력한 게시글을 받아서, 게시글을 분석하여 연관도가 높은 해시태그를 추려야 해. 연관도는 주로 의미적 유사도나 텍스트 매칭을 기준으로 판단해. 
                    상위 10개 해시태그만 추려서, 아래와 같은 형식으로 반환해줘:
                     ["해시태그1", "해시태그2", "해시태그3", ...]

                    예시:
                    입력된 게시글: "학생들이 자주 사용하는 스터디룸에 대한 정보"
                    해시태그 리스트: ["스터디룸", "공부공간", "책대여", "캠퍼스활동", "강의실", "회의실"]
                    예상 출력: ["스터디룸", "공부공간", "캠퍼스활동", "강의실", "회의실"]
                    
                    다음은 내가 주는 데이터야:
                    해시태그 리스트: ${predefinedHashtags}
                    사용자 입력: ${userInput}
                  `,
                },
              ],
            },
          ],
        };

        try {
          // Google Generative AI API 호출
          console.log(prompt);
          const result = await axios.post(url, prompt, {
            headers: { "Content-Type": "application/json" },
          });
          // 반환된 응답에서 텍스트 추출
          const generatedText = result.data.candidates[0].content.parts[0].text;
          console.log(generatedText);

          // 해시태그 배열 반환
          response.status(200).json(generatedText);
        } catch (error) {
          console.error("API 호출 실패:", error);
          response.status(500).send("서버 오류");
        }
      } else {
        response.status(405).send("메서드 오류");
        response.status(404).send("존재하지 않는 url");
      }
    });
  }
);
