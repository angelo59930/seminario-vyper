# @version ^0.3.7

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
def saveDirs(dir: Dir):
  self.dirs[dir.name] = dir

@external
def saveFileInDir(dirName: String[32], file: File):
  dir: Dir = self.dirs[dirName]

  # verificamos que el archivo sea del dueño del directorio
  assert dir.user == file.user, "You are not the owner of this file"
  
  # Buscamos la siguiente posición disponible en el arreglo de files
  nextIndex: int256 = -1
  
  for i in range(5):
    if dir.files[i].fileId == "":
      nextIndex = i
      break
      
  # Si no hay posiciones disponibles, lanzamos un error
  assert nextIndex >= 0, "The directory is full"
  
  # Insertamos el archivo en la posición disponible
  dir.files[nextIndex] = file
  
  # Actualizamos el directorio
  self.dirs[dirName] = dir

@view
@external
def getDirs(name: String[32], user: String[32]) -> Dir:
  dir: Dir = self.dirs[name]
  assert dir.user == user, "You are not the owner of this dir"
  return dir