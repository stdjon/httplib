# ------------------------------------------------------------------------------
# httplib.log.nlog.dll

$(eval $(call emit_dll_rule, \
	httplib.log.nlog.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


