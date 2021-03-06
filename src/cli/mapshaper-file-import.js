/* @requires
mapshaper-import
mapshaper-table-import
*/

api.importFile = function(path, opts) {
  cli.checkFileExists(path);
  opts = opts || {};
  var fileType = MapShaper.guessFileType(path),
      content = cli.readFile(path, MapShaper.isBinaryFileType(fileType) ? null : 'utf-8'),
      dataset = MapShaper.importFileContent(content, path, opts);
  if (dataset.info.input_format == 'shapefile') {
    dataset.layers[0].data = MapShaper.importShapefileDataTable(path, opts);
  }
  return dataset;
};

MapShaper.importShapefileDataTable = function(shpPath, opts) {
  var dbfPath = utils.replaceFileExtension(shpPath, 'dbf');
  var table = null;
  if (cli.isFile(dbfPath)) {
    table = MapShaper.importDbfFile(dbfPath, opts.encoding).data;
  } else {
    message(utils.format("[%s] .dbf file is missing -- shapes imported without attribute data.", shpPath));
  }
  return table;
};
