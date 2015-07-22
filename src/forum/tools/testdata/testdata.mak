# ------------------------------------------------------------------------------
# forum-testdata.exe

$(eval $(call emit_exe_rule, \
	forum-testdata.exe, \
	\
	$(this_dir), \
	\
	forum.exe \
	httplib.dll httplib.macros.dll \
	httplib.db.mysql.dll \
	httplib.page.nustache.dll \
	httplib.log.nlog.dll \
	httplib.mod.auth.dll \
	httplib.mod.bbcode.dll \
	httplib.mod.htmlsanitize.dll \
	httplib.mod.oembed.dll \
	httplib.mod.textile.dll \
	))


