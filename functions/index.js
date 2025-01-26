const functions = require("firebase-functions");

const cors = require("cors")({
  origin: true,
});

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   cors(request, response, () => {
//     response.send("Hello from Firebase!");
//   });
// });

exports.hashtagRecommendation = functions.https.onRequest(
  (request, response) => {
    cors(request, response, () => {
      if (request.method == "POST") {
        const userInput = request.body.content;
        response.status(200).send(`input : ${userInput} - 성공`);
      } else {
        response.status(405).send("메서드 오류");
      }
    });
  }
);
