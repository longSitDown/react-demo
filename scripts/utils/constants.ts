import {resolve,parse} from 'path'

const __DEV__ = process.env.NODE_ENV !== 'production';

const PROJECT_ROOT = resolve(__dirname,'../../')
const PROJECT_NAME = parse(PROJECT_ROOT).name
const RESOLVE_PATH = (...path:string[])=>{
    return resolve(PROJECT_ROOT,...path)
}

export {
    __DEV__,
    PROJECT_ROOT,
    PROJECT_NAME,
    RESOLVE_PATH,
}

