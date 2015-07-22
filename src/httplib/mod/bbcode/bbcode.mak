# ------------------------------------------------------------------------------
# httplib.mod.bbcode.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.bbcode.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))



