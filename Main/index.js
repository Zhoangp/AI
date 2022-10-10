const entropy = (arr) => {
    let key
    let value
    let res = new Array()
    for (let i = 0; i < arr.length; i++) {
        key = Object.keys(arr[i]).pop()
        value = Object.values(arr[i]).pop()
        res.push({
            [key]: value
        })
    }
    res = [...new Map(res.map(item => [item[key], item])).values()];
    let e = 0;
    const total = arr.length;
    for (let i = 0; i < res.length; i++) {
        let count = 0
        for (const item of arr) {
            if (item[key] == res[i][key]) {
                count++;
            }
        }
        if (count !== 0)
            e -= (count / total) * Math.log2((count / total))

    }
    return Math.round(e * 1000) / 1000
}

const inforGain = (arr, attribute) => {
    const arr2 = [...new Set(arr.map(i => i[attribute]))]
    const total = arr.length
    let listFeatures = new Array();
    let inforGain = 0
    for (let item of arr2) {
        let arrTemp = arr.filter(x => x[attribute] == item)
        let e = entropy(arrTemp)
        inforGain += (arrTemp.length / total) * e
        if (e == 0) {
            x = arr.filter(i => i[attribute] == item)[0]
            a = {
                name: item,
                infor: e,
                res: x[Object.keys(x)[Object.keys(x).length - 1]]
            }
        } else {
            a = {
                name: item,
                infor: e,
                res: ""
            }
        }
        listFeatures.push(a)
    }
    return {
        inforGain: Math.round(inforGain * 1000) / 1000,
        list: listFeatures
    }
}
const id3 = (arr, nameClass, parent) => {
        let tree = new Object();
    /////////////////////////////////////////
        let table = '<div class="item" style="margin-top: 20px">'
        let col = 'Xét tập dữ liệu D sau <table style="width: 30%" class="table table-striped table-bordered"><tr>'
        
        for(let item in arr[0]) {
            if(item != parent)
                col+= `<td>${item}</td>`
        }
        col+= "</tr>"
        for(let item of arr) {
            col+= `<tr>`
            for(let i in item) {
                if(i != parent)
                    col+= `<td>${item[i]}</td>`
            }
            col+= `</tr>`

        }
        col+= "</table>"
        table += col;
    /////////////////////////////////////////
        let index = 0
        let max = -1;
        let attribute
        let e = entropy(arr)
        table += `<p>Infor(D) = ${e}</p>`
        let attriName = "<p>"
        for (let item in arr[0]) {
            if (index != 0 && index != Object.keys(arr[0]).length - 1 && item != parent) {
                let {inforGain: value,list} = inforGain(arr, item)
            /////////////////////////////////////////
                 attriName += `- Gain(${item}) = `
                attriName += Math.round((e-value)*1000)/1000 + "<br>"
            /////////////////////////////////////////
                if (max <= (e - value)) {
                    max = e - value
                    attribute = {
                        nameAttribute: item,
                        listFeatures: list
                    }
                }
            }
            index++
        } 
        tree['attribute'] = new Object()
        tree['attribute']['nameAttribute'] = attribute.nameAttribute
        tree['attribute']['listValues'] = new Array()

        
        
         /////////////////////////////////////////
        attriName += `=>Chọn ${attribute.nameAttribute} làm thuộc tính phân hoạch</p>`
        table += attriName
        /////////////////////////////////////////
    
        document.querySelector(`.${nameClass}`).innerHTML += `<ul><li><div class="attribute">${attribute.nameAttribute}</div><ul class=${attribute.nameAttribute}></ul></li></ul>`
    /////////////////////////////////////////
        let listValue = 'Các giá trị của thuộc tính phân hoạch <table style="width: 20%" class="table table-striped table-bordered"><tbody><tr><th>Giá trị</th><th>Entropy</th><th>Class</th></tr>'
        for (let i = 0; i < attribute.listFeatures.length; i++) {
            tree['attribute']['listValues'].push(attribute.listFeatures[i].name)
            listValue +=  `<tr><td>${attribute.listFeatures[i].name}</td>  <td>${attribute.listFeatures[i].infor}</td> <td>${attribute.listFeatures[i].res}</td></tr> </tr>`
           
        }

        table += listValue
        document.querySelector(".content").innerHTML += table
    /////////////////////////////////////////
    
        for (let i of attribute.listFeatures) {
           document.querySelector(`.${attribute.nameAttribute}`).innerHTML += `<li class="child ${i.name}"><div class="value">(${i.name})</div></li>`
            arrNext = (arr.filter(item => item[attribute.nameAttribute] == i.name))
          /*   arrNext.forEach(e => {
                delete e[attribute.nameAttribute]
            }) */
            if (i.infor == 0) {
               // document.querySelector(`.${i.name}`).innerHTML += `<br><div style="margin-top: 10px"><span>${i.res}</span></div>`
                document.querySelector(`.${i.name}`).innerHTML += `<ul><li><div class="leaf">${i.res}</div></li></ul>`
            } else {
              id3(arrNext, i.name, attribute.nameAttribute)
    
            }
        }
    
    }
const excel_file = document.getElementById('excel_file');
excel_file.addEventListener('change', (event) => {
let dataset = new Array()
    document.querySelector(".tree").innerHTML = ""
    document.querySelector(".content").innerHTML = ""
    var reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = function (event) {
        var data = new Uint8Array(reader.result);
        var work_book = XLSX.read(data, {
            type: 'array'
        });
        var sheet_name = work_book.SheetNames;
        var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {
            header: 1
        });

        ///////////////////////////////////////
        if (sheet_data.length > 0) {
            let listKey = sheet_data[0]
            for (let i = 1; i < sheet_data.length; i++) {
                let object = {}
                for (let j = 0; j < sheet_data[i].length; j++) {
                    object[listKey[j].replace(/\s/g, '')] = sheet_data[i][j]
                }
                dataset.push(object)
            }
            id3(dataset, 'tree', "")

        }
    }
});


