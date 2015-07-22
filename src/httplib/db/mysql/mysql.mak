# ------------------------------------------------------------------------------
# httplib.db.mysql.dll

$(eval $(call emit_dll_rule, \
	httplib.db.mysql.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


