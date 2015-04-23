

NCC_PATH:=/home/jon/devel/nemerle-1.2
NCC:=mono $(NCC_PATH)/ncc.exe

MONO_PATH:=$(NCC_PATH)

CONTRIB_LIBS:= \
	contrib/server/Nustache-1.14.0.4/Nustache.Core.dll \
	contrib/server/yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
	#


contrib_refs=$(foreach c,$(CONTRIB_LIBS),-r $c)

all: http.exe

run: install_contrib all
	./http.exe

http.exe: http.n assembly_info.n server.dll page.dll
	$(NCC) -no-color  $< assembly_info.n \
		-o $@ \
		$(contrib_refs) \
		-r server.dll \
		-r page.dll \
		#

%.dll: %.n
	$(NCC) -t:library -no-color $< -o $@ \
		$(contrib_refs) \
		#

clean:
	rm http.exe
	rm *.dll


# FIXME: ugly, just for the time being
define contrib_cp
	cp $1 .;
endef
install_contrib:
	cp $(CONTRIB_LIBS) .
#	$(foreach c,$(CONTRIB_LIBS),$(call contrib_cp,$c))
