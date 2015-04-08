
NCC_PATH:=/home/jon/devel/nemerle-1.2
NCC:=mono $(NCC_PATH)/ncc.exe

MONO_PATH:=$(NCC_PATH)


all: http.exe

http.exe: http.n
	$(NCC) -no-color $< -o $@

run: all
	export MONO_PATH=$(MONO_PATH) && mono http.exe

clean:
	rm http.exe
