# ------------------------------------------------------------------------------
# forum.mod.providers.dll

$(eval $(call emit_dll_rule, \
	forum.mod.providers.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	httplib.mod.oembed.dll \
	))


