
class IBaseService():

    data = {}
    
    @classmethod
    async def start(cls):
        pass

    @classmethod
    async def stop(cls):
        pass

    @classmethod
    def get_data(cls):
        pass

    @classmethod
    def run_command(cls, *arg, **keys):
        pass

    @classmethod
    def on_load_data(cls, data):
        pass