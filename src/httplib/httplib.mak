# ------------------------------------------------------------------------------
# httplib.dll

$(eval $(call emit_dll_rule, \
	httplib.dll, \
	\
	$(this_dir), \
	\
	httplib.macros.dll \
	))


