# ------------------------------------------------------------------------------
# httplib.mod.textile.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.textile.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


