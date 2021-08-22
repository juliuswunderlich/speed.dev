from os import listdir
import re
import json

INPUT = 'C:/Users/Niklas/code/Java/Maths/'
OUTPUT = 'Codes/codes_java_math.json'
TAB_SIZE = 2

def extractFunctions(filepath):
    keywords = ("public", "static", "protected")
    functions = []
    with open(filepath, 'r') as file:
        
        inMethod = False
        indent = 0
        for line in file:
            if inMethod:
                method += line[indent:]
                if getIndent(line) == indent:
                    method = method.rstrip()
                    inMethod = False
                    if len(method.split('\n')) >= 5:
                        functions.append(method)
            if not inMethod:
                if line.strip().startswith(keywords) and line.rstrip()[-1] == "{" and not any(s in line for s in ('main', 'class')) and len(line.split("(")[0].split()) > 2:
                    method = line.lstrip()
                    indent = getIndent(line)
                    inMethod = True
    
    return functions


def parseFiles(path):
    Codes = []
    code_id = 200
    for filename in listdir(path):
        functions = extractFunctions(path + filename)
        for f in functions:
            Code = function_to_JSON(f)
            Code['id'] = code_id
            Codes.append(Code)
            code_id += 1

    with open(OUTPUT, 'w') as outfile:
        json.dump(Codes, outfile, indent=1)

def getIndent(line):
    return len(line) - len(line.lstrip())


def function_to_JSON(function_text):
    Code = {}
    Code['lines'] = []
    num_chars = 0
    last_indent = 0
    for l in function_text.splitlines():
        # ignore comments
        if l.strip().startswith(("//", "/*", "*")):
          continue
        # build and add line structs
        line = {}
        # remove indent and newline char
        #if line not empty
        if l.strip():                  
          content = l.lstrip()
          num_chars += len(content) + 1
          indent = int((len(l) - len(content)) / TAB_SIZE)
          last_indent = indent
          content = content.rstrip()
        #if line is empty (or only whitespaces)
        else:
          content = ""
          num_chars += 1
          indent = last_indent
        line['content'] = content
        line['indent'] = indent
        Code['lines'].append(line)
    # build code struct
    # split name
    Code['fileEnding'] = "java"
    # extract functin name
    Code['title'] = function_text.splitlines()[0].split('(')[0].split()[-1]
    Code['charCount'] = num_chars
    return Code
    
    
if __name__ == '__main__':    
    parseFiles(INPUT)