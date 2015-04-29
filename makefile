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


make_ref=$(foreach l,$1,-r $l)

# ------------------------------------------------------------------------------
# Contrib

CONTRIB_LIBS:= \
	contrib/server/MySql-Connector-6.9.6/v4.5/MySql.Data.dll \
	contrib/server/Nustache-1.14.0.4/Nustache.Core.dll \
	contrib/server/yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
	#

contrib_refs=$(call make_ref,$(CONTRIB_LIBS))

# ------------------------------------------------------------------------------
# Targets

.PHONY: all clean install_contrib run


all: http.exe

run: install_contrib all
	$(call launch_assembly,http.exe)

clean:
	rm -rf http.exe
	rm -rf *.dll


# ------------------------------------------------------------------------------
# http.exe

http.exe_SRC:=$(wildcard src/myserver/*.n)
http.exe_DLLS:=httplib.dll httplib_db_mysql.dll

http.exe: $(http.exe_SRC) $(http.exe_DLLS) #httplib.dll httplib_db_mysql.dll
	$(NCC) -no-color  $($@_SRC) -o $@ \
		$(contrib_refs) $(call make_ref,$($@_DLLS))


# ------------------------------------------------------------------------------
# httplib.dll

httplib.dll_SRC:=$(wildcard src/httplib/*.n)
httplib.dll_DLLS:=

httplib.dll: $(httplib.dll_SRC) $(httplib.dll_DLLS)
	$(NCC) -t:library -no-color $($@_SRC) -o $@ \
		$(contrib_refs) $(call make_ref,$($@_DLLS))


# ------------------------------------------------------------------------------
# httplib_db_mysql.dll

httplib_db_mysql.dll_SRC:=$(wildcard src/httplib/db/mysql/*.n)
httplib_db_mysql.dll_DLLS:=httplib.dll

httplib_db_mysql.dll: $(httplib_db_mysql.dll_SRC) $(httplib_db_mysql.dll_DLLS)
	$(NCC) -t:library -no-color $($@_SRC) -o $@ \
		$(contrib_refs) $(call make_ref,$($@_DLLS))


# ------------------------------------------------------------------------------
# install_contrib
# Copy dlls listed by CONTRIB_LIBS to the default path of the built assemblies
# and executables (currently ./)

define cp_contrib_lib
$1: $2
	cp $2 $1
endef

$(foreach l,$(CONTRIB_LIBS),$(eval $(call cp_contrib_lib,./$(notdir $l),$l)))

install_contrib: $(foreach l,$(CONTRIB_LIBS),./$(notdir $l))
