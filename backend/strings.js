module.exports = {
    // make: takes a base string with arguments as {0}, {1}, etc, and replaces these sequences with the corresponding arguments
    make: (base, ...args) => {
        let result = base;
        args.forEach((arg, index) => {
            result = result.replace(`{${index}}`, arg);
        });
        return result;
    },
    
    // strings below, organized alphabetically by name
    ERROR_TEXT:  "Sorry, I couldn't understand what you said. Please try again.",
    GOODBYE_TEXT: 'Goodbye!',
    HELP_TEXT: 'You can say hello to me! How can I help?',
    INTENT_DEBUG_TEXT: 'You just triggered {0}',
    QUESTION_PROMPT: 'What is the answer for {0}',
    QUIZ_CORRECT: 'That is correct.',
    QUIZ_INCORRECT: 'That is incorrect. The correct answer is {0}.',
    QUIZ_RESULTS: 'You have completed all of the flashcards. You got {0} percent correct.',
    WELCOME_TEXT: 'Welcome, you can say Hello or Help. Which would you like to try?',
}
