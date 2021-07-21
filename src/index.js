// #!/usr/bin/env node
import program from 'commander';
import chalk from 'chalk';
import Question from './questions/index.js';
import { installAll, getLocalAddress } from './utils/index.js';
import { mkDir, readTemplate } from './utils/file.js';
import loading from './utils/loading.js';

program.version('1.0.1').command('create <name>').description('请输入项目名称').action(name => {
    console.log(name);
});

program.parse(process.argv);

const name = program.args[1];

Question.getAnswers(name).then(answers => {
    loading().text = '正在创建目录';
    // console.log(chalk.whiteBright('---> 开始创建目录'));
    // 创建目录
    mkDir(answers.name);
    loading().text = '目录创建完成';
    // console.log(chalk.green('<--- 目录创建完成'));
    // console.log(chalk.whiteBright('---> 开始写入模版'));
    // 添加模版
    loading().text = '正在读取模版';
    readTemplate(answers);
    loading().text = '模版写入完成';
    // console.log(chalk.green('<--- 模版写入完成'));
    // console.log(chalk.whiteBright('---> 开始安装依赖'));
    loading().text = '正在安装依赖';
    // 安装依赖
    installAll(answers);
    loading().text = '依赖安装完成';
    loading().stop();
    // console.log(chalk.green('<--- 依赖安装完成'));


    console.log(chalk.green('-----------'));
    
    console.log(chalk.blue(`项目初始化完成，可以在控制台中，运行npm run start,通过postman等工具请求以下接口：http://localhost:${answers.port}/login, http://${getLocalAddress()}:${answers.port}/login 进行测试。`));
    
    console.log(chalk.green('-----------'));
}).catch(error => {
    console.log(error);
});
