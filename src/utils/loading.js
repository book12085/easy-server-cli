import ora from 'ora';

let spinner = null;

export default (message) => {
    if (!spinner) {
        spinner = ora(message).start();
    }
    return spinner;
}