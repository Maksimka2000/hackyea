# Canvases

Social Innovation Canvases built from a call's application form (`Imports/SampleData/canvas-templates.json`, from the ROPS
"Inkubator Włączenia Społecznego 2.0" form, sections 1 and 3–11). `CanvasContentChecker` validates shapes and returns
non-blocking warnings (plan periods longer than allowed, costs not matching the requested grant).

Room for improvement: a grant-call application generator. A template's `CallId` and `AvailableFrom/To` already limit it to a
call's window; a generator would read the canvas content and fill that call's form. Nothing of it is implemented yet.
