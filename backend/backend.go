package main

import (
	"fmt"
	"log"
	"net/http"
	"utils"
)

func main() {
	fileServer := http.FileServer(http.Dir("../frontend/static"))
	http.Handle("/", fileServer)
	http.HandleFunc("/codes", codesRequestHandler)

	fmt.Printf("Starting server at port 3000\n")
	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal(err)
	}
}

func codesRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/codes" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}

	dir := "utils/Codes/files"
	err, js := utils.ReadAllDirFilesIntoJson(dir)
	if err != nil {
		log.Fatal(err)
	}
	w.Write(js)
}
