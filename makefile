# ------------------------------------------------------------------------------
# CONFIGURATION

-include userconf.mak


# ------------------------------------------------------------------------------
#  Normalize 'flag' values: <empty> or 0 -> off, anything else -> on

_flag=$(if $(or $(findstring _[]_,_[$1]_), $(findstring _[0]_,_[$1]_)),,1)


# ------------------------------------------------------------------------------
# Common configuration

BIN?=bin
CONTRIB?=contrib/server
override NCCFLAGS:=$(NCCFLAGS) -no-color -warnaserror+
NUNIT?=$(CONTRIB)/NUnit-2.6.4

# Initializing these as empty non-recursive variables. (Target rules will append
# to these as they are evaluated.)
EXE_TARGETS:=
DLL_TARGETS:=


# ------------------------------------------------------------------------------
# Build Type

# Default to a debug build, but allow RELEASE=1 on the commmandline to configure
# a release build.
ifneq ($(call _flag,$(RELEASE)),)
DEBUG:=0
else
DEBUG?=1
endif


ifneq ($(call _flag,$(DEBUG)),)

# ------------------------------------------------------------------------------
# Debug

override NCCFLAGS:=$(NCCFLAGS) -g -d:DEBUG
override BIN:=$(BIN)/debug

else

# ------------------------------------------------------------------------------
# Release

override NCCFLAGS:=$(NCCFLAGS) -O -d:RELEASE
override BIN:=$(BIN)/release

endif


# ------------------------------------------------------------------------------
#  Platform

ifeq ($(OS),Windows_NT)

# ------------------------------------------------------------------------------
# Windows/.NET configuration

NCC?=ncc
launch_assembly=cd $(BIN)/ && ./$1
launch_nunit=$(NUNIT)/bin/nunit.exe --run $1 &
launch_nunit_console=$(NUNIT)/bin/nunit-console.exe --nologo $1

else

# ------------------------------------------------------------------------------
# Linux/Mono configuration

ifeq ($(NCC_PATH),)
$(error "Please set NCC_PATH to point to the Nemerle compiler (ncc.exe)")
endif

mono_path:=export MONO_PATH=$(NCC_PATH)
NCC?=mono $(NCC_PATH)/ncc.exe
launch_assembly=$(mono_path) && cd $(BIN)/ && mono $1
launch_nunit=$(mono_path) && $(NUNIT)/bin/nunit.exe --run $1 > /dev/null 2>&1 &
launch_nunit_console=$(mono_path) && mono $(NUNIT)/bin/nunit-console.exe --nologo $1

endif


# ------------------------------------------------------------------------------
# Contrib

CONTRIB_LIBS:= \
	CodeKicker.BBCode-Parser-5.0/CodeKicker.BBCode.dll \
	CsQuery-1.3.4/lib/net40/CsQuery.dll \
	HtmlSanitizer.2.0.5595.30325/lib/net40/HtmlSanitizer.dll \
	ImageProcessor-2.2.5/lib/net45/ImageProcessor.dll \
	MySql-Connector-6.9.6/v4.5/MySql.Data.dll \
	NDesk.Options-0.2.1.0/NDesk.Options.dll \
	NLog-3.2.1/net45/NLog.dll \
	NUnit-2.6.4/bin/nunit.framework.dll \
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
# Forum specfic config

FORUM_USER?=forum
FORUM_PASSWORD?=$(PW)
FORUM_DATABASE?=forum


# ------------------------------------------------------------------------------
# Rules Template

# $1 = target type (EXE, DLL)
# $2 = output assembly name
# $3 = path to source code directory
# $4 = additional dlls to reference (can be empty)
# $5 = additional args to ncc (can be empty, usually set by derived emits)
define emit_rule
$1_TARGETS+=$(BIN)/$2
$(BIN)/$2_SRC:=$$(foreach d,$3,$$(wildcard $$d/*.n))
$(BIN)/$2_DLLS:=$$(foreach d,$4,$(BIN)/$$d)

$(BIN)/$2: $$($(BIN)/$2_SRC) $$($(BIN)/$2_DLLS)
	@mkdir -p $$(dir $$@)
	$$(NCC) -o $$@ $(NCCFLAGS) $5 $$($$@_SRC) $$(refs)
endef


# Emit a rule for a .exe
emit_exe_rule=$(call emit_rule,EXE,$1,$2,$3)

# Emit a rule for a .dll assembly
emit_dll_rule=$(call emit_rule,DLL,$1,$2,$3,-t:library)

# Emit a rule for a .dll containing Nemerle macros
emit_macro_dll_rule=$(call emit_rule,DLL,$1,$2,$3,-r Nemerle.Compiler.dll -t:library)


# ------------------------------------------------------------------------------
# Rules setup

# all is the default
all:

# Phony targets
.PHONY: all clean install_contrib run frun fdata finit

# An empty default rule for any target not otherwise defined. This negates all
# make's built-in rules (and stops it from spending considerable time evaulating
# them). This is equivalent to specifying -r on the commandline.
%: ;


# ------------------------------------------------------------------------------
# APPLICATIONS

# ------------------------------------------------------------------------------
# forum.exe

$(eval $(call emit_exe_rule,forum.exe, \
	src/forum src/forum/*, \
	forum.mod.filter.dll \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll httplib.page.nustache.dll httplib.log.nlog.dll \
	httplib.mod.auth.dll httplib.mod.bbcode.dll httplib.mod.htmlsanitize.dll \
	httplib.mod.imageprocessor.dll httplib.mod.oembed.dll httplib.mod.textile.dll))


# ------------------------------------------------------------------------------
# forum.mod.filter.dll

$(eval $(call emit_dll_rule,forum.mod.filter.dll, \
	src/forum/mod/filter, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------
# forum-testdata.exe

$(eval $(call emit_exe_rule,forum-testdata.exe, \
	src/forum/tools/testdata, \
	forum.exe \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll httplib.page.nustache.dll httplib.log.nlog.dll \
	httplib.mod.auth.dll httplib.mod.bbcode.dll httplib.mod.htmlsanitize.dll \
	httplib.mod.oembed.dll httplib.mod.textile.dll))


# ------------------------------------------------------------------------------
# http.exe

$(eval $(call emit_exe_rule,http.exe, \
	src/myserver, \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll httplib.page.nustache.dll httplib.log.nlog.dll \
	httplib.mod.auth.dll httplib.mod.bbcode.dll \
	httplib.mod.htmlsanitize.dll httplib.mod.imageprocessor.dll \
	httplib.mod.textile.dll))


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
# httplib.mod.auth.dll

$(eval $(call emit_dll_rule,httplib.mod.auth.dll, \
	src/httplib/mod/auth, \
	httplib.dll httplib.macros.dll))


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
# httplib.mod.imageprocessor.dll

$(eval $(call emit_dll_rule,httplib.mod.imageprocessor.dll, \
	src/httplib/mod/image, \
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
# TESTS

$(eval $(call emit_dll_rule,httplib.test.dll, \
	src/httplib/test, \
	httplib.dll httplib.macros.dll))


# ------------------------------------------------------------------------------

# EXE_TARGETS and DLL_TARGETS should be filled out at this point
TARGETS:=$(EXE_TARGETS) $(DLL_TARGETS)


# ------------------------------------------------------------------------------
# RULES

.PHONY: all clean install_contrib run frun fdata finit

all: install_contrib $(TARGETS)

run: install_contrib $(BIN)/http.exe
	$(call launch_assembly,http.exe) $(shell pwd)/src/myserver $D

test: install_contrib $(BIN)/httplib.test.dll
	$(call launch_nunit_console,$(BIN)/httplib.test.dll)
	@echo "*** All tests passed!"

test-gui: install_contrib $(BIN)/httplib.test.dll
	$(call launch_nunit,$(BIN)/httplib.test.dll)

frun: install_contrib $(BIN)/forum.exe
	$(call launch_assembly,forum.exe) -R $(shell pwd)/src/forum $D

fdata: $(BIN)/forum-testdata.exe
	$(call launch_assembly,forum-testdata.exe) -R $(shell pwd)/src/forum $D

finit:
	mysql -D $(FORUM_DATABASE) -u $(FORUM_USER) -p$(FORUM_PASSWORD) < src/forum/init-dbs.mysql

clean:
	rm -rf $(BIN)/

# make show V=(variable)
show:
	@echo
	@echo $(V)="$($(V))"
	@echo

# make show:(variable)
show\:%:
	@echo
	@echo $(@:show:%=%)="$($(@:show:%=%))"
	@echo

# %-full target to build any target % in Debug and Release
%-full::
	@echo
	@echo "Making '$(@:%-full=%)' in all configurations:"
	@echo
	@$(MAKE) $(@:%-full=%) DEBUG=1
	@echo
	@$(MAKE) $(@:%-full=%) RELEASE=1
	@echo
	@echo "*** Finished building '$@'!"

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


