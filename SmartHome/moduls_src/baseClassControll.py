

class BaseControllModule(object):
    def start(self):
        pass

    def end(self):
        pass

    def restart(self):
        pass

    def getPages(self):
        pass

    def getInfo(self):
        pass

    def getItems(self):
        pass

    def getRouter(self):
        return None
