package main

import (
	"fmt"
	"log"
	"net/http"
)

func codeRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/code" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

	fmt.Fprintf(w, "At this endpoint you will be able to receive your code")
}

func main() {
	fileServer := http.FileServer(http.Dir("./static")) // New code
	http.Handle("/", fileServer)                        // New code
	http.HandleFunc("/code", codeRequestHandler)

	fmt.Printf("Starting server at port 3000\n")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal(err)
	}
}
