

NCC_PATH:=/home/jon/devel/nemerle-1.2
NCC:=mono $(NCC_PATH)/ncc.exe

MONO_PATH:=$(NCC_PATH)


all: http.exe

run: all
	export MONO_PATH=$(MONO_PATH) && mono http.exe

http.exe: http.n server.dll
	$(NCC) -no-color  $< -o $@ \
		-r server.dll \
		-r contrib/server/Nustache-1.14.0.4/Nustache.Core.dll \
		-r contrib/server/yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
		#

%.dll: %.n
	$(NCC) -t:library -no-color $< -o $@

clean:
	rm http.exe
	rm *.dll
