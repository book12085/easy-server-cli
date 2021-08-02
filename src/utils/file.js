import fs from 'fs';
import ejs from 'ejs';
import pkg from 'prettier-package-json';
import prettier from 'prettier';
import path from 'path';
import { fileSuffix } from '../config/index.js';

/**
 * 创建目录
 * @param {string} name 
 * @returns 
 */
const mkDir = (name) => {
    if (fs.existsSync(name)) return;
    fs.mkdirSync(name);
};

/**
 * 递归读取指定目录下的文件和文件夹
 * @param {string} filePath 
 * @param {object} answers 
 */
const readFile = (filePath, answers) => {
    console.log('模板地址:', filePath);
    if (fs.lstatSync(filePath).isDirectory()) {
        const fileList = fs.readdirSync(filePath);
        fileList.forEach((item) => {
            const itemFilePath = path.join(filePath, `/${item}`);
            const isDirectory = fs.lstatSync(itemFilePath).isDirectory();
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
        const code = ejs.render(fs.readFileSync(filePath).toString(), {
            ...answers,
            devDependencies: answers.devDependencies || [answers.esType]
        });
        const fileName = String(filePath).split('/');
        if (fileName[fileName.length - 1] === 'package.ejs') {
            const prettierPackage = pkg.format(JSON.parse(code), {
                tabWidth: 4,
                useTabs: true
            });
            fs.writeFileSync(`${answers.name}/package.json`, prettierPackage);
        } else if (fileName[fileName.length - 1].startsWith('.') || fileName[fileName.length - 1] === 'rollup.config.js') {
            if (filePath.includes(answers.esType+'/')) {
                fs.writeFileSync(`${answers.name}/${fileName[fileName.length - 1]}`, code);
            }
        } else {
            console.log(fs.existsSync(`${answers.name}/.eslintrc.json`));
            const pt = prettier.format(code, {
                parser: 'babel'
            });
            if (filePath.includes(answers.frameWork+'/') && filePath.includes(answers.esType+'/')) {
                const targetStr = answers.esType+'/';
                let tempPath = filePath.substr(filePath.indexOf(targetStr) + targetStr.length);
                if (!fs.existsSync(answers.name +`/${tempPath}`)) {
                    const finalPath = String(answers.name +`/${tempPath}`).replace('ejs', fileSuffix[answers.esType]);
                    fs.writeFileSync(finalPath, pt);
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
    const templatePath = path.resolve(require.main.path, '../src/template');
    readFile(templatePath, answers);
};

export {
    mkDir,
    readTemplate
};
