package main

import (
	"bufio"
	"encoding/json"
	"io"
	"io/ioutil"
	"math"
	"os"
	"strings"
)

type Codes struct {
	Elements []Code
}

type Line struct {
	NumSpaceIndent int
	Line           string
}

type Code struct {
	Id    int    `json:"id"`
	Fe    string `json:"fileEnding"`
	Title string `json:"title"`
	Lines []Line `json:"lines[]"`
}

func main() {
	err := ReadAllDirFilesIntoJsonFile("./Codes/files")
	if err != nil {
		panic(err)
	} else {
		println("Read all files successfully!")
	}

}

// returns how many spaces there were and the modified string
func removeLeftSpaces(str string) (int, string) {
	trm := strings.TrimLeft(str, " ")
	num := int(math.Abs(float64(len(trm) - len(str))))
	return num, trm
}

// reads all the files in the given directory
func ReadAllDirFilesIntoJsonFile(dir string) (err error) {
	filename := dir
	files, err := ioutil.ReadDir(filename)
	if err != nil {
		return err
	}

	codes := Codes{make([]Code, 0)}

	counter := 0
	for _, f := range files {
		code := Code{}
		counter++
		code.Id = counter
		code.Title = strings.TrimRight(strings.SplitAfterN(f.Name(), ".", 2)[0], ".")
		code.Fe = strings.ToLower((strings.SplitAfterN(f.Name(), ".", 2)[1]))
		code.Lines = make([]Line, 0)

		file, err := os.Open(filename + "/" + f.Name())
		if err != nil {
			return err
		}
		defer file.Close()

		reader := bufio.NewReader(file)
		var line string
		for {
			line, err = reader.ReadString('\n')
			if err != nil && err != io.EOF {
				break
			}
			i, str := removeLeftSpaces(line)
			l := Line{i, str}
			// append to struct
			code.Lines = append(code.Lines, l)
			//fmt.Printf("%v\n", code.Lines)

			if err != nil {
				break
			}
		}
		codes.Elements = append(codes.Elements, code)
	}
	// Marshall the struct into json
	jFile, err := json.MarshalIndent(codes, "", " ")
	if err != nil {
		return err
	}
	err = os.WriteFile("codes.json", jFile, 0644)
	if err != nil {
		return err
	}

	return nil
}
