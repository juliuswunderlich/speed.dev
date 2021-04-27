package main

import (
	"log"
	"net/http"
	"utils"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type Config struct {
	Port         string
	StaticFolder string
	IndexFile    string
}

func (config *Config) SetDefault() {
	config.Port = "3000"
	config.StaticFolder = "../frontend"
	config.IndexFile = "../index.html"
}

func main() {
	// gin router
	router := gin.Default()
	// use default config for now
	config := Config{}
	config.SetDefault()
	router.Run(config.Port)

	// frontend
	router.Use(static.Serve("/", static.LocalFile(config.StaticFolder, true)))
	router.LoadHTMLGlob(config.IndexFile)

	// define some routes
	router.GET("/code", codesRequestHandler)

	/*
		router.POST("/somePost", posting)
		router.PUT("/somePut", putting)
		router.DELETE("/someDelete", deleting)
		router.PATCH("/somePatch", patching)
		router.HEAD("/someHead", head)
		router.OPTIONS("/someOptions", options)

		// By default it serves on :8080 unless a
		// PORT environment variable was defined.
		router.Run()
		// router.Run(":3000") for a hard coded port

		/*
		fileServer := http.FileServer(http.Dir("../frontend/static"))
		http.Handle("/", fileServer)
		http.HandleFunc("/codes", codesRequestHandler)

		fmt.Printf("Starting server at port 3000\n")
		if err := http.ListenAndServe(":3000", nil); err != nil {
			log.Fatal(err)
		}
	*/
}

func defaultHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
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
