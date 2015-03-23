# try:
#     from .chronos.chronos.settings.base import *
# except ImportError:
#     from chronos.settings.base import *

try:
    from local_settings import *
except ImportError:
    pass