# ------------------------------------------------------------------------------
# Config

ifeq ($(OS),Windows_NT)

# Windows configuration
NCC:=ncc
launch_assembly=./$1

else

# Linux/Mono configuration:
NCC_PATH:=/home/jon/devel/nemerle-1.2
NCC:=mono $(NCC_PATH)/ncc.exe
launch_assembly=export MONO_PATH=$(MONO_PATH) && mono $1
MONO_PATH:=$(NCC_PATH)

endif


# ------------------------------------------------------------------------------
# Contrib

CONTRIB_LIBS:= \
	contrib/server/Nustache-1.14.0.4/Nustache.Core.dll \
	contrib/server/yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
	#

contrib_refs=$(foreach c,$(CONTRIB_LIBS),-r $c)


# ------------------------------------------------------------------------------
# Targets

all: http.exe

run: install_contrib all
	$(call launch_assembly,http.exe)

clean:
	rm -rf http.exe
	rm -rf *.dll


# ------------------------------------------------------------------------------
# http.exe

http.exe_SRC:=$(wildcard src/myserver/*n)

http.exe: $(http.exe_SRC) httplib.dll
	$(NCC) -no-color  $($@_SRC) -o $@ \
		$(contrib_refs) \
		-r httplib.dll


# ------------------------------------------------------------------------------
# httplib.dll

httplib.dll_SRC:=$(wildcard src/httplib/*.n)

httplib.dll: $(httplib.dll_SRC)
	$(NCC) -t:library -no-color $^ -o $@ \
		$(contrib_refs)


# ------------------------------------------------------------------------------
# install_contrib
# FIXME: ugly, just for the time being

define contrib_cp
	cp $1 .;
endef
install_contrib:
	cp $(CONTRIB_LIBS) .
