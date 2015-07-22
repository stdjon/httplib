# ------------------------------------------------------------------------------
# httplib.mod.smtp.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.smtp.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


