

class BaseControllModule(object):
    def start(self):
        pass

    def end(self):
        pass

    def restart(self):
        self.end()
        self.start()
