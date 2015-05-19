# httplib

httplib defines a webserver ([`httplib.Server`](./src/httplib/server.n)) which is build on top of the .NET/Mono `System.Net.HttpListener`. It supports 'out-of-the-box' fileserving, and fairly complex processing of user requests/URLs. It's highly configurable (using [YAML](http://www.yaml.org/)), and easy to extend&mdash;new modules and renderers can be loaded at runtime.

The code is written in Nemerle and compiles and runs on Windows and Linux platforms. The built assemblies (`httplib.dll` et al) should be usable by any .NET/Mono language.

See the `myserver/` or `forum/` sub-projects for examples of how to use the server. Please also have a look at the  [notes](./doc/notes.txt) for information on setting up a ([MySql](http://mysql.org/)) database connection or configuring your platform to support SSL/https serving.
