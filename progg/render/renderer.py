
from abc import ABC, abstractmethod

from .. import dm

class Renderer(ABC):

    @abstractmethod
    def __call__(self, program: dm.Program):
        pass

