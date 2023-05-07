# @version ^0.3.7

interface Storage:
  def saveDirs(dir: Dir): nonpayable
  def saveFileInDir(dirName: String[32], file: File): nonpayable
  def getDirs(name: String[32], user: String[32]) -> Dir: view

struct File:
  fileId: String[32]
  name: String[32]
  desctription: String[128]
  size: int256
  data: String[1024]
  user: String[32]

struct Dir:
  name: String[32]
  description: String[128]
  user: String[32]
  files: File[5]

owner: address

dirs: HashMap[String[32], Dir]
files: HashMap[String[32], File]

@external
def __init__():
  self.owner = msg.sender

@external
def loadNewFile(name: String[32], description: String[128], size: int256, data: String[1024], user: String[32]):
  assert len(name) > 0, "Name is empty"
  assert len(description) > 0, "Description is empty"
  assert size > 0, "Size is empty"
  assert len(data) > 0, "Data is empty"

  # crear nuevo file
  newFile: File = File({
    fileId: name,
    name: name,
    desctription: description,
    size: size,
    data: data,
    user: user
  })

  # guardar file en el hashmap
  self.files[name] = newFile



@external
def loadNewDir(name: String[32], description: String[128], user: String[32]):
  assert len(name) > 0, "Name is empty"
  assert len(description) > 0, "Description is empty"

  # crear nuevo dir
  newDir: Dir = Dir({
    name: name,
    description: description,
    user: user,
    files: empty(File[5])
  })

  # guardar dir en el hashmap
  self.dirs[name] = newDir


@external
def setDir(name: String[32], addr: address, user: String[32]):

  # conseguimos el dir del hashmap
  newDir: Dir = self.dirs[name]
  # usamos la funcion del contrato storage
  storage: Storage = Storage(addr)
  # guardar dir
  storage.saveDirs(newDir)

@external
def setFileInDir(dirName: String[32], fileName: String[32], addr: address,user: String[32]):
  # usamos la funcion del contrato storage
  storage: Storage = Storage(addr)
  storage.saveFileInDir(dirName, self.files[fileName])


@view
@external
def viewDirData(name: String[32], addr: address, user:String[32]) -> Dir:
  storage: Storage = Storage(addr)
  return storage.getDirs(name, user)
  