import spawn from 'cross-spawn';
import os from 'os';

/**
 * 项目初始化 npm install
 * @param {*} answers 
 */
const installAll = async (answers) => {
    const child = spawn.sync('npm', ['install'], {
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
    const nwi = os.networkInterfaces();
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
 * 格式化代码
 * @param {String} name 目录
 */
const formatFile = (name) => {
    const child = spawn.sync('npm', ['run', 'lint-fix'], {
        cwd: name,
        stdio: 'inherit'
    });

    if (child.status !== 0) {
        process.exit(1);
    }
};

export {
    installAll,
    getLocalAddress,
    formatFile
};
