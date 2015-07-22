# ------------------------------------------------------------------------------
# httplib.mod.htmlsanitize.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.htmlsanitize.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


