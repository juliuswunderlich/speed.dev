package main

import (
	"log"
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
	config.Port = ":3000"
	config.StaticFolder = "../frontend"
	config.IndexFile = "../index.html"
}

func main() {
	// gin router
	router := gin.Default()
	// use default config for now
	config := Config{}
	config.SetDefault()

	// frontend
	router.Use(static.Serve("/", static.LocalFile(config.StaticFolder, true)))
	router.LoadHTMLGlob(config.IndexFile)

	// define some routes
	router.GET("/code", codesRequestHandler)
	router.Run(config.Port)
}

func codesRequestHandler(c *gin.Context) {
	dir := "utils/Codes/files"
	err, js := utils.ReadAllDirFilesIntoJson(dir)
	if err != nil {
		log.Fatal(err)
	}
	c.Writer.Write(js)
}
