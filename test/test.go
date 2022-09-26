package main

import "fmt"

type abc struct {
	number int
}

func recusion(a *abc) {
	fmt.Println(*a)
	a.number = a.number - 1
	if a.number == 1 {
		return
	}
	recusion(a)
}

func main() {
	var a abc
	a.number = 10
	recusion(&a)
}
