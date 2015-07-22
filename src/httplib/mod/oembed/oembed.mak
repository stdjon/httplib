# ------------------------------------------------------------------------------
# httplib.mod.oembed.dll

$(eval $(call emit_dll_rule, \
	httplib.mod.oembed.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


