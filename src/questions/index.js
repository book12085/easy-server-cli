import inquirer from 'inquirer';

const questions = [
    {
        type: 'input',
        name: 'port',
        message: '请设置服务端口',
        default: '5888',
        validate: (name)=>{
            if(/^[0-9]{2,4}$/.test(name)){
                return true;
            }else{
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
        type: 'input',
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
                    }else{
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
                    }else{
                        return '项目名称必须以小写字母开头';
                    }
                }
            });
        }

        return await inquirer.prompt(questions);
    }
}

export default Question;
