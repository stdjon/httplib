# ------------------------------------------------------------------------------
# httplib.test.dll

$(eval $(call emit_dll_rule, \
	httplib.test.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


