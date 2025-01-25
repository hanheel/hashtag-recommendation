const functions = require("firebase-functions");
const axios = require("axios");

// 미리 지정된 해시태그 리스트
const predefinedHashtags = [];

// Gemini API 키
const GEMINI_API_KEY = functions.config().gemini.api_key;

// 해시태그 추천 함수
exports.getHashtags = functions.https.onRequest(async (req, res) => {
  //클라이언트에서 보낸 게시글
  const postContent = req.body.content;
  // 프롬프트
  const prompt = `
    여기 주어진 게시글 내용에 대해 연관성이 높은 해시태그를 추천해주세요. 
    다음은 가능한 해시태그 목록입니다: 
    ${predefinedHashtags.join(", ")}
    게시글 내용: ${postContent}
    추천할 해시태그 10개를 반환하세요.
  `;

  try {
    const response = await axios.post(
      "https://api.google.com/gemini-endpoint",
      {
        input: postContent,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 256,
      },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const hashtags = response.data.related_hashtags;
    // 상위 10개 해시태그
    res.status(200).json({ hashtags: hashtags.slice(0, 10) });
  } catch (error) {
    console.error("Error fetching hashtags:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
