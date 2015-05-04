# ------------------------------------------------------------------------------
# Config

ifeq ($(OS),Windows_NT)

# Windows configuration
NCC:=ncc
launch_assembly=cd bin/ && ./$1

else

# Linux/Mono configuration:
NCC_PATH:=/home/jon/devel/nemerle-1.2
NCC:=mono $(NCC_PATH)/ncc.exe
launch_assembly=export MONO_PATH=$(MONO_PATH) && cd bin/ && mono $1
MONO_PATH:=$(NCC_PATH)

endif


make_ref=$(foreach l,$1,-r $l)
refs=$(contrib_refs) $(call make_ref,$($@_DLLS))

# ------------------------------------------------------------------------------
# Contrib

CONTRIB_LIBS:= \
	contrib/server/MySql-Connector-6.9.6/v4.5/MySql.Data.dll \
	contrib/server/NDesk.Options-0.2.1.0/NDesk.Options.dll \
	contrib/server/Nustache-1.14.0.4/Nustache.Core.dll \
	contrib/server/yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
	#

contrib_refs=$(call make_ref,$(CONTRIB_LIBS))


# ------------------------------------------------------------------------------
# Targets

.PHONY: all clean install_contrib run frun


all: bin/forum.exe bin/http.exe

run: install_contrib bin/http.exe
	$(call launch_assembly,http.exe)

frun: install_contrib bin/forum.exe
	$(call launch_assembly,forum.exe)

clean:
	rm -rf bin/


# ------------------------------------------------------------------------------
# bin/forum.exe

bin/forum.exe_SRC:=$(wildcard src/forum/*.n)
bin/forum.exe_DLLS:=bin/httplib.dll bin/httplib.db.mysql.dll bin/httplib.page.nustache.dll

bin/forum.exe: $(bin/forum.exe_SRC) $(bin/forum.exe_DLLS)
	@mkdir -p $(dir $@)
	$(NCC) -no-color  $($@_SRC) -o $@ $(refs)


# ------------------------------------------------------------------------------
# bin/http.exe

bin/http.exe_SRC:=$(wildcard src/myserver/*.n)
bin/http.exe_DLLS:=bin/httplib.dll bin/httplib.db.mysql.dll bin/httplib.page.nustache.dll

bin/http.exe: $(bin/http.exe_SRC) $(bin/http.exe_DLLS)
	@mkdir -p $(dir $@)
	$(NCC) -no-color  $($@_SRC) -o $@ $(refs)


# ------------------------------------------------------------------------------
# bin/httplib.dll

bin/httplib.dll_SRC:=$(wildcard src/httplib/*.n)
bin/httplib.dll_DLLS:=

bin/httplib.dll: $(bin/httplib.dll_SRC) $(bin/httplib.dll_DLLS)
	@mkdir -p $(dir $@)
	$(NCC) -t:library -no-color $($@_SRC) -o $@ $(refs)


# ------------------------------------------------------------------------------
# bin/httplib.db.mysql.dll

bin/httplib.db.mysql.dll_SRC:=$(wildcard src/httplib/db/mysql/*.n)
bin/httplib.db.mysql.dll_DLLS:=bin/httplib.dll

bin/httplib.db.mysql.dll: $(bin/httplib.db.mysql.dll_SRC) $(bin/httplib.db.mysql.dll_DLLS)
	@mkdir -p $(dir $@)
	$(NCC) -t:library -no-color $($@_SRC) -o $@ $(refs)


# ------------------------------------------------------------------------------
# bin/httplib.page.nustache.dll

bin/httplib.page.nustache.dll_SRC:=$(wildcard src/httplib/page/nustache/*.n)
bin/httplib.page.nustache.dll_DLLS:=bin/httplib.dll

bin/httplib.page.nustache.dll: $(bin/httplib.page.nustache.dll_SRC) $(bin/httplib.page.nustache.dll_DLLS)
	@mkdir -p $(dir $@)
	$(NCC) -t:library -no-color $($@_SRC) -o $@ $(refs)


# ------------------------------------------------------------------------------
# install_contrib
# Copy dlls listed by CONTRIB_LIBS to the default path of the built assemblies
# and executables (currently bin/)

define cp_contrib_lib
$1: $2
	@mkdir -p $(dir $1)
	cp $2 $1
endef

$(foreach l,$(CONTRIB_LIBS),$(eval $(call cp_contrib_lib,bin/$(notdir $l),$l)))

install_contrib: $(foreach l,$(CONTRIB_LIBS),bin/$(notdir $l))
