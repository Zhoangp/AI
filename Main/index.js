
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
const id3 = (arr, nameClass) => {
    let index = 0
    let max = -1;
    let attribute
    let e = entropy(arr)

    for (let item in arr[0]) {
        if (index != 0 && index != Object.keys(arr[0]).length - 1) {
            let {
                inforGain: value,
                list
            } = inforGain(arr, item)
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
    document.querySelector(`.${nameClass}`).innerHTML += `<div class="node"><p>${attribute.nameAttribute}</p></div>`
    document.querySelector(`.${nameClass}`).innerHTML += `<div class="node ${attribute.nameAttribute}"></div>`
    for (let i of attribute.listFeatures) {
        document.querySelector(`.${attribute.nameAttribute}`).innerHTML += `<div class="child ${i.name}"><div class="node"><button>${i.name}</button></div></div>`
        arrNext = (arr.filter(item => item[attribute.nameAttribute] == i.name))
        arrNext.forEach(e => {
            delete e[attribute.nameAttribute]
        })
        if (i.infor == 0) {
            document.querySelector(`.${i.name}`).innerHTML += `<div><span>${i.res}</span></div>`
        } else {
            id3(arrNext, i.name)
        }
    }

}

const excel_file = document.getElementById('excel_file');
excel_file.addEventListener('change', (event) => {
let dataset = new Array()
    document.querySelector(".tree").innerHTML = ""
    console.log(document.querySelector(".tree").innerHTML)
    if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(event.target.files[0].type)) {
        document.getElementById('excel_data').innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';

        excel_file.value = '';

        return false;
    }
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
            console.log(dataset)
            id3(dataset, 'tree')

            /*  sheet_dataReverse = transpose(sheet_data)
             var table_output = '<table class="table table-striped table-bordered">';

             for(var row = 0; row < sheet_data.length; row++)
             {

                 table_output += '<tr>';

                 for(var cell = 0; cell < sheet_data[row].length; cell++)
                 {

                     if(row == 0)
                     {

                         table_output += '<th>'+sheet_data[row][cell]+'</th>';

                     }
                     else
                     {

                         table_output += '<td>'+sheet_data[row][cell]+'</td>';

                     }

                 }

                 table_output += '</tr>';

             }

             table_output += '</table>';

             document.getElementById('excel_data').innerHTML = table_output; */
        }

        excel_file.value = '';
    }
});