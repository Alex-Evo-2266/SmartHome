

class ISaveDevice():
	"""interface save device."""

	def save(self):
		'''
		save device value. not add to history
		'''
		pass

	async def save_and_addrecord(self):
		'''
		save device value and add to history
		'''
		pass
