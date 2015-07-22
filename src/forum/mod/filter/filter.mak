# ------------------------------------------------------------------------------
# forum.mod.filter.dll

$(eval $(call emit_dll_rule, \
	forum.mod.filter.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


