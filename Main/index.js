/* const excel_file = document.getElementById('excel_file');
excel_file.addEventListener('change', (event) => {
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
            console.log((sheet_data))
            sheet_dataReverse = transpose(sheet_data)
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

            document.getElementById('excel_data').innerHTML = table_output;
        }

        excel_file.value = '';

    }

}); */

var examples = [
    {day:'D1',outlook:'Sunny', temp:'Hot', humidity:'High', wind: 'Weak',play:'No'},
    {day:'D2',outlook:'Sunny', temp:'Hot', humidity:'High', wind: 'Strong',play:'No'},
    {day:'D3',outlook:'Overcast', temp:'Hot', humidity:'High', wind: 'Weak',play:'Yes'},
    {day:'D4',outlook:'Rain', temp:'Mild', humidity:'High', wind: 'Weak',play:'Yes'},
    {day:'D5',outlook:'Rain', temp:'Cool', humidity:'Normal', wind: 'Weak',play:'Yes'},
    {day:'D6',outlook:'Rain', temp:'Cool', humidity:'Normal', wind: 'Strong',play:'No'},
    {day:'D7',outlook:'Overcast', temp:'Cool', humidity:'Normal', wind: 'Strong',play:'Yes'},
    {day:'D8',outlook:'Sunny', temp:'Mild', humidity:'High', wind: 'Weak',play:'No'},
    {day:'D9',outlook:'Sunny', temp:'Cool', humidity:'Normal', wind: 'Weak',play:'Yes'},
    {day:'D10',outlook:'Rain', temp:'Mild', humidity:'Normal', wind: 'Weak',play:'Yes'},
    {day:'D11',outlook:'Sunny', temp:'Mild', humidity:'Normal', wind: 'Strong',play:'Yes'},
    {day:'D12',outlook:'Overcast', temp:'Mild', humidity:'High', wind: 'Strong',play:'Yes'},
    {day:'D13',outlook:'Overcast', temp:'Hot', humidity:'Normal', wind: 'Weak',play:'Yes'},
    {day:'D14',outlook:'Rain', temp:'Mild', humidity:'High', wind: 'Strong',play:'No'}
    ];

var features = ['outlook', 'temp', 'humidity', 'wind'];
const res = [{play: "Yes"}, {play: "No"}]
const entropy = (arr) => {
    let e = 0;
    const total = arr.length;
    for(let i = 0; i < res.length; i++) {
        let count = 0
        for (const item of arr) {
            if(item.play == res[i].play) {
                count++;
            }
        }

        if(count !== 0) 
            e -= (count/total) * Math.log2((count/total))
        

    }
    return Math.round(e*1000)/1000
   
}

const inforGain = (arr, attribute) => {
    const arr2 = [...new Set(arr.map(i => i[attribute]))]
    const total = arr.length
    let listFeatures = new Array();
    let inforGain = 0
    for(let item of arr2) {
        let arrTemp = arr.filter(x => x[attribute] == item)
        let e = entropy(arrTemp)
        inforGain += (arrTemp.length/total) * e
        if(e == 0) {
            x = arr.filter(i => i[attribute] == item)[0]
            a = {name: item, infor: e, res: x.play}

        }
        else {
        a = {name: item, infor: e, res: ""}
        }

        listFeatures.push(a)
    }
    return {inforGain: Math.round(inforGain * 1000)/1000, list: listFeatures}
}
const id3 = (arr) => {  
    let index = 0
    let max = -1;
    let attribute
    let e = entropy(arr)

    for(let item in arr[0]) {
        if(index != 0 && index != Object.keys(arr[0]).length - 1) {
           let {inforGain:value, list} = inforGain(arr, item)
            if(max <=  (e - value)) {
                max =  e-value
                attribute = {nameAttribute: item , listFeatures: list}
            }
        }
        index++
    }
    console.log(attribute)
    let s =  `<div class="node">${attribute.nameAttribute}</div>`
    document.querySelector(".tree").innerHTML += s
    document.querySelector(`.tree`).innerHTML += `<div class="node ${attribute.nameAttribute}"></div>`
    for(let i of attribute.listFeatures) {
        document.querySelector(`.${attribute.nameAttribute}`).innerHTML += `<div class="child ${i.name}">${i.name}</div>`

        arrNext = (arr.filter(item => item[attribute.nameAttribute] == i.name))
        arrNext.forEach(e => {
            delete e[attribute.nameAttribute]
        })
        if(i.infor == 0) {
            document.querySelector(`.${i.name}`).innerHTML += `<div>${i.res}</div>`
        }
        else {   
            console.log(i)
            id3(arrNext)

        }
    }
    
}

const abc = [{day: 'D1', temp: 'Hot', humidity: 'High', wind: 'Weak', play: 'No'},
{day: 'D2', temp: 'Hot', humidity: 'High', wind: 'Strong', play: 'No'},
{day: 'D8', temp: 'Mild', humidity: 'High', wind: 'Weak', play: 'No'},
{day: 'D9', temp: 'Cool', humidity: 'Normal', wind: 'Weak', play: 'Yes'},
{day: 'D11', temp: 'Mild', humidity: 'Normal', wind: 'Strong', play: 'Yes'}]
id3(examples)

function unique(arr) {
    var newArr = []
    newArr = arr.filter(function (item) {
      return newArr.includes(item) ? '' : newArr.push(item)
    })
    return newArr
  }
const transpose = (matrix) => {
    let [row] = matrix
    return row.map((value, column) => value)
}


