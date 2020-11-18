const conceptNet = new ConceptNet();

const width = 300, height = 300;
const canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;

const valuesInHash = {
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15
};
const colors = ["green", "blue", "yellow", "red", "pink", "marron", "grey"];

document.getElementById("applyIa").onclick = function () {
    const msg = document.getElementById("input").value;
    getWordContext((word) => {
        word = word.replaceAll("the ","").replaceAll("a ","").replaceAll("an ","").replaceAll("of ","").replaceAll("bottom", "");
        axios.get(location.protocol+"//"+location.host+":8080/getRandomImage?query="+word+"&page=1").then(response => {
            if (response.data === "No picture") {
                document.getElementById("msg").innerText = "No picture found";
            } else {
                document.getElementById("msg").innerText = "";
                const photo = response.data.src.medium;
                generateCanvas(msg,photo,response.data.dominantColor);
            }
        });
    }, msg);
}

function getWordContext(callback, word) {
    conceptNet.getWord(word, "en", {
        limit: 100,
        offset: 0,
        filter: 'core'
    }).then(response => {
        const edges = response.data.edges;
        const words = [];
        if (rand(0,1) === 0) {
            for (let edge of edges) {
                if (
                    edge["@id"].startsWith("/a/[/r/AtLocation/") ||
                    edge["@id"].startsWith("/a/[/r/PartOf/") ||
                    edge["@id"].startsWith("/a/[/r/MadeOf/") ||
                    edge["@id"].startsWith("/a/[/r/DerivedFrom/")
                ) {
                    let label = edge[edge.end.label.replace(word, "") !== edge.end.label ? "start" : "end"].label
                    console.log("label => " + label);
                    console.log("id => " + edge["@id"]);
                    words.push(label);
                }
            }
        }
        callback(words.length > 0 ? words[rand(0,words.length-1)] : word);
    })
}

function generateCanvas(msg,photo,color) {
    msg = msg.hash();
    msg = msg.split("");
    let numberColor = 0;
    for (let i=0;i<msg.length;i++) {
        msg[i] = valuesInHash[msg[i]] || parseInt(msg[i]);
        numberColor += msg[i];
        msg[i] *= 10;
    }
    //const color = colors[numberColor%colors.length];

    let forms = [];

    for (let i=0;i<msg.length-1;i+=2) {
        let type;
        const random = rand(1,4);
        if (random === 1) {
            type = "circle"
        } else if (random === 2) {
            type = "rect";
        } else {
            type = "line"
        }
        const vertical = rand(0,1) === 1;
        forms.push({
            xA: msg[i]/150*width, yA: msg[i+1]/150*height,
            xB: rand(Math.max(0,msg[i]-(vertical ? 3 : 300)),Math.min(150,msg[i]+(vertical ? 3 : 300)))/150*width,
            yB: rand(Math.max(0,msg[i+1]-(vertical ? 300 : 3)),Math.min(150,msg[i+1]+(vertical ? 300 : 3)))/150*height,
            type,
            color: rand(1,10) === 1 ? colors[rand(0,colors.length-1)] : color
        });
    }
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,300,300);
    document.getElementById("canvasDiv").style.backgroundImage = "url('"+photo+"')";

    for (let form of forms) {
        ctx.strokeStyle = form.color;
        ctx.beginPath();
        switch (form.type) {
            case "rect":
                ctx.strokeRect(form.xA, form.yA, form.xB, form.yB);
                break;
            case "circle":
                ctx.arc(form.xA, form.yA, rand(10,75), 0, 2 * Math.PI);
                break;
            case "line":
                ctx.moveTo(form.xA, form.yA);
                ctx.lineTo(form.xB, form.yB);
        }
        ctx.stroke();
    }
}

function rand(a,b) {
    return a+Math.floor(Math.random()*(b-a+1));
}

String.prototype.replaceAll = function(A,B) {
    let str = this.valueOf();
    while(str.replace(A,B) !== str) str = str.replace(A,B);
    return str;
}