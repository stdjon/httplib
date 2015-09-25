# ------------------------------------------------------------------------------
# forum.exe

$(eval $(call emit_exe_rule, \
	forum.exe, \
	\
	$(this_dir) \
	$(this_dir)/handlers, \
	 \
	forum.mod.filter.dll \
	forum.mod.iconify.dll \
	forum.mod.providers.dll \
	httplib.dll \
	httplib.macros.dll \
	httplib.db.mysql.dll \
	httplib.page.nustache.dll \
	httplib.log.nlog.dll \
	httplib.mod.auth.dll \
	httplib.mod.bbcode.dll \
	httplib.mod.htmlsanitize.dll \
	httplib.mod.imageprocessor.dll \
	httplib.mod.oembed.dll \
	httplib.mod.smtp.dll \
	httplib.mod.textile.dll))


