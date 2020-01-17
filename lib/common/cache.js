class Cache{
    constructor(){
        this.files={}
    }

    static init() {
        if (!this._instance)
            this._instance = new Cache()
        return this._instance
    }
}
module.exports=Cache