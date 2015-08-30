# ------------------------------------------------------------------------------
# forum.mod.iconify.dll

$(eval $(call emit_dll_rule, \
	forum.mod.iconify.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


