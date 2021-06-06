package main

import (
	"log"
	"net/http"
	"utils"

	"github.com/gin-gonic/gin"
)

type Config struct {
	Port         string
	StaticFolder string
	IndexFile    string
}

func (config *Config) SetDefault() {
	config.Port = ":3000"
	config.StaticFolder = "../frontend"
	config.IndexFile = "../index.html"
}

// global config variable
var config Config

func main() {
	// gin router
	router := gin.Default()
	// use default config for now
	config = Config{}
	config.SetDefault()

	// frontend
	//router.LoadHTMLGlob(config.StaticFolder)
	//router.Use(static.Serve("/", static.LocalFile(config.IndexFile, true)))
	router.StaticFS("/frontend/static", http.Dir("frontend/static"))
	router.StaticFile("/", config.IndexFile)

	// define some routes
	//router.GET("/", defaultRouteHandler)
	router.GET("/code", codesRequestHandler)
	router.Run(config.Port)
}

func defaultRouteHandler(c *gin.Context) {
}

func codesRequestHandler(c *gin.Context) {
	dir := "utils/Codes/files"
	err, js := utils.ReadAllDirFilesIntoJson(dir)
	if err != nil {
		log.Fatal(err)
	}
	c.Writer.Write(js)
}
