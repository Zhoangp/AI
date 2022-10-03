package main

import (
	"fmt"
	"math"
	"strings"

	"github.com/xuri/excelize/v2"
)

var rows, cols [][]string

type node struct {
	data      attribute
	value     string
	listChild []node
	listLeaf  []leaf
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
func informationGain(listAttributes []attribute, cols [][]string) []attribute {
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
			result += (float64(sum) / float64(len(cols[0]))) * entropy(arr[i][j])
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
func getListAttribute(x [][]string, y [][]string) []attribute {
	var listAttributes []attribute
	for i := 1; i < len(x[0])-1; i++ {
		listAttributes = append(listAttributes, attribute{name: x[0][i], pos: i - 1, cells: filterAttribute(y[i], y[len(y)-1])})
	}
	return listAttributes
}
func remove(arr []string, index int) []string {
	copy(arr[index:], arr[index+1:])
	arr[len(arr)-1] = ""
	arr = arr[:len(arr)-1]
	return arr
}
func swap(x cell, y cell) (cell, cell) {
	return y, x
}
func sort(x []cell) []cell {
	for i := 0; i < len(x); i++ {
		for j := i; j < len(x); j++ {
			if strings.Compare(x[i].value, x[j].value) == 1 {
				a, b := swap(x[i], x[j])
				x[i] = a
				x[j] = b
			}
		}
	}
	return x
}

func resetData(listAttributes []attribute, entropy float64, node node) [][]cell {
	//chọn thuộc tính phân hoạch
	listAttributes2 := sort(listAttributes[node.data.pos].cells)
	var list [][]cell
	var listTemp []cell
	for i, item := range listAttributes2 {
		if len(listTemp) == 0 {
			listTemp = append(listTemp, item)
		} else {
			if item.value != listTemp[0].value {
				list = append(list, listTemp)
				listTemp = nil
				listTemp = append(listTemp, item)
			} else {
				listTemp = append(listTemp, item)
				if i == len(listAttributes2)-1 {
					list = append(list, listTemp)
				}
			}
		}
		if i == len(listAttributes2)-1 {
			list = append(list, listTemp)

		}
	}

	return list
}
func filterDataWithAttribute(nameAttribute string, value string, pos int, rows [][]string) [][]string {
	fmt.Println(nameAttribute)
	fmt.Println(value)
	fmt.Println(rows)

	var newArr [][]string
	var rows2 [][]string
	for _, row := range rows {
		var rowTemp []string
		rowTemp = append(rowTemp, row...)
		rows2 = append(rows2, rowTemp)

	}
	for i, row := range rows2 {
		fmt.Println(row)
		check := false
		for j, item := range row {
			fmt.Println(item)

			if item == value || item == nameAttribute {
				pos = j
				check = true
				break
			}
		}
		if check {
			newArr = append(newArr, remove(rows2[i], pos))
			fmt.Println(newArr)
		}
	}
	return newArr
}
func rowToCol(rows [][]string) [][]string {
	var cols [][]string
	for i := range rows[0] {
		var arrTemp []string
		for j := range rows {
			arrTemp = append(arrTemp, rows[j][i])
		}
		cols = append(cols, arrTemp)
	}
	return cols
}
func printTree(node node) {
	fmt.Printf("\t\t%s\n\n", node.data.name)
	for _, leaf := range node.listLeaf {
		fmt.Printf("(%s)%10s", leaf.value, "")
	}

	for _, child := range node.listChild {
		fmt.Printf("%-10s", child.value)
	}
	fmt.Println()
	/* if len(node.listChild) != 0 {
		printTree(node.listChild[0])
	} */

}
func id3(n *node, rows [][]string, cols [][]string) {
	if len(rows[0]) <= 2 {
		return
	}
	printRows(rows)

	listAttributes := getListAttribute(rows, cols)
	arrResult := filterAttribute(cols[len(cols)-1], cols[len(cols)-1])
	fmt.Println(arrResult)
	x := entropy(arrResult)

	informationGain(listAttributes, cols)
	var pos int

	pos, n.data = max(listAttributes, x)
	fmt.Println(pos)
	list := resetData(listAttributes, x, *n)
	for index := range list {
		newArr := filterDataWithAttribute(n.data.name, list[index][0].value, pos, rows)
		newArr2 := rowToCol(newArr)

		for i, item := range newArr2 {
			newArr2[i] = remove(item, 0)
		}

		inforD2 := filterAttribute(newArr2[len(newArr2)-1], newArr2[len(newArr2)-1])

		if y := entropy(inforD2); y == 0 {
			var child leaf
			child.result = newArr2[len(newArr2)-1][0]
			child.value = list[index][0].value
			n.listLeaf = append(n.listLeaf, child)

		} else {
			var child node
			child.value = list[index][0].value
			id3(&child, newArr, newArr2)
			n.listChild = append(n.listChild, child)
		}
	}
}
func printRows(rows [][]string) {
	for _, row := range rows {
		for _, item := range row {
			fmt.Printf("%-15s| ", item)
		}
		fmt.Println()
	}
	fmt.Println()

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
	//xóa hàng tên thuộc tính
	for i, item := range cols {
		cols[i] = remove(item, 0)
	}
	var root node

	id3(&root, rows, cols)
	printTree(root)
	printTree(root.listChild[0])

}
