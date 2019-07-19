const env = process.env.NODE_ENV;
const dev = {
    getItemList: '',
    getLinesList: '',
    saveImg: '',
    saveApi: ''
}

const prod = {
    getItemList: '',
    getLinesList: '',
    saveImg: '',
    saveApi: ''
}

export default env == 'development' ? dev : prod;