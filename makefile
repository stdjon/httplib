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
	contrib/server/CodeKicker.BBCode-Parser-5.0/CodeKicker.BBCode.dll \
	contrib/server/HtmlSanitizer.2.0.5595.30325/lib/net40/HtmlSanitizer.dll \
	contrib/server/MySql-Connector-6.9.6/v4.5/MySql.Data.dll \
	contrib/server/NDesk.Options-0.2.1.0/NDesk.Options.dll \
	contrib/server/NLog-3.2.1/net45/NLog.dll \
	contrib/server/Nustache-1.14.0.4/Nustache.Core.dll \
	contrib/server/OEmbed.net-master/bin/Debug/Newtonsoft.Json.Net35.dll \
	contrib/server/OEmbed.net-master/bin/Debug/OEmbed.Net.dll \
	contrib/server/Textile-2.0.1/Textile.dll \
	contrib/server/yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
	#

contrib_refs=$(call make_ref,$(CONTRIB_LIBS))


# ------------------------------------------------------------------------------
# Rules Template

# $1 = path to output assembly
# $2 = path to source code directory
# $3 = additional dlls to reference (can be empty)
# $4 = additional args to ncc (can be empty)
define emit_rule
$1_SRC:=$$(wildcard $2/*.n)
$1_DLLS:=$3

$1: $$($1_SRC) $$($1_DLLS)
	mkdir -p $$(dir $$@)
	$$(NCC) $4 -no-color  $$($$@_SRC) -o $$@ $$(refs)
endef


emit_exe_rule=$(call emit_rule,$1,$2,$3)
emit_dll_rule=$(call emit_rule,$1,$2,$3,-t:library)


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
# APPLICATIONS

# ------------------------------------------------------------------------------
# bin/forum.exe

$(eval $(call emit_exe_rule,bin/forum.exe, \
	src/forum, \
	bin/forum.mod.auth.dll \
	bin/httplib.dll bin/httplib.db.mysql.dll bin/httplib.page.nustache.dll \
	bin/httplib.log.nlog.dll \
	bin/httplib.mod.bbcode.dll bin/httplib.mod.htmlsanitize.dll \
	bin/httplib.mod.oembed.dll bin/httplib.mod.textile.dll))


# ------------------------------------------------------------------------------
# bin/forum.mod.auth.dll

$(eval $(call emit_dll_rule,bin/forum.mod.auth.dll, \
	src/forum/mod/auth, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# bin/http.exe

$(eval $(call emit_exe_rule,bin/http.exe, \
	src/myserver, \
	bin/httplib.dll bin/httplib.db.mysql.dll bin/httplib.page.nustache.dll \
	bin/httplib.log.nlog.dll))


# ------------------------------------------------------------------------------
# HTTPLIB CORE

# ------------------------------------------------------------------------------
# bin/httplib.dll

$(eval $(call emit_dll_rule,bin/httplib.dll, \
	src/httplib))


# ------------------------------------------------------------------------------
# DATABASES

# ------------------------------------------------------------------------------
# bin/httplib.db.mysql.dll

$(eval $(call emit_dll_rule,bin/httplib.db.mysql.dll, \
	src/httplib/db/mysql, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# LOGGING

# ------------------------------------------------------------------------------
# bin/httplib.log.nlog.dll

$(eval $(call emit_dll_rule,bin/httplib.log.nlog.dll, \
	src/httplib/log/nlog, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# RENDERERS

# ------------------------------------------------------------------------------
# bin/httplib.page.nustache.dll

$(eval $(call emit_dll_rule,bin/httplib.page.nustache.dll, \
	src/httplib/page/nustache, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# MODULES

# ------------------------------------------------------------------------------
# bin/httplib.mod.bbcode.dll

$(eval $(call emit_dll_rule,bin/httplib.mod.bbcode.dll, \
	src/httplib/mod/bbcode, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# bin/httplib.mod.htmlsanitize.dll

$(eval $(call emit_dll_rule,bin/httplib.mod.htmlsanitize.dll, \
	src/httplib/mod/htmlsanitize, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# bin/httplib.mod.oembed.dll

$(eval $(call emit_dll_rule,bin/httplib.mod.oembed.dll, \
	src/httplib/mod/oembed, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# bin/httplib.mod.textile.dll

$(eval $(call emit_dll_rule,bin/httplib.mod.textile.dll, \
	src/httplib/mod/textile, \
	bin/httplib.dll))


# ------------------------------------------------------------------------------
# CONTRIB

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
