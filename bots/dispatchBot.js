const { ActivityHandler } = require("botbuilder");
const { LuisRecognizer, QnAMaker } = require("botbuilder-ai");

class DispatchBot extends ActivityHandler {
  constructor() {
    super();
    const dispatchRecognizer = new LuisRecognizer(
      {
        applicationId: process.env.LuisAppId,
        endpointKey: process.env.LuisAPIKey,
      },
      {
        includeAllIntents: true,
        includeInstanceData: true,
      },
      true
    );

    const qnaMaker = new QnAMaker({
      knowledgeBaseId: process.env.QnAKnowledgebaseId,
      endpointKey: process.env.QnAEndpointKey,
      host: process.env.QnAEndpointHostName,
    });

    this.dispatchRecognizer = dispatchRecognizer;
    this.qnaMaker = qnaMaker;

    this.onMessage(async (context, next) => {
      console.log("Processing Message Activity.");

      const recognizerResult = await dispatchRecognizer.recognize(context);

      const intent = LuisRecognizer.topIntent(recognizerResult);

      await this.dispatchToTopIntentAsync(context, intent, recognizerResult);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const welcomeText =
        "Ask for a question about our hotel or for room availability.";
      const membersAdded = context.activity.membersAdded;

      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(
            `Hi 👋, welcome to our Hotel! I am Jane. Your friendly bot agent 🤖. \\\n ${welcomeText}`
          );
        }
      }
      await next();
    });
  }

  async dispatchToTopIntentAsync(context, intent, recognizerResult) {
    switch (intent) {
      case "RoomAvailability":
        await this.processRoomAvailability(
          context,
          recognizerResult.luisResult
        );
        break;
      case "q_sample-qna":
        await this.processSampleQnA(context);
        break;
      case "BookDetails":
        await this.processBookDetails(context, recognizerResult.luisResult);
        break;
      default:
        console.log(`Dispatch unrecognized intent: ${intent}.`);
        await context.sendActivity(`Dispatch unrecognized intent: ${intent}.`);
        break;
    }
  }
  async processRoomAvailability(context, luisResult) {
    console.log("processRoomAvailability");

    const result = luisResult.connectedServiceResult;
    let dispatchvar2 = false;
    module.exports.dispatchvar2 = { dispatchvar2: dispatchvar2 };
    module.exports.bookingDetails = {};

    if (luisResult.entities.length > 0) {
      await context.sendActivity(
        `ProcessRoomAvailability entities were found in the message: ${luisResult.entities
          .map((entityObj) => entityObj.entity)
          .join("\n\n")}.`
      );
    }
  }
  async processBookDetails(context, luisResult) {
    const bookingDetails = {};
    /* const result = luisResult.connectedServiceResult;  */
    const result = luisResult;
    let i;
    for (i = 0; i < result.entities.length; i++) {
      if (result.entities[i]["type"] == "builtin.datetimeV2.date") {
        if (bookingDetails["checkd1"]) {
          if (result.entities[i].resolution.values[0]["timex"]) {
            if (Object.keys(result.entities[i].resolution.values).length <= 1) {
              bookingDetails["checkd2"] =
                result.entities[i].resolution.values[0]["timex"];
            } else {
              bookingDetails["checkd2"] =
                result.entities[i].resolution.values[1]["value"];
            }
          } else {
            bookingDetails["checkd2"] = result.entities[i]["entity"];
          }
        } else {
          if (result.entities[i].resolution.values[0]["timex"]) {
            if (Object.keys(result.entities[i].resolution.values).length <= 1) {
              bookingDetails["checkd1"] =
                result.entities[i].resolution.values[0]["timex"];
            } else {
              bookingDetails["checkd1"] =
                result.entities[i].resolution.values[1]["value"];
            }
          } else {
            bookingDetails["checkd1"] = result.entities[i]["entity"];
          }
        }
      } else if (result.entities[i]["type"] == "builtin.datetimeV2.daterange") {
        if (result.entities[i].resolution.values[0]["timex"]) {
          bookingDetails["checkrange"] =
            result.entities[i].resolution.values[0]["timex"];
          let today = new Date();
          let checkindate1 = result.entities[i].resolution.values[0]["start"];
          const partscheckin = checkindate1.split("-");
          let checkoutdate1 = result.entities[i].resolution.values[0]["end"];
          const partscheckout = checkoutdate1.split("-");
          if (
            partscheckin[0] <= today.getFullYear() &&
            partscheckin[2] <= today.getMonth()
          ) {
            if (
              partscheckin[1] > today.getDate() &&
              partscheckin[0] == today.getFullYear() &&
              partscheckin[2] == today.getMonth()
            ) {
              bookingDetails["checkd1"] =
                result.entities[i].resolution.values[0]["start"];
            } else {
              bookingDetails["checkd1"] =
                result.entities[i].resolution.values[1]["start"];
            }
          } else {
            if (Object.keys(result.entities[i].resolution.values).length <= 1) {
              bookingDetails["checkd1"] =
                result.entities[i].resolution.values[0]["start"];
            } else {
              bookingDetails["checkd1"] =
                result.entities[i].resolution.values[1]["start"];
            }
          }
          if (
            partscheckout[0] <= today.getFullYear() &&
            partscheckout[2] <= today.getMonth()
          ) {
            if (
              partscheckout[1] > today.getDate() &&
              partscheckout[0] == today.getFullYear() &&
              partscheckout[2] == today.getMonth()
            ) {
              bookingDetails["checkd2"] =
                result.entities[i].resolution.values[0]["end"];
            } else {
              bookingDetails["checkd2"] =
                result.entities[i].resolution.values[1]["end"];
            }
          } else {
            if (Object.keys(result.entities[i].resolution.values).length <= 1) {
              bookingDetails["checkd2"] =
                result.entities[i].resolution.values[0]["end"];
            } else {
              bookingDetails["checkd2"] =
                result.entities[i].resolution.values[1]["end"];
            }
          }
        } else {
          bookingDetails["checkrange"] = result.entities[i]["entity"];
        }
      } else {
        let e = result.entities[i];
        let l = e["type"];
        let m = e["entity"];
        bookingDetails[l] = m;
      }
    }
    let dispatchvar2 = false;
    module.exports.dispatchvar2 = { dispatchvar2: dispatchvar2 };
    module.exports.bookingDetails = bookingDetails;

    const topIntent = result.topScoringIntent.intent;
  }
  async processSampleQnA(context) {
    console.log("processSampleQnA");

    const results = await this.qnaMaker.getAnswers(context);
    let dispatchvar2 = true;
    module.exports.dispatchvar2 = { dispatchvar2: dispatchvar2 };

    if (results.length > 0) {
      await context.sendActivity(`${results[0].answer}`);
    } else {
      await context.sendActivity(
        "Sorry, could not find an answer in the FAQ system."
      );
    }
  }
}
let dispatchvar2 = true;
module.exports.dispatchvar2 = { dispatchvar2: dispatchvar2 };
module.exports.DispatchBot = DispatchBot;
