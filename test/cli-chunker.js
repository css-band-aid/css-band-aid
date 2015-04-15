import { expect } from 'chai';
import fs from 'fs';
import fsp from 'fs-promise';
import path from 'path';
import chunk from '../src/chunk';
import _ from 'lodash';
import { ensureDir } from '../src/fs-utils';

const inputFixturesDir = path.join(__dirname, 'fixtures', 'input');
const outputFixturesDir = path.join(__dirname, 'fixtures', 'output', 'chunk');
const outputDebugDirRoot = path.join(__dirname, 'fixtures', 'output-debug');
const outputDebugDir = path.join(__dirname, 'fixtures', 'output-debug', 'chunk');

let ensureDebugDir = ensureDir(outputDebugDirRoot)
  .then(() => ensureDir(outputDebugDir));

function assertExpectations(data, index, fixtureName, suffix) {
  let outputFixtureFilename = index + suffix;
  let outputDebugFolder = path.join(outputDebugDir, fixtureName);
  let ensureFixtureDebugDir = ensureDebugDir.then(() => ensureDir(outputDebugFolder));
  let outputFixtureFilepath = path.join(outputFixturesDir, fixtureName, outputFixtureFilename);
  let outputDebugFilepath = path.join(outputDebugFolder, outputFixtureFilename);

  return ensureFixtureDebugDir
    .then(() => Promise.all([
        fsp.readFile(outputFixtureFilepath, { encoding: 'utf8' }),
        fsp.writeFile(outputDebugFilepath, data)
      ])
      .then(([d, ]) => d)
    )
    .then(outputFixtureData => {
      let safeData = data.replace(/\s+/g, '');
      let safeOutputFixtureData = outputFixtureData.replace(/\s+/g, '');
      expect(safeData).to.equal(safeOutputFixtureData);
    });
}

function testParserResults(fixtureName, result) {
  let dataChecks = result.data.map((chunkData, index) => assertExpectations(chunkData, index, fixtureName, '.css'));

  let sourceChecks = result.maps.map((sourcemap, index) => {
    let sourcemapString = JSON.stringify(sourcemap);
    return assertExpectations(sourcemapString, index, fixtureName, '.css.map');
  });

  return Promise.all([dataChecks, sourceChecks]);
}

function buildContext(fixtureName, filename) {
  return {
    [`with data from the fixture "${filename}" should parse the CSS correctly`]: {
      'without sourcemaps'(done) {
        let inputFixtureFilepath = path.join(inputFixturesDir, filename);
        fsp.readFile(inputFixtureFilepath, { encoding: 'utf8' })
          .then(inputFixtureData => {
            let result = chunk(inputFixtureData, { sourcemaps: false });
            return testParserResults(fixtureName, result);
          })
          .then(() => done())
          .catch(err => done(err));
      },
      'with sourcemaps'(done) {
        let inputFixtureFilepath = path.join(inputFixturesDir, filename);
        fsp.readFile(inputFixtureFilepath, { encoding: 'utf8' })
          .then(inputFixtureData => {
            let result = chunk(inputFixtureData, { sourcemaps: true, source: inputFixtureFilepath });
            return testParserResults(fixtureName, result);
          })
          .then(() => done())
          .catch(err => done(err));
      }
    }
  };
}

let inputFixtureFiles = fs.readdirSync(inputFixturesDir);

let spec = {
  Parser: inputFixtureFiles
    .filter(filename => /\.css$/.test(filename))
    .map(filename => {
      return {
        filename,
        fixtureName: path.basename(filename, path.extname(filename))
      };
    })
    .reduce((acc, { fixtureName, filename}) => {
      return _.extend({}, acc, buildContext(fixtureName, filename));
    }, {})
};

export default spec;
