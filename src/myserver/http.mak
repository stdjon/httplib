# ------------------------------------------------------------------------------
# http.exe

$(eval $(call emit_exe_rule, \
	http.exe, \
	\
	$(this_dir), \
	\
	httplib.dll \
	httplib.macros.dll \
	httplib.db.mysql.dll \
	httplib.page.nustache.dll \
	httplib.log.nlog.dll \
	httplib.mod.auth.dll \
	httplib.mod.bbcode.dll \
	httplib.mod.htmlsanitize.dll \
	httplib.mod.imageprocessor.dll \
	httplib.mod.textile.dll \
	))


