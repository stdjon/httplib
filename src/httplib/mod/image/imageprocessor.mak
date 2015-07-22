# ------------------------------------------------------------------------------
# httplib.mod.imageprocessor.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.imageprocessor.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


