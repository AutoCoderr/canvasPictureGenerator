class ConceptNet {
    server;
    port;

    constructor(server = "http://api.conceptnet.io", port = 80) {
        this.server = server;
        this.port = port;
    }

    getWord(word, language = "en", params = {}) {
        let url = this.server+":"+this.port+"/c/"+language+"/"+word;
        let args = "";
        for (let key in params) {
            const param = params[key];
            args += key+"="+param+"&";
        }
        if (args) {
            args = args.substring(0,args.length-1);
            url += "?"+args
        }
        return axios
            .get(url)
    }

}