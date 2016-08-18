module.exports = function (req, res) {
	var keystone = req.keystone;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	req.list.model.findById(req.params.id, function (err, item) {
		if (err) return res.status(500).json({ err: 'database error', detail: err });
		if (!item) return res.status(404).json({ err: 'not found', id: req.params.id });
		req.list.validateInput(item, req.body, function (err) {
			if (err) return res.status(400).json(err);
			req.list.updateItem(item, req.body, { files: req.files }, function (err) {
				if (err) return res.status(500).json({ error: err.error, detail: { message: err.detail.message, name: err.error } });
				res.json(req.list.getData(item));
			});
		});
	});
};
