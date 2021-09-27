## Microsoft Bot Framework Implementation
### for the case of a hotel business

**Scope**: A chatbot 🤖 that serves hotel's needs (_JavaScript SDK v4_).

**Goals**: 
1. Functionality to answer QnA related to the hotel (_for example What time can i check in?, Which is the charging policy for limousine service?, Can I use any fitness equipment during my accommodation?, etc_).
1. Functionality to answer QnA related to general staff (_for example How are you?, What are you?, What can you do?, etc._).
1. Functionality to query for available room at the hotel's management system having firstly collected the necessary details with one of the following ways:
	1. By collecting the necessary details through a dialog (_What date do you desire check in?, What date do you desire check out?, What room category do you desire?, How many rooms do you want?_)
	1. By extracting all the necessary details from a customer prompt statement (_for example Can i book two Deluxe Single rooms check in date 10 August and check out date 15 August?, I want ten Junior Suite Unter den Linden from 8 August to 28 August, etc_) 

### Development Process

In order to create a chatbot that achieves the above functionality goals we started with adjustments of official [BotBuilder Samples](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/javascript_nodejs) for the [Bot Framework](https://docs.microsoft.com/en-us/azure/bot-service/index-bf-sdk?view=azure-bot-service-4.0):

**NLP Bot** 
- [repo](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/javascript_nodejs/14.nlp-with-orchestrator)
- [Code documentation](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-tutorial-dispatch?view=azure-bot-service-4.0&tabs=js)

The **NLP Bot** distingues 3 intents (q_sample-qna **Goals #1 & #2**, RoomAvailability ability **Goal #3.i**, BookDetails **Goal #3.ii**).
The code of [dispatchBot](/bots/dispatchBot.js). 

**Prompt for user input**
- [repo](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/javascript_nodejs/44.prompt-for-user-input)
- [Code documentation](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-primitive-prompts?view=azure-bot-service-4.0&tabs=javascript)

The **customPromptBot** prompts customer for input data and validate booking details (**Goal 3.i**). Also, it is able to extract details from input customer's statement and validate details (**Goal 3.ii**). The **customPromptBot** role is to collect the necessary details that are required to execute the query for RoomAvailability and BookDetails intents. The code of [customPromptBot](/bots/customPromptBot.js).

The chatbot executes queries in a **SQL Database** that supports the hotel management system. Tables about rooms and booking records have been created and filled up with data for testing.
The [SQL code](/DatabaseScripts). 

Demo videos can be found here:
1. [Demo1](https://www.youtube.com/watch?v=Q6BJMb451XA&t=24s&ab_channel=EvangelosPoulios)
2. [Demo2](https://www.youtube.com/watch?v=mSbOivHpEdY&ab_channel=EvangelosPoulios)

Hope to find it useful.
✌️✌️✌️

