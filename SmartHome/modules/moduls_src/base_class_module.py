

class BaseControllModule(object):

    dependencies = []

    def start(self):
        pass

    def end(self):
        pass

    def restart(self):
        self.end()
        self.start()
