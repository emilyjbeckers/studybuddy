const Alexa = require('ask-sdk-core');
const _ = require('lodash');
const strings = require('./strings');

// Alexa handlers

const StartQuizHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HOMEStartQuizIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.state = 'quiz';
        
        QuizController.fetchQuestions();
        const question = QuizController.askNextQuestion();
        
        return handlerInput.responseBuilder
            .speak(strings.make(strings.QUESTION_PROMPT, question))
            .reprompt(strings.make(strings.QUESTION_PROMPT, question))
            .getResponse();
    }
};

const QuizAnswerHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QUIZAnswerIntent'
            && handlerInput.attributesManager.getSessionAttributes().state === 'quiz';
    },
    handle(handlerInput) {
        const answer = handlerInput.requestEnvelope.request.intent.slots.QuizAnswer.value; // oh boy
        const correct = QuizController.checkAnswer(answer);
        const resultPhrase = correct ? strings.QUIZ_CORRECT : strings.make(strings.QUIZ_INCORRECT, QuizController.getCorrectAnswer());
        const moreQuestions = QuizController.hasNextQuestion();
        
        let nextPhrase = ' ';
        if (moreQuestions) {
            nextPhrase += strings.make(strings.QUESTION_PROMPT, QuizController.askNextQuestion());
        } else {
            handlerInput.attributesManager.getSessionAttributes().state = 'quiz-complete';
            const status = QuizController.getStatus();
            nextPhrase += strings.make(strings.QUIZ_RESULTS, ((status.correct * 100) / status.total));
        }
        
        let response = handlerInput.responseBuilder.speak(resultPhrase + nextPhrase);
        if (moreQuestions) {
            response = response.reprompt(nextPhrase);
        }
        return response.getResponse();
    }
}

// Quiz controller

const QuizController = {
    // TODOS:
    // - actually getting questions from somewhere
    // - prompting with definition
    // - asking a subset of questions
    _questions: [],
    _currentQuestion: -1,
    
    fetchQuestions(deckName, promptWithTerm = true) {
        const questions = [
            {
                question: {term: 'one', definition: '11'},
                status: {skip: false, correct: false},
            },
            {
                question: {term: 'two', definition: '22'},
                status: {skip: false, correct: false},
            },
            {
                question: {term: 'three', definition: '33'},
                status: {skip: false, correct: false},
            },
            {
                question: {term: 'four', definition: '44'},
                status: {skip: false, correct: false},
            },
        ];
        
        this._questions = _.shuffle(questions);
        this._currentQuestion = -1;
    },
    
    hasNextQuestion() {
        return this._currentQuestion < (this._questions.length - 1);
    },
    
    askNextQuestion() {
        this._currentQuestion += 1;
        return this._questions[this._currentQuestion].question.term;
    },
    
    getCorrectAnswer() {
        return this._questions[this._currentQuestion].question.definition;
    },
    
    checkAnswer(answer) {
        const correct = answer.toLowerCase() === this._questions[this._currentQuestion].question.definition.toLowerCase();
        this._questions[this._currentQuestion].status.correct = correct;
        return correct;
    },
    
    getStatus() {
        const total = this._questions.length;
        const correct = this._questions.reduce(function(acc, next) {
            if (next.status.correct) {
                return acc + 1;
            }
            return acc;
        }, 0);
        
        return {total, correct};
    },
    
    restart(wrongQuestionsOnly = false) {
        this._questions.forEach(function(question) {
            question.status.correct = false;
        });
        this._currentQuestion = -1;
        this._questions = _.shuffle(this._questions);
    },
}


module.exports = {
    StartQuizHandler,
    QuizAnswerHandler,
};
