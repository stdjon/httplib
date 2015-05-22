# ------------------------------------------------------------------------------
# CONFIGURATION

-include userconf.mak


# ------------------------------------------------------------------------------
# Common configuration

BIN?=bin
CONTRIB?=contrib/server


ifeq ($(OS),Windows_NT)

# ------------------------------------------------------------------------------
# Windows/.NET configuration

NCC?=ncc
launch_assembly=cd $(BIN)/ && ./$1

else

# ------------------------------------------------------------------------------
# Linux/Mono configuration

ifeq ($(NCC_PATH),)
$(error "Please set NCC_PATH to point to the Nemerle compiler (ncc.exe)")
endif

NCC?=mono $(NCC_PATH)/ncc.exe
launch_assembly=export MONO_PATH=$(NCC_PATH) && cd $(BIN)/ && mono $1

endif



# ------------------------------------------------------------------------------
# Contrib

CONTRIB_LIBS:= \
	CodeKicker.BBCode-Parser-5.0/CodeKicker.BBCode.dll \
	CsQuery-1.3.4/lib/net40/CsQuery.dll \
	HtmlSanitizer.2.0.5595.30325/lib/net40/HtmlSanitizer.dll \
	MySql-Connector-6.9.6/v4.5/MySql.Data.dll \
	NDesk.Options-0.2.1.0/NDesk.Options.dll \
	NLog-3.2.1/net45/NLog.dll \
	Nustache-1.14.0.4/Nustache.Core.dll \
	OEmbed.net-master/bin/Debug/Newtonsoft.Json.Net35.dll \
	OEmbed.net-master/bin/Debug/OEmbed.Net.dll \
	Textile-2.0.1/Textile.dll \
	yamldotnet-3.5.1.85/Release-Signed/YamlDotNet.dll \
	#


# ------------------------------------------------------------------------------
#  References

make_contrib_ref=$(foreach l,$1,-r $(CONTRIB)/$l)
contrib_refs=$(call make_contrib_ref,$(CONTRIB_LIBS))

make_local_ref=$(foreach l,$1,-r $l)
local_refs=$(call make_local_ref,$($@_DLLS))

refs=$(contrib_refs) $(local_refs)


# ------------------------------------------------------------------------------
# Rules Template

# $1 = output assembly name
# $2 = path to source code directory
# $3 = additional dlls to reference (can be empty)
# $4 = additional args to ncc (can be empty, usually set by derived emits)
define emit_rule
$(BIN)/$1_SRC:=$$(wildcard $2/*.n)
$(BIN)/$1_DLLS:=$$(foreach d,$3,$(BIN)/$$d)

$(BIN)/$1: $$($(BIN)/$1_SRC) $$($(BIN)/$1_DLLS)
	@mkdir -p $$(dir $$@)
	$$(NCC) -no-color -o $$@ $$($$@_SRC) $$(refs) $4
endef


emit_exe_rule=$(call emit_rule,$1,$2,$3)
emit_dll_rule=$(call emit_rule,$1,$2,$3,-t:library)
emit_macro_dll_rule=$(call emit_rule,$1,$2,$3,-r Nemerle.Compiler.dll -t:library)


# ------------------------------------------------------------------------------
# Targets

.PHONY: all clean install_contrib run frun fdata finit


all: install_contrib $(BIN)/http.exe $(BIN)/forum.exe $(BIN)/forum-testdata.exe

run: $(BIN)/http.exe
	$(call launch_assembly,http.exe) $D

frun: $(BIN)/forum.exe
	$(call launch_assembly,forum.exe) $D

fdata: $(BIN)/forum-testdata.exe
	$(call launch_assembly,forum-testdata.exe) $D

finit:
	mysql -D forum -u forum -p$(PW) < src/forum/init-dbs.mysql

clean:
	rm -rf $(BIN)/


# ------------------------------------------------------------------------------
# APPLICATIONS

# ------------------------------------------------------------------------------
# forum.exe

$(eval $(call emit_exe_rule,forum.exe, \
	src/forum, \
	forum.mod.auth.dll \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll httplib.page.nustache.dll httplib.log.nlog.dll \
	httplib.mod.bbcode.dll httplib.mod.htmlsanitize.dll \
	httplib.mod.oembed.dll httplib.mod.textile.dll))


# ------------------------------------------------------------------------------
# forum-testdata.exe

$(eval $(call emit_exe_rule,forum-testdata.exe, \
	src/forum/tools/testdata, \
	forum.exe \
	forum.mod.auth.dll \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll httplib.page.nustache.dll httplib.log.nlog.dll \
	httplib.mod.bbcode.dll httplib.mod.htmlsanitize.dll \
	httplib.mod.oembed.dll httplib.mod.textile.dll))


# ------------------------------------------------------------------------------
# forum.mod.auth.dll

$(eval $(call emit_dll_rule,forum.mod.auth.dll, \
	src/forum/mod/auth, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# http.exe

$(eval $(call emit_exe_rule,http.exe, \
	src/myserver, \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll httplib.page.nustache.dll \
	httplib.log.nlog.dll))


# ------------------------------------------------------------------------------
# HTTPLIB CORE

# ------------------------------------------------------------------------------
# httplib.dll

$(eval $(call emit_dll_rule,httplib.dll, \
	src/httplib, \
	httplib.macros.dll))


# ------------------------------------------------------------------------------
# httplib.macros.dll

$(eval $(call emit_macro_dll_rule,httplib.macros.dll, \
	src/httplib/macros))


# ------------------------------------------------------------------------------
# DATABASES

# ------------------------------------------------------------------------------
# httplib.db.mysql.dll

$(eval $(call emit_dll_rule,httplib.db.mysql.dll, \
	src/httplib/db/mysql, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# LOGGING

# ------------------------------------------------------------------------------
# httplib.log.nlog.dll

$(eval $(call emit_dll_rule,httplib.log.nlog.dll, \
	src/httplib/log/nlog, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# RENDERERS

# ------------------------------------------------------------------------------
# httplib.page.nustache.dll

$(eval $(call emit_dll_rule,httplib.page.nustache.dll, \
	src/httplib/page/nustache, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# MODULES

# ------------------------------------------------------------------------------
# httplib.mod.bbcode.dll

$(eval $(call emit_dll_rule,httplib.mod.bbcode.dll, \
	src/httplib/mod/bbcode, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# httplib.mod.htmlsanitize.dll

$(eval $(call emit_dll_rule,httplib.mod.htmlsanitize.dll, \
	src/httplib/mod/htmlsanitize, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# httplib.mod.oembed.dll

$(eval $(call emit_dll_rule,httplib.mod.oembed.dll, \
	src/httplib/mod/oembed, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# httplib.mod.textile.dll

$(eval $(call emit_dll_rule,httplib.mod.textile.dll, \
	src/httplib/mod/textile, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# CONTRIB

# ------------------------------------------------------------------------------
# install_contrib
# Copy dlls listed by CONTRIB_LIBS to the default path of the built assemblies
# and executables (currently $(BIN)/)

define cp_contrib_lib
$1: $(CONTRIB)/$2
	@mkdir -p $(dir $1)
	cp $(CONTRIB)/$2 $1
endef

$(foreach l,$(CONTRIB_LIBS),$(eval $(call cp_contrib_lib,$(BIN)/$(notdir $l),$l)))

install_contrib: $(foreach l,$(CONTRIB_LIBS),$(BIN)/$(notdir $l))
