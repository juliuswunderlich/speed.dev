from os import listdir
import json

TAB_SIZE = 2

def extractFunctions(filepath):
    keywords = ("public", "static", "protected")
    functions = []
    with open(filepath, 'r') as file:
        
        function = ""
        inFunction = False
        inBlockComment = False
        indent = 0
        for line in file:
            #ignore block comments
            if line.lstrip().startswith('/*'):
                inBlockComment = True
                continue
            if inBlockComment:
                if line.lstrip().startswith('*/'):
                    inBlockComment = False
                continue

            if inFunction:
                #non-empty line
                if line.strip():
                    function += line[indent:]                    
                else:
                    pass
                    # function += "\n"

                #end of function is reached if indent is equal to beginning
                if getIndent(line) == indent:
                    function = function.rstrip()
                    inFunction = False
                    if len(function.split('\n')) >= 5:
                        functions.append(function)
            if not inFunction:
                if line.strip().startswith(keywords) and line.rstrip()[-1] == "{" and not any(s in line for s in ('main', 'class', 'interface')) and len(line.split("(")[0].split()) > 2:
                    function = line.lstrip()
                    indent = getIndent(line)
                    inFunction = True

    return functions


def parseFiles(input_path, output_path, start_id):
    Codes = []
    code_id = start_id
    for filename in listdir(input_path):
        functions = extractFunctions(input_path + filename)
        for f in functions:
            Code = function_to_JSON(f)
            Code['id'] = code_id
            Codes.append(Code)
            code_id += 1

    with open(output_path, 'w') as outfile:
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
        if "//" in l:
            l = l.split("//")[0].rstrip()
        if "/*" in l:
            l = l.split("/*")[0].rstrip()
        
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
    code_id = 100
    parseFiles('C:/Users/Niklas/code/Java/Sorts/', 'Codes/codes_java_sorts.json', 100)
    parseFiles('C:/Users/Niklas/code/Java/Maths/', 'Codes/codes_java_math.json', 200)