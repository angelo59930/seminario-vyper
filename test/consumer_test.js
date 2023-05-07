const Consumer = artifacts.require("consumer");
const Storage = artifacts.require("storage");
const shared = require("./shared");

const verifyThrows = shared.verifyThrows;

contract("Consumer", function (accounts) {
  let storageInstance;
  let consumerInstance;
  const owner = accounts[0];

  before(async function () {
    storageInstance = await Storage.new();
    consumerInstance = await Consumer.new();
  });

  describe("Guardado de directorios", function () {
    it("Verificar que el consumidor guarda correctamente en el storage", async function () {
      const dirName = "pelis";
      const dirDesc = "mis peliculas fav";
      const user = "angelo";

      await consumerInstance.loadNewDir(dirName, dirDesc, user);

      await consumerInstance.setDir(dirName, storageInstance.address, user);

      const dir = await consumerInstance.viewDirData(
        dirName,
        storageInstance.address,
        user
      );

      assert.equal(dir.name, dirName);
      assert.equal(dir.description, dirDesc);
      assert.equal(dir.user, user);
    });

    it("Verificar que varios usuarios pueden tener directorios con distintos nombres", async function () {
      const dirName = "pelis-de-juan";
      const dirDesc = "mis peliculas fav";
      const user = "juan";

      await consumerInstance.loadNewDir(dirName, dirDesc, user);

      await consumerInstance.setDir(dirName, storageInstance.address, user);

      const dir = await consumerInstance.viewDirData(
        dirName,
        storageInstance.address,
        user
      );

      assert.equal(dir.name, dirName);
      assert.equal(dir.description, dirDesc);
      assert.equal(dir.user, user);
    });

    it("Verificar que un usuario no puede acceder al directorio de otro usuario", async function () {
      const dirName = "pelis";
      const user = "Juan";
      await verifyThrows(
        async () =>
          await consumerInstance.viewDirData(
            dirName,
            storageInstance.address,
            user
          ),
        /revert/
      );
    });

    it("Verificar que un usuario puede acceder a su directorio", async function () {
      const dirName = "pelis";
      const user = "angelo";

      const dir = await consumerInstance.viewDirData(
        dirName,
        storageInstance.address,
        user
      );

      assert.equal(dir.name, dirName);
      assert.equal(dir.user, user);
    });
  });

  describe("Guardado de archivos", function () {
    it("Verificar que el consumidor pueda crear un archivo", async function () {
      const dirName = "pelis";
      const fileName = "Terminator II";
      const fileDesc = "pelicula de accion";
      const size = 11264;
      const data = "0x1234567890";
      const user = "angelo";

      await consumerInstance.loadNewFile(fileName, fileDesc, size, data, user);

      await consumerInstance.setFileInDir(
        dirName,
        fileName,
        storageInstance.address,
        user
      );

      const dir = await consumerInstance.viewDirData(
        dirName,
        storageInstance.address,
        user
      );

      assert.equal(dir.files[0].name, fileName);
    });

    it("Verificar que un usuario no puede guardar en un directorio un archivo de otro usuario", async function () {
      const dirName = "pelis-de-juan";
      const fileName = "Terminator II";
      const user = "Juan";

      await verifyThrows(
        async () =>
          await consumerInstance.setFileInDir(
            dirName,
            fileName,
            storageInstance.address,
            user
          ),
        /revert/
      );
    });
  });
});
