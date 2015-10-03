# ------------------------------------------------------------------------------
# forum.mod.syntaxhighlight.dll

$(eval $(call emit_dll_rule, \
	forum.mod.syntaxhighlight.dll, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	))


