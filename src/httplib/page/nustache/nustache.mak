# ------------------------------------------------------------------------------
# httplib.page.nustache.dll

$(eval $(call emit_dll_rule,\
	httplib.page.nustache.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


