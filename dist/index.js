'use strict';

var program = require('commander');
var chalk = require('chalk');
var inquirer = require('inquirer');
var spawn = require('cross-spawn');
var os = require('os');
var fs = require('fs');
var ejs = require('ejs');
var pkg = require('prettier-package-json');
var prettier = require('prettier');
var path = require('path');
var ora = require('ora');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var program__default = /*#__PURE__*/_interopDefaultLegacy(program);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var spawn__default = /*#__PURE__*/_interopDefaultLegacy(spawn);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var ejs__default = /*#__PURE__*/_interopDefaultLegacy(ejs);
var pkg__default = /*#__PURE__*/_interopDefaultLegacy(pkg);
var prettier__default = /*#__PURE__*/_interopDefaultLegacy(prettier);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);

const questions = [
    {
        type: 'input',
        name: 'port',
        message: '请设置服务端口',
        default: '5888',
        validate: (name)=>{
            if(/^[0-9]{2,4}$/.test(name)){
                return true;
            }else {
                return '端口必须是2-4位数字';
            }
        }
    },
    {
        type: 'list',
        name: 'frameWork',
        message: '请选择你想使用的框架',
        choices: [
            {
                name: 'koa2'
            },
            // {
            //     name: 'express'
            // }
        ]
    },
    {
        type: 'list',
        name: 'esType',
        message: '请选择开发脚本',
        choices: [
            {
                name: 'commonjs',
            },
            {
                name: 'es'
            },
            {
                name: 'Typescript'
            }
        ]
    },
    {
        type: 'checkbox',
        name: 'dependencies',
        message: '请选择依赖',
        choices: [
            {
                name: 'koa2',
                checked: true
            },
            {
                name: 'koa-router',
            },
            {
                name: 'koa-bodyparser',
            },
            {
                name: 'koa-cors',
            },
            {
                name: 'koa-logger',
            },
            {
                name: 'koa-compress'
            },
            {
                name: 'koa-helmet'
            },
            {
                name: 'koa-static'
            },
            // {
            //     name: 'koa-session'
            // },
            // {
            //     name: 'koa-jwt'
            // },
            // {
            //     name: 'koa-views'
            // },
            // {
            //     name: 'mysql',
            // },
            // {
            //     name: 'http',
            // },
            // {
            //     name: 'https',
            // },
        ]
    },
    {
        type: "input",
        name: 'description',
        message: '请输入项目描述'
    },
    {
        type: 'input',
        name: 'author',
        message: '请输入作者名称'
    },
    {
        type: 'list',
        name: 'license',
        message: '请选择发布许可',
        default: 'ISC',
        choices: ['ISC', 'MIT']
    }
];

class Question {
    static async getAnswers(name) {
        if (!name) {
            questions.unshift({
                type: 'input',
                name: 'name',
                message: '请输入项目名称',
                default: 'esc-server',
                validate: (name)=>{
                    if(/^[a-z]+/.test(name)){
                        return true;
                    }else {
                        return '项目名称必须以小写字母开头';
                    }
                }
            });
        } else {
            questions.unshift({
                type: 'input',
                message: '项目名称是否为',
                name: 'name',
                default: name,
                validate: (name)=>{
                    if(/^[a-z]+/.test(name)){
                        return true;
                    }else {
                        return '项目名称必须以小写字母开头';
                    }
                }
            });
        }

        return await inquirer__default['default'].prompt(questions);
    }
}

/**
 * 项目初始化 npm install
 * @param {*} answers 
 */
const installAll = async (answers) => {
    const child = spawn__default['default'].sync('npm', ['install'], {
        cwd: answers.name,
        stdio: 'inherit'
    });
    if (child.status !== 0) {
        process.exit(1);
    }
};

/**
 * 获取本机IP地址
 * @returns 
 */
const getLocalAddress = () => {
    const nwi = os__default['default'].networkInterfaces();
    for(let name in nwi) {
        const iFace = nwi[name];
        for(let i = 0; i < iFace.length; i++) {
            let item = iFace[i];
            if (item.family === 'IPv4' && item.address !== '127.0.0.1' && !item.internal) {
                return item.address;
            }
        }
    }
};

/**
 * 文件后缀名
 */
const fileSuffix = {
    'commonjs': 'js',
    'es': 'js',
    'Typescript': 'ts'
};

/**
 * 创建目录
 * @param {string} name 
 * @returns 
 */
 const mkDir = (name) => {
    if (fs__default['default'].existsSync(name)) return;
    fs__default['default'].mkdirSync(name);
};

/**
 * 递归读取指定目录下的文件和文件夹
 * @param {string} filePath 
 * @param {object} answers 
 */
const readFile = (filePath, answers) => {
    if (fs__default['default'].lstatSync(filePath).isDirectory()) {
        const fileList = fs__default['default'].readdirSync(filePath);
        fileList.forEach((item) => {
            const itemFilePath = path__default['default'].join(filePath, `/${item}`);
            const isDirectory = fs__default['default'].lstatSync(itemFilePath).isDirectory();
            if (isDirectory) {
                if (itemFilePath.includes(answers.frameWork+'/') && itemFilePath.includes(answers.esType+'/')) {
                    const targetStr = answers.esType+'/';
                    let tempPath = itemFilePath.substr(itemFilePath.indexOf(targetStr) + targetStr.length);
                    mkDir(answers.name +`/${tempPath}`);
                }
            }
            readFile(itemFilePath, answers);
        });
    } else {
        const code = ejs__default['default'].render(fs__default['default'].readFileSync(filePath).toString(), {
            ...answers,
            devDependencies: answers.devDependencies || [answers.esType]
        });
        const fileName = String(filePath).split('/');
        if (fileName[fileName.length - 1] === 'package.ejs') {
            const prettierPackage = pkg__default['default'].format(JSON.parse(code), {
                tabWidth: 4,
                useTabs: true
            });
            fs__default['default'].writeFileSync(`${answers.name}/package.json`, prettierPackage);
        } else if (fileName[fileName.length - 1].startsWith('.') || fileName[fileName.length - 1] === 'rollup.config.js') {
            if (filePath.includes(answers.esType+'/')) {
                fs__default['default'].writeFileSync(`${answers.name}/${fileName[fileName.length - 1]}`, code);
            }
        } else {
            const pt = prettier__default['default'].format(code, {
                parser: 'babel'
            });
            if (filePath.includes(answers.frameWork+'/') && filePath.includes(answers.esType+'/')) {
                const targetStr = answers.esType+'/';
                let tempPath = filePath.substr(filePath.indexOf(targetStr) + targetStr.length);
                if (!fs__default['default'].existsSync(answers.name +`/${tempPath}`)) {
                    const finalPath = String(answers.name +`/${tempPath}`).replace('ejs', fileSuffix[answers.esType]);
                    fs__default['default'].writeFileSync(finalPath, pt);
                }
            }
            
        }
    }
};

/**
 * 读取项目模版
 * @param {object} answers 项目配置选项
 */
 const readTemplate = (answers) => {
    const __dirname = path__default['default'].resolve(path__default['default'].dirname(''));
    const tempRootPath = path__default['default'].join(__dirname, 'src/template');
    readFile(tempRootPath, answers);
};

let spinner = null;

var loading = (message) => {
    if (!spinner) {
        spinner = ora__default['default'](message).start();
    }
    return spinner;
};

// #!/usr/bin/env node

program__default['default'].version('1.0.1').command('create <name>').description('请输入项目名称').action(name => {
    console.log(name);
});

program__default['default'].parse(process.argv);

const name = program__default['default'].args[1];

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


    console.log(chalk__default['default'].green('-----------'));
    
    console.log(chalk__default['default'].blue(`项目初始化完成，可以在控制台中，运行npm run start,通过postman等工具请求以下接口：http://localhost:${answers.port}/login, http://${getLocalAddress()}:${answers.port}/login 进行测试。`));
    
    console.log(chalk__default['default'].green('-----------'));
}).catch(error => {
    console.log(error);
});
