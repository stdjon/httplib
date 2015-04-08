

NCC_PATH:=/home/jon/devel/nemerle-1.2
NCC:=mono $(NCC_PATH)/ncc.exe

MONO_PATH:=$(NCC_PATH)


all: http.exe

run: all
	export MONO_PATH=$(MONO_PATH) && mono http.exe

http.exe: http.n server.dll
	$(NCC) -no-color  $< -o $@ -r server.dll 

%.dll: %.n
	$(NCC) -t:library -no-color $< -o $@

clean:
	rm http.exe
	rm *.dll
