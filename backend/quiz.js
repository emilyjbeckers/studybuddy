const Alexa = require('ask-sdk-core');

const StartQuizHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'HOMEStartQuizIntent';
    },
    handle(handlerInput) {
        console.log('ok ok ok');
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const response = handlerInput.responseBuilder;
        attributes.state = 'quiz';
        return handlerInput.responseBuilder
            .speak('what is the answer for pie')
            .reprompt('what is the answer for pie')
            .getResponse();
    }
};

const QuizAnswerHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'QUIZAnswerIntent'
            && handlerInput.attributesManager.getSessionAttributes().state === 'quiz';
    },
    handle(handlerInput) {
        const response = handlerInput.responseBuilder;
        return handlerInput.responseBuilder
            .speak('ok')
            .getResponse();
    }
}

exports.StartQuizHandler = StartQuizHandler;
exports.QuizAnswerHandler = QuizAnswerHandler;
