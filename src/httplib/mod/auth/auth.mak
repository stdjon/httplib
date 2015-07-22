# ------------------------------------------------------------------------------
# httplib.mod.auth.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.auth.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


