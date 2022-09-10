package main

import (
	"fmt"
	"math"

	"github.com/xuri/excelize/v2"
)

var rows, cols [][]string

type node struct {
	data      attribute
	value     string
	listChild []child
}
type child struct {
	node node
	leaf leaf
}
type leaf struct {
	result string
	value  string
}

type cell struct {
	value  string // giá trị của thuộc tính
	value2 string // kết quả phân lớp
	count  int    // Đếm số lần
}
type attribute struct {
	name  string
	pos   int
	cells []cell
	infor float64 //information gain
}

func entropy(arr []cell) float64 {
	var sum float64 = 0
	var p float64
	total := 0
	for _, value := range arr {
		total += value.count
	}
	for _, value := range arr {
		p = float64(value.count) / float64(total)
		sum -= (p * float64(math.Log2(p)))
	}
	sum = math.Round(sum*1000) / 1000
	return sum
}
func findIndex(arr []string, x string) int {
	for i, item := range arr {
		if item == x {
			return i

		}
	}
	return 0
}
func informationGain(listAttributes []attribute) []attribute {
	var arr [][][]cell
	for i, attribute := range listAttributes {
		var arrTemp [][]cell
		for _, item := range filterAttribute(cols[i+1], cols[i+1]) {
			var arrTemp2 []cell
			for _, item2 := range attribute.cells {
				if item.value == item2.value {
					arrTemp2 = append(arrTemp2, item2)
				}
			}
			arrTemp = append(arrTemp, arrTemp2)
		}
		arr = append(arr, arrTemp)
	}
	for i := range listAttributes {
		result := 0.0
		for j, item := range arr[i] {
			sum := 0
			for _, item2 := range item {
				sum += item2.count
			}
			result += float64(sum) / 8.0 * entropy(arr[i][j])
		}
		result = math.Round(result*1000) / 1000
		listAttributes[i].infor = result
	}
	return listAttributes
}
func include(a []cell, x cell) bool {
	for _, item := range a {
		if x.value == item.value {
			return true
		}
	}
	return false
}

func filterAttribute(a []string, b []string) []cell {
	var result []cell
	result = append(result, cell{a[0], b[0], 0})
	for i := 0; i < len(a); i++ {
		check := true
		for j, item := range result {
			if a[i] == item.value && b[i] == item.value2 {
				result[j].count++
				check = false
				break
			}
		}
		if check {
			result = append(result, cell{a[i], b[i], 1})
		}
	}

	return result
}

func max(arr []attribute, entropy float64) (int, attribute) {
	pos := 0
	res := arr[0]
	res.infor = entropy - res.infor
	for i, item := range arr {
		if x := entropy - item.infor; x > res.infor {
			res = item
			pos = i
		}
	}

	return pos, res
}
func getListAttribute(rows [][]string, cols [][]string) []attribute {
	var listAttributes []attribute
	for i := 1; i < len(rows[0])-1; i++ {
		listAttributes = append(listAttributes, attribute{name: rows[0][i], pos: i - 1, cells: filterAttribute(cols[i], cols[len(cols)-1])})
	}
	return listAttributes
}
func remove(arr []string, index int) []string {
	copy(arr[index:], arr[index+1:])
	arr[len(arr)-1] = ""
	arr = arr[:len(arr)-1]
	return arr
}

func resetData(listAttributes []attribute, entropy float64, node node) [][]cell {
	//chọn thuộc tính phân hoạch
	var list [][]cell
	for i, item := range listAttributes[node.data.pos].cells {
		check := true
		if len(list) == 0 {
			list = append(list, listAttributes[node.data.pos].cells[i:i+1])
		} else {
			for j, arrChild := range list {
				if include(arrChild, item) {
					list[j] = append(list[j], item)
					check = false
					break
				}
			}
			if check {
				list = append(list, listAttributes[node.data.pos].cells[i:i+1])
			}
		}
	}
	return list
}
func partition(list [][]cell, pos int, node *node) {
	for index := range list {
		var newArr [][]string
		for i, row := range rows {
			check := false
			for j, item := range row {
				if item == list[index][0].value {
					pos = j
					check = true
					break
				}
			}
			if check {
				newArr = append(newArr, remove(rows[i], pos))
			}
		}
		var newArr2 [][]string
		for i := range newArr[0] {
			var arrTemp []string
			for j := range newArr {
				arrTemp = append(arrTemp, newArr[j][i])
			}
			newArr2 = append(newArr2, arrTemp)
		}

		inforD2 := filterAttribute(newArr2[len(newArr2)-1], newArr2[len(newArr2)-1])
		var child child
		if y := entropy(inforD2); y == 0 {
			child.leaf.result = newArr2[len(newArr2)-1][0]
			child.leaf.value = list[index][0].value
		} else {
			child.node.value = list[index][0].value
		}
		node.listChild = append(node.listChild, child)
	}
}
func printTree(node node) {
	fmt.Printf("\t\t%s\n\n", node.data.name)
	for _, child := range node.listChild {
		if len(child.node.value) == 0 {
			fmt.Printf("%-10s", child.leaf.value)
		} else {
			fmt.Printf("%-10s", child.node.value)

		}
	}
	fmt.Println("")
	for _, child := range node.listChild {
		if len(child.node.value) == 0 {
			fmt.Printf("%-10s", child.leaf.result)
		} else {
			fmt.Printf("%-10s", child.node.value)

		}
	}
}

func main() {
	f, err := excelize.OpenFile("DataSet.xlsx")

	if err != nil {
		fmt.Println(err)
		return
	}
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println(err)
		}
	}()

	cols, _ = f.GetCols("Sheet2")
	rows, _ = f.GetRows("Sheet2")
	var root node
	var pos int

	//xóa hàng tên thuộc tính
	for i, item := range cols {
		cols[i] = remove(item, 0)
	}

	// lọc data theo thuộc tính trả về một mảng gồm:
	// Tên thuộc tính và số lần xuất hiện
	arrResult := filterAttribute(cols[len(cols)-1], cols[len(cols)-1]) // Lọc tính entropy để phân lớp một mẫu trong data
	// entropy
	x := entropy(arrResult)

	//Lấy tên thuộc tính, trường, vị trí
	listAttributes := getListAttribute(rows, cols)
	//Tính infor cho cho listAttribute
	informationGain(listAttributes)

	pos, root.data = max(listAttributes, x)    //Chọn thuộc tính có informationGain lớn nhất để phân hoạch
	list := resetData(listAttributes, x, root) // kết quả khi phân hoạch
	partition(list, pos, &root)
	//set lại dữ liệu sau khi phân hoạch
}
