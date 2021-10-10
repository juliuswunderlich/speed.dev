import os

filepath = "C:/Users/Niklas/code/Java/test/ParseInteger.java"
long_ass_command = "java --add-exports jdk.compiler/com.sun.tools.javac.api=ALL-UNNAMED --add-exports jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED --add-exports jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED --add-exports jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED --add-exports jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED"

os.system(f"{long_ass_command} -jar google-java-format-1.11.0-all-deps.jar \"{filepath}\"")
