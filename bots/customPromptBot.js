const Recognizers = require("@microsoft/recognizers-text-suite");
const { ActivityHandler } = require("botbuilder");
const CONVERSATION_FLOW_PROPERTY = "CONVERSATION_FLOW_PROPERTY";
const USER_PROFILE_PROPERTY = "USER_PROFILE_PROPERTY";
const { Connection, Request } = require("tedious");
let dispatchvar3 = false;
let dispatchvar4 = false;
let clearmemory = false;
const list1 = [
  "yes",
  "y",
  "yeap",
  "yeah",
  "ok",
  "correct",
  "agree",
  "continue",
  "sure",
  "absolutely",
  "alright",
  "all right",
  "definetely",
  "certainly",
  "agreed",
  "of course",
];
const list2 = [
  "no",
  "n",
  "nope",
  "not at all",
  "disagree",
  "no way",
  "not",
  "negative",
  "not much",
];
let reaskvar = false;
let availRooms = [];
let a;
let b = require("./dispatchBot");
let availRooms2 = [];
let profiletemp = {};
let profile2;
let clearnumber;
let desiredavailability = "";
let someavailability = "";
let answerdesired = "";
let answersome = "";
let answer = "";
const roomsNames = [
  "Executive Double Room",
  "Deluxe Single Room",
  "Deluxe Double Room",
  "Superior Deluxe Double Room",
  "Junior Suite Unter den Linden",
  "Adlon Executive Suite",
  "Junior Suite",
];
const roomsNamesL = roomsNames.map((name) => name.toLowerCase());
const question = {
  startdate: "sdate",
  finishdate: "fdate",
  quantity: "quantity",
  category: "category",
  none: "none",
};
class CustomPromptBot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();
    this.conversationFlow = conversationState.createProperty(
      CONVERSATION_FLOW_PROPERTY
    );
    this.userProfile = userState.createProperty(USER_PROFILE_PROPERTY);

    this.conversationState = conversationState;
    this.userState = userState;

    this.onMessage(async (turnContext, next) => {
      module.exports.dispatchvar4 = { dispatchvar4: dispatchvar4 };
      let bookingDetails = b.bookingDetails;
      let profile1;
      if (bookingDetails) {
        profile1 = {};
        if (Object.keys(bookingDetails).length > 0) {
          for (const property1 in bookingDetails) {
            for (const property2 in question) {
              if (property1 == property2) {
                profile1[property1] = bookingDetails[property1];
              }
            }
          }
          if (bookingDetails["checkd1"]) {
            if (bookingDetails["checkd2"]) {
              if (bookingDetails["checkd2"] < bookingDetails["checkd1"]) {
                const temp = bookingDetails["checkd1"];
                bookingDetails["checkd1"] = bookingDetails["checkd2"];
                bookingDetails["checkd2"] = temp;
              } else {
                profile1.startdate = bookingDetails["checkd1"];
                profile1.finishdate = bookingDetails["checkd2"];
              }
            } else {
              profile1.startdate = bookingDetails["checkd1"];
            }
          }
        }
      }
      if (Object.keys(profile1).length) {
        profiletemp = profile1;
        const flow = await this.conversationFlow.get(turnContext, {
          lastQuestionAsked: question.startdate,
        });
        profile2 = await this.userProfile.get(turnContext, profile1);
        for (const [key, value] of Object.entries(profiletemp)) {
          profile2[key] = value;
        }
        await CustomPromptBot.fillOutUserProfile(flow, profile2, turnContext);
        await next();
      } else {
        profiletemp = {};
        const flow = await this.conversationFlow.get(turnContext, {
          lastQuestionAsked: question.none,
        });
        const profile = await this.userProfile.get(turnContext, {});
        await CustomPromptBot.fillOutUserProfile(flow, profile, turnContext);
        await next();
      }
    });
  }
  /**
   * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
   */
  async run(context) {
    await super.run(context);
    if (dispatchvar3) {
      await this.conversationState.delete(context);
      await this.conversationState.clear(context);
    }
    module.exports.dispatchvar3 = { dispatchvar3: dispatchvar3 };
    dispatchvar3 = false;
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
  static async fillOutUserProfile(flow, profile, turnContext) {
    let input = turnContext.activity.text;
    let result;
    switch (input.toLowerCase()) {
      case "cancel":
      case "exit":
      case "quit":
      case "stop":
      case "leave":
      case "goodbye": {
        await turnContext.sendActivity("Cancelling ...");
        flow.lastQuestionAsked = question.none;
        profile = {};
        dispatchvar3 = true;
        module.exports.dispatchvar3 = { dispatchvar3: dispatchvar3 };
        break;
      }
      default: {
        switch (flow.lastQuestionAsked) {
          case question.none:
            if (profile.startdate && profiletemp.startdate) {
              result = this.validateDate(profile.startdate);
              if (result.success) {
                await turnContext.sendActivity(
                  `I have your check in date as ${result.date}.`
                );
                await turnContext.sendActivity("Do you agree?");
              }
            } else {
              await turnContext.sendActivity(
                "Let's get started. What date do you desire check in?"
              );
            }
            dispatchvar3 = false;
            module.exports.dispatchvar3 = { dispatchvar3: dispatchvar3 };
            flow.lastQuestionAsked = question.startdate;
            dispatchvar4 = false;
            module.exports.dispatchvar4 = { dispatchvar4: dispatchvar4 };
            break;
          case question.startdate:
            if (list1.includes(input.toLowerCase())) {
              if (!profile.finishdate || !profiletemp.finishdate) {
                await turnContext.sendActivity(
                  "What date do you desire check out?"
                );
              } else if (profiletemp.finishdate) {
                result = this.validateDate(profile.finishdate);
                if (result.success) {
                  profile.finishdate = result.date;
                  await turnContext.sendActivity(
                    `I have your check out date as ${result.date}.`
                  );
                  await turnContext.sendActivity("Do you agree?");
                }
              }
              flow.lastQuestionAsked = question.finishdate;
              reaskvar = false;
              module.exports.reaskvar = { reaskvar: reaskvar };
              break;
            } else if (list2.includes(input.toLowerCase())) {
              flow.lastQuestionAsked = question.startdate;
              await turnContext.sendActivity(
                "Give again when is your check-in date ?"
              );
              reaskvar = true;
              module.exports.reaskvar = { reaskvar: reaskvar };
              break;
            } else {
              result = this.validateDate(input);
              if (result.success) {
                profile.startdate = result.date;
                await turnContext.sendActivity(
                  `I have your check in date as ${profile.startdate}.`
                );
                await turnContext.sendActivity("Do you agree?");
                flow.lastQuestionAsked = question.startdate;
                reaskvar = true;
                module.exports.reaskvar = { reaskvar: reaskvar };
                break;
              } else if (profile.startdate) {
                result = this.validateDate(profile.startdate);
                await turnContext.sendActivity(
                  `I have your check in date as ${result.date}.`
                );
                await turnContext.sendActivity("Do you agree?");
                flow.lastQuestionAsked = question.startdate;
                reaskvar = true;
                module.exports.reaskvar = { reaskvar: reaskvar };
                break;
              } else {
                await turnContext.sendActivity(
                  "Please, provide check in date."
                );
                break;
              }
            }
          case question.category:
            if (list1.includes(input.toLowerCase())) {
              desiredavailability = "";
              someavailability = "";
              for (let i = 0; i < availRooms.length; i += 2) {
                if (availRooms[i + 1] >= clearnumber) {
                  desiredavailability += availRooms[i] + ", ";
                } else if (availRooms[i + 1] >= 1) {
                  if (
                    availRooms[i].toLowerCase() ==
                    question.category.toLocaleLowerCase()
                  ) {
                    break;
                  } else {
                    someavailability += availRooms[i] + ", ";
                  }
                }
              }
              if (desiredavailability != "") {
                desiredavailability = desiredavailability.slice(0, -2);
                answerdesired =
                  "If you want all the rooms to be exact the same, you can select among " +
                  desiredavailability +
                  ".";
              }
              if (someavailability != "") {
                someavailability = someavailability.slice(0, -2);
                if (desiredavailability != "") {
                  answersome =
                    "Or you can select a combination of " + someavailability;
                } else {
                  answersome =
                    "However, you can select a combination of " +
                    someavailability;
                }
              }
              if (profile.category == "None") {
                if (desiredavailability != "") {
                  await turnContext.sendActivity(answerdesired);
                }
                if (someavailability != "") {
                  if (desiredavailability != "") {
                    answersome =
                      "Or you can select a combination of " + someavailability;
                  } else {
                    answersome =
                      `Unfortunately, we do not have ${profile.quantity} rooms of the same category. You can combine between ` +
                      someavailability;
                  }
                  await turnContext.sendActivity(answersome);
                }
                if (desiredavailability == "" && someavailability == "") {
                  await turnContext.sendActivity(
                    "We are sorry, but we do not have any others rooms available, that period."
                  );
                  await turnContext.sendActivity(
                    "Try again, with a different period."
                  );
                }
              } else {
                for (let i = 0; i < availRooms.length; i += 2) {
                  if (
                    availRooms[i].toLowerCase() ==
                    profile.category.toLowerCase()
                  ) {
                    if (availRooms[i + 1] >= clearnumber) {
                      answer =
                        "Great, we have " +
                        profile.quantity +
                        " " +
                        availRooms[i] +
                        " from " +
                        profile.startdate +
                        " to " +
                        profile.finishdate +
                        ". 🤗 ";
                      await turnContext.sendActivity(answer);
                      break;
                    } else if (availRooms[i + 1] >= 1) {
                      answer =
                        "We have " +
                        availRooms[i + 1] +
                        " " +
                        profile.category +
                        ".";
                      await turnContext.sendActivity(answer);
                      break;
                    }
                  }
                }
                if (answer.slice(0, 5) == "Great") {
                } else if (answer.slice(0, 7) == "We have") {
                  if (desiredavailability != "") {
                    await turnContext.sendActivity(answerdesired);
                  }
                  if (someavailability != "") {
                    answersome =
                      "For the rest of your rooms, you can select a combination of " +
                      someavailability +
                      ".";
                    await turnContext.sendActivity(answersome);
                  }
                  if (desiredavailability == "" && someavailability == "") {
                    await turnContext.sendActivity(
                      "We are sorry, but we do not have any others rooms available, that period."
                    );
                  }
                } else {
                  answer =
                    "We do not have any " +
                    profile.category +
                    " from " +
                    profile.startdate +
                    " to " +
                    profile.finishdate +
                    ". 😟";
                  await turnContext.sendActivity(answer);
                  if (desiredavailability != "") {
                    await turnContext.sendActivity(answerdesired);
                  }
                  if (someavailability != "") {
                    answersome =
                      "Also, you can select a combination of " +
                      someavailability +
                      ".";
                    await turnContext.sendActivity(answersome);
                  }
                  if (desiredavailability == "" && someavailability == "") {
                    await turnContext.sendActivity(
                      "We are sorry, but we do not have any rooms available that period."
                    );
                    await turnContext.sendActivity(
                      "Try again, with a different period."
                    );
                  }
                }
              }
              await turnContext.sendActivity("Completed, ask something else.");
              availRooms = [];
              desiredavailability = "";
              someavailability = "";
              answerdesired = "";
              answersome = "";
              answer = "";
              clearnumber = "";
              flow.lastQuestionAsked = question.none;
              profile = {};
              reaskvar = false;
              dispatchvar4 = true;
              module.exports.dispatchvar4 = { dispatchvar4: dispatchvar4 };
              clearmemory = false;
              module.exports.clearmemory = { clearmemory: clearmemory };
              break;
            } else if (list2.includes(input.toLowerCase())) {
              flow.lastQuestionAsked = question.category;
              await turnContext.sendActivity(
                "Give me again which room category do you desire?"
              );
              reaskvar = true;
              module.exports.reaskvar = { reaskvar: reaskvar };
              break;
            } else {
              result = this.validateCategory(input);
              if (result.success) {
                profile.category = result.category;
                await turnContext.sendActivity(
                  `I have your room category as ${profile.category}.`
                );
                await turnContext.sendActivity("Do you agree?");
                flow.lastQuestionAsked = question.category;
                reaskvar = true;
                module.exports.reaskvar = { reaskvar: reaskvar };
                break;
              } else if (!result.success) {
                await turnContext.sendActivity(
                  "I understand that you do not have a preference."
                );
                await turnContext.sendActivity("Is that right?");
                profile.category = "None";
                break;
              } else {
                await turnContext.sendActivity(
                  "What room category do you desire?"
                );
                break;
              }
            }
          case question.finishdate:
            if (list1.includes(input.toLowerCase())) {
              reaskvar = false;
              module.exports.reaskvar = { reaskvar: reaskvar };
              if (!profiletemp.quantity) {
                await turnContext.sendActivity(`How many rooms do you want?`);
              } else if (profile.quantity) {
                await turnContext.sendActivity(
                  `I have  that you want ${profile.quantity} rooms. Do you agree?`
                );
              }
              const { Connection, Request } = require("tedious");
              const config = {
                authentication: {
                  options: {},
                  type: "default",
                },
                options: {
                  encrypt: true,
                  validateBulkLoadParameters: true,
                },
              };
              const connection = new Connection(config);
              let stringquery =
                "SELECT rooms.type_id, COUNT(rooms.id) FROM rooms_type, rooms WHERE rooms_type.id = rooms.type_id AND rooms.id IN (SELECT id FROM rooms WHERE id NOT IN(SELECT rooms_id FROM rooms_booked AS rb WHERE bookings_id IN (SELECT id FROM bookings AS b WHERE (b.check_in_date <= " +
                "'" +
                profile.startdate +
                "'" +
                " AND b.check_out_date > " +
                "'" +
                profile.finishdate +
                "'" +
                ") OR (b.check_in_date < " +
                "'" +
                profile.finishdate +
                "'" +
                "AND b.check_out_date >= " +
                "'" +
                profile.finishdate +
                "'" +
                ") OR (" +
                "'" +
                profile.startdate +
                "'" +
                "<= b.check_in_date AND " +
                "'" +
                profile.finishdate +
                "'" +
                "> b.check_in_date)))) GROUP BY rooms.type_id";
              console.log(stringquery);
              connection.connect((err) => {
                if (err) {
                  console.error(err.message);
                } else {
                  queryDatabase().then(() => {
                    flow.lastQuestionAsked = question.quantity;
                    console.log("compl querydatabase");
                  });
                }
              });
              async function queryDatabase() {
                console.log("Reading rows from the Table...");
                const request = new Request(stringquery, (err, rowCount) => {
                  if (err) {
                    console.error(err.message);
                  } else {
                    console.log(`${rowCount} row(s) returned`);
                  }
                });
                request.on("row", (columns) => {
                  columns.forEach((column) => {
                    availRooms.push(column.value);
                  });
                });
                connection.execSql(request);
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve("resolved");
                  }, 5);
                  console.log("exits resolve");
                });
              }
              flow.lastQuestionAsked = question.quantity;
              break;
            } else if (list2.includes(input.toLowerCase())) {
              flow.lastQuestionAsked = question.finishdate;
              await turnContext.sendActivity(
                "Give again when is your check-out date?"
              );
              reaskvar = true;
              module.exports.reaskvar = { reaskvar: reaskvar };
              break;
            } else {
              result = this.validateDate(input);
              if (result.success) {
                profile.finishdate = result.date;
                const s = profile.startdate;
                const s2 = new Date(s).getTime();
                const f = profile.finishdate;
                const f2 = new Date(f).getTime();
                if (f2 < s2) {
                  console.log(f < s);
                  await turnContext.sendActivity(
                    `I have your check out date as ${f}. Check out is earlier than check in (${profile.startdate}).`
                  );
                  await turnContext.sendActivity("Give new check out date?");
                  console.log(f < s);
                } else {
                  await turnContext.sendActivity(
                    `I have your check out date as ${f}.`
                  );
                  await turnContext.sendActivity("Do you agree?");
                }
                console.log(f < s);
                flow.lastQuestionAsked = question.finishdate;
                reaskvar = true;
                module.exports.reaskvar = { reaskvar: reaskvar };
                break;
              } else {
                await turnContext.sendActivity(
                  "Can you give me your check out date, please?"
                );
                break;
              }
            }
          case question.quantity:
            if (list1.includes(input.toLowerCase())) {
              if (!clearnumber) {
                const wordsToNumber = require("words-to-number");
                const string = profile.quantity;
                if (string.match(/\d+/g)) {
                  const casenumber = string.match(/\d+/g).map(Number);
                  if (casenumber) {
                    clearnumber = parseInt(casenumber, 10);
                  }
                } else {
                  clearnumber = await wordsToNumber(string);
                  clearnumber = clearnumber.response;
                  console.log(clearnumber);
                }
              }
              for (let i = 0; i < availRooms.length; i += 2) {
                for (let j = 0; j < roomsNames.length; j++) {
                  if (availRooms[i] == j + 1) {
                    availRooms[i] = roomsNames[j];
                    break;
                  }
                }
              }
              for (let i = 0; i < availRooms.length; ) {
                a =
                  "We have " +
                  availRooms[i + 1] +
                  " " +
                  availRooms[i] +
                  " available.";
                console.log(a);
                availRooms2.push(a);
                i += 2;
              }
              flow.lastQuestionAsked = question.category;
              if (!profiletemp.category) {
                await turnContext.sendActivity(
                  "What room category do you desire?"
                );
              } else if (profiletemp.category) {
                await turnContext.sendActivity(
                  `I have that you want ${profile.category}. Do you agree?`
                );
              }
              reaskvar = false;
              module.exports.reaskvar = { reaskvar: reaskvar };
              break;
            } else if (list2.includes(input.toLowerCase())) {
              flow.lastQuestionAsked = question.quantity;
              await turnContext.sendActivity("Give again the number of rooms?");
              reaskvar = true;
              module.exports.reaskvar = { reaskvar: reaskvar };
              break;
            } else {
              const wordsToNumber = require("words-to-number");
              const string = input;
              if (string.match(/\d+/g)) {
                const casenumber = string.match(/\d+/g).map(Number);
                if (casenumber) {
                  clearnumber = parseInt(casenumber, 10);
                }
              } else {
                clearnumber = await wordsToNumber(string);
                clearnumber = clearnumber.response;
                console.log(clearnumber);
              }
              if (clearnumber) {
                profile.quantity = clearnumber;
                clearnumber = clearnumber;
                await turnContext.sendActivity(
                  `I have your number of rooms: ${profile.quantity}.`
                );
                await turnContext.sendActivity("Do you agree?");
                flow.lastQuestionAsked = question.quantity;
                reaskvar = true;
                module.exports.reaskvar = { reaskvar: reaskvar };
                break;
              } else {
                await turnContext.sendActivity(`How many rooms do you want?`);
                break;
              }
            }
        }
      }
    }
  }

  static validateCategory(input) {
    let category = input && input.trim();
    let answerreturned = {};
    for (let i = 0; i < roomsNamesL.length; i++) {
      if (category.toLowerCase() == roomsNamesL[i]) {
        answerreturned = { success: true, category: roomsNames[i] };
        break;
      } else {
        answerreturned = {
          success: false,
          message: "Please enter a valid category.",
        };
      }
    }
    return answerreturned;
  }
  static async validateQuantity(input) {
    let quantity = input && input.trim();
    let answerreturned = {};
    const wordsToNumber = require("words-to-number");
    const string = quantity;
    if (string.match(/\d+/g)) {
      const casenumber = string.match(/\d+/g).map(Number);
      if (casenumber) {
        clearnumber = parseInt(casenumber, 10);
      }
    } else if (typeof string == "string") {
      clearnumber = await wordsToNumber(string);
      clearnumber = clearnumber.response;
      console.log(clearnumber);
    }
    if (clearnumber != "" && clearnumber >= 1) {
      answerreturned = { success: true, clearnumber: clearnumber };
    } else {
      answerreturned = {
        success: false,
        message: "Please enter a valid number of rooms.",
      };
    }
    return answerreturned;
  }

  static validateDate(input) {
    try {
      const results = Recognizers.recognizeDateTime(
        input,
        Recognizers.Culture.English
      );
      const now = new Date();
      const earliest = now.getTime();
      let output;
      results.forEach((result) => {
        if (results[0].resolution.values.length > 1) {
          const datevalue = results[0].resolution.values[1].value;
          const datetime =
            results[0].resolution.values[1].type === "time"
              ? new Date(`${now.toLocaleDateString()} ${datevalue}`)
              : new Date(datevalue);
          if (datetime && earliest < datetime.getTime()) {
            output = {
              success: true,
              date: datetime.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
              }),
              date2: datetime,
            };
            return;
          } else {
            const date1 = datevalue;
            const parts = date1.split("-");
            const date2 = parts[0] + "-" + parts[2] + "-" + parts[1];
            const datevalue2 = date2;
            const datetime2 =
              resolution.type === "time"
                ? new Date(`${now.toLocaleDateString()} ${datevalue2}`)
                : new Date(datevalue2);
            if (datetime2 && earliest < datetime2.getTime()) {
              output = {
                success: true,
                date: datetime2.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  day: "numeric",
                }),
              };
              return;
            }
          }
        } else {
          result.resolution.values.forEach((resolution) => {
            const datevalue = resolution.value || resolution.start;
            const datetime =
              resolution.type === "time"
                ? new Date(`${now.toLocaleDateString()} ${datevalue}`)
                : new Date(datevalue);
            if (datetime && earliest < datetime.getTime()) {
              output = {
                success: true,
                date: datetime.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  day: "numeric",
                }),
              };
              return;
            } else if (
              datetime &&
              earliest - datetime.getTime() < 23 * 60 * 60 * 1000
            ) {
              output = {
                success: true,
                date: datetime.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                  day: "numeric",
                }),
              };
              return;
            } else {
              const date1 = datevalue;
              const parts = date1.split("-");
              const date2 = parts[0] + "-" + parts[2] + "-" + parts[1];
              const datevalue2 = date2;
              const datetime2 =
                resolution.type === "time"
                  ? new Date(`${now.toLocaleDateString()} ${datevalue2}`)
                  : new Date(datevalue2);
              if (datetime2 && earliest < datetime2.getTime()) {
                output = {
                  success: true,
                  date: datetime2.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  }),
                };
                return;
              }
            }
          });
        }
      });
      return (
        output || {
          success: false,
          message: "I'm sorry, please enter a date at least an hour out.",
        }
      );
    } catch (error) {
      return {
        success: false,
        message:
          "I'm sorry, I could not interpret that as an appropriate date. Please enter a date at least an hour out.",
      };
    }
  }
}
module.exports.dispatchvar3 = { dispatchvar3: dispatchvar3 };
module.exports.dispatchvar4 = { dispatchvar4: dispatchvar4 };
module.exports.reaskvar = { reaskvar: reaskvar };
module.exports.CustomPromptBot = CustomPromptBot;
