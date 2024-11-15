
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
    def run_command(cls, command, **keys):
        pass