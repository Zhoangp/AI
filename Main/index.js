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

const getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight
    };
  }
  
  const connect = (div1, div2, color, thickness) => {
    const off1 = getOffset(div1);
    const off2 = getOffset(div2);
  
    const x1 = off1.left + off1.width;
    const y1 = off1.top + off1.height;
  
    const x2 = off2.left + off2.width;
    const y2 = off2.top;
  
    const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
  
    const cx = ((x1 + x2) / 2) - (length / 2);
    const cy = ((y1 + y2) / 2) - (thickness / 2);
  
    const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
  
    const htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
  
    document.body.innerHTML += htmlLine;
  }
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
var ex2 = [
    {ten: "Hoa", MauToc: "Den", ChieuCao: "TB", CanNang: "Nhe", DungThuoc: "Khong", KetQua: "BiChay"},
    {ten: "Lan", MauToc:	"Den", ChieuCao:	"Cao", CanNang: "Vua", DungThuoc:	"Co", KetQua: 	"KhongChay"},
    {ten: "Xuân", MauToc:	"Ram", ChieuCao:	"Thap", CanNang:	"Vua", DungThuoc:	"Co", KetQua: 	"KhongChay"},
    {ten: "Hạ", MauToc:	"Den", ChieuCao:	"Thap", CanNang:	"Vua", DungThuoc:	"Khong", KetQua: 	"BiChay"},
    {ten: "Thu", MauToc:	"Bac", ChieuCao:	"TB", CanNang:	"Nang", DungThuoc:	"Khong", KetQua: 	"BiChay"},
    {ten: "Đông", MauToc:	"Ram", ChieuCao:	"Cao", CanNang: "Nang", DungThuoc:	"Khong", KetQua: 	"KhongChay"},
    {ten: "Mơ", MauToc:	"Ram", ChieuCao:	"TB", CanNang:	"Nang", DungThuoc:	"Khong", KetQua: 	"KhongChay"},
    {ten: "Đào", MauToc:	"Den", ChieuCao:	"Thap", CanNang:	"Nhe", DungThuoc:	"Co", KetQua: 	"KhongChay"}

]
var ex3 = [
{ID: "1",	Age: "Young"  	, Income: "High",    	Student: "No",	Credit: "Fair"     	 , Buys: "No"},
{ID: "2",	Age: "Young"  	, Income: "High",    	Student: "No",	Credit: "Excellent"     	 , Buys: "No"},
{ID: "3",	Age: "Midlle"  	, Income: "High",    	Student: "No",	Credit: "Fair"     	 , Buys: "Yes"},
{ID: "4",	Age: "Old"  	, Income: "Medium",    	Student: "No",	Credit: "Fair"     	 , Buys: "Yes"},
{ID: "5",	Age: "Old"  	, Income: "Low",    	Student: "Yes",	Credit: "Fair"     	 , Buys: "Yes"},
{ID: "6",	Age: "Old"  	, Income: "Low",    	Student: "Yes",	Credit: "Excellent"     	 , Buys: "No"},
{ID: "7",	Age: "Midlle"  	, Income: "Low",    	Student: "Yes",	Credit: "Excellent"     	 , Buys: "Yes"},
{ID: "8",	Age: "Young"  	, Income: "Medium",    	Student: "No",	Credit: "Fair"     	 , Buys: "No"},
{ID: "9",	Age: "Young"  	, Income: "Low",    	Student: "Yes",	Credit: "Fair"     	 , Buys: "Yes"},
{ID: "10",	Age: "Old"  	, Income: "Medium",    	Student: "Yes",	Credit: "Fair"     	 , Buys: "Yes"},
{ID: "11",	Age: "Young"  	, Income: "Medium",    	Student: "Yes",	Credit: "Excellent"     	 , Buys: "Yes"},
{ID: "12",	Age: "Midlle"  	, Income: "Medium",    	Student: "No",	Credit: "Excellent"     	 , Buys: "Yes"},
{ID: "13",	Age: "Midlle"  	, Income: "High",    	Student: "Yes",	Credit: "Fair"     	 , Buys: "Yes"},
{ID: "14",	Age: "Old"  	, Income: "Medium",    	Student: "No",	Credit: "Excellent"     	 , Buys: "No"},
]


//ar features = ['outlook', 'temp', 'humidity', 'wind'];

const entropy = (arr) => {
    let key
    let value
    let res = new Array()
    for(let i = 0; i < arr.length; i++) {
        key = Object.keys(arr[i]).pop()
        value = Object.values(arr[i]).pop()
    res.push({[key]: value})
}
    res = [...new Map(res.map(item =>[item[key], item])).values()];
    console.log(res)
    let e = 0;
    const total = arr.length;
    for(let i = 0; i < res.length; i++) {
        let count = 0
        for (const item of arr) {
            if(item[key] == res[i][key]) {
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
        console.log(e)
        if(e == 0) {
            x = arr.filter(i => i[attribute] == item)[0]
            a = {name: item, infor: e, res: x[Object.keys(x)[Object.keys(x).length - 1]]}

        }
        else {
        a = {name: item, infor: e, res: ""}
        }

        listFeatures.push(a)
    }
    return {inforGain: Math.round(inforGain * 1000)/1000, list: listFeatures}
}
const id3 = (arr, nameClass) => {  
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

    document.querySelector(`.${nameClass}`).innerHTML +=  `<div class="node"><p>${attribute.nameAttribute}</p></div>`
    document.querySelector(`.${nameClass}`).innerHTML += `<div class="node ${attribute.nameAttribute}"></div>`

    for(let i of attribute.listFeatures) {
        document.querySelector(`.${attribute.nameAttribute}`).innerHTML += `<div class="child ${i.name}"><div class="node"><button>${i.name}</button></div></div>`
        arrNext = (arr.filter(item => item[attribute.nameAttribute] == i.name))
        arrNext.forEach(e => {
            delete e[attribute.nameAttribute]
        })
        if(i.infor == 0) {
            document.querySelector(`.${i.name}`).innerHTML += `<div><span>${i.res}</span></div>`
        }
        else {   
            console.log(i)
            id3(arrNext, i.name)

        }
    }
    
}

const abc = [{day: 'D1', temp: 'Hot', humidity: 'High', wind: 'Weak', play: 'No'},
{day: 'D2', temp: 'Hot', humidity: 'High', wind: 'Strong', play: 'No'},
{day: 'D8', temp: 'Mild', humidity: 'High', wind: 'Weak', play: 'No'},
{day: 'D9', temp: 'Cool', humidity: 'Normal', wind: 'Weak', play: 'Yes'},
{day: 'D11', temp: 'Mild', humidity: 'Normal', wind: 'Strong', play: 'Yes'}]
id3(ex2, 'tree')

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




