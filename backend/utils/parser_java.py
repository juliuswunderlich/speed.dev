from os import listdir
import json
PATH = 'Codes/files_java/'


def parse():
    Codes = []
    code_id = 0
    for filename in listdir(PATH):
        with open (PATH + filename, 'r') as file:
            Code = {}
            Code['lines'] = []
            num_chars = 0
            for l in file:
                # ignore comments
                if l.strip().startswith("//"):
                  continue
                # build and add line structs
                line = {}
                # remove indent and newline char
                content = l.lstrip()
                num_chars += len(content)
                indent = len(l) - len(content)
                content = content.rstrip()
                line['content'] = content
                line['indent'] = indent
                Code['lines'].append(line)
            # build code struct
            Code['id'] = code_id
            code_id += 1
            # split name
            Code['fileEnding'] = filename.split('.')[1]
            Code['title'] = filename.split('.')[0]
            Code['charCount'] = num_chars
            Codes.append(Code)
    with open('Codes/codes_java.json', 'w') as outfile:
        json.dump(Codes, outfile, indent=1)


if __name__ == '__main__':
    parse()