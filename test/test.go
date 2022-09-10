package main

import "fmt"

type array struct {
	one, two int
	fruit    string
	truth    bool
}

func main() {
	arr := array{1, 2, "apple", true}
	fmt.Println(arr)
}
